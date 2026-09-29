"""
AutoGov+ Machine Learning / Deep Learning Training Pipeline
PyTorch Deep Neural Network with Automatic GPU Acceleration & Device Placement

Key Architecture:
- Strict requirement: device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
- Automatic CUDA detection and hardware telemetry
- Dynamic device placement for model, inputs, and targets:
    * model.to(device)
    * inputs.to(device)
    * labels.to(device)
- TabularResNet Architecture with LayerNorm, GELU, and Skip Connections
- Stratified sampling, Inverse Class Weights, and Cosine Annealing
"""

import os
import csv
import json
import random
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

# ==============================================================================
# 1. Hardware Detection & Device Setup
# ==============================================================================
def setup_device() -> torch.device:
    """
    Detects hardware accelerator (CUDA GPU) and returns torch.device.
    Prints device properties if CUDA is available, otherwise explains CPU fallback.
    """
    # Exact required logic:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    print("=" * 80)
    print("AutoGov+ AI Engine - PyTorch Training Environment Setup")
    print("=" * 80)
    print(f"[Device Selection] Selected Device: {device}")

    if device.type == "cuda":
        gpu_id = torch.cuda.current_device()
        gpu_name = torch.cuda.get_device_name(gpu_id)
        gpu_props = torch.cuda.get_device_properties(gpu_id)
        total_vram_gb = gpu_props.total_memory / (1024 ** 3)
        cuda_arch = torch.cuda.get_device_capability(gpu_id)

        print(f"[GPU Detected] Hardware Name    : {gpu_name}")
        print(f"[GPU Detected] Device Index     : {gpu_id}")
        print(f"[GPU Detected] Compute Version  : {cuda_arch[0]}.{cuda_arch[1]}")
        print(f"[GPU Detected] Total VRAM       : {total_vram_gb:.2f} GB")
        print(f"[GPU Detected] PyTorch CUDA Ver : {torch.version.cuda}")
        print(f"[GPU Detected] Streaming MP Cnt : {gpu_props.multi_processor_count}")
        print("[GPU Status] CUDA acceleration is ACTIVE. All model tensors & gradients will run on GPU.")
    else:
        print("[Device Status] CUDA is not available in the current PyTorch environment.")
        print("[Device Status] Falling back cleanly to CPU computation.")
    print("=" * 80)

    return device


# ==============================================================================
# 2. Production Dataset & Stratified Preprocessing
# ==============================================================================
class ProductionVerificationDataset(Dataset):
    def __init__(self, records, vocab_map=None, continuous_stats=None, is_train=True):
        super().__init__()
        
        self.label_map = {"PASS": 0, "MANUAL_REVIEW": 1, "FAIL": 2}
        self.idx_to_label = {v: k for k, v in self.label_map.items()}

        if vocab_map is None:
            self.service_categories = sorted(list({r["service_category"] for r in records}))
            self.states = sorted(list({r["state"] for r in records}))
            self.doc_statuses = sorted(list({r["document_status"] for r in records}))
        else:
            self.service_categories = vocab_map["service_categories"]
            self.states = vocab_map["states"]
            self.doc_statuses = vocab_map["doc_statuses"]

        raw_conts = []
        for r in records:
            q = float(r.get("document_quality_score", 0.8))
            f = float(r.get("fraud_risk_score", 0.2))
            yr = float(r.get("issue_year", 2024))
            raw_conts.append([q, f, f * (1.0 - q), (yr - 2022.0) / 4.0])

        raw_conts = np.array(raw_conts, dtype=np.float32)

        if continuous_stats is None:
            self.continuous_stats = {
                "mean": raw_conts.mean(axis=0).tolist(),
                "std": raw_conts.std(axis=0).tolist()
            }
        else:
            self.continuous_stats = continuous_stats

        means = np.array(self.continuous_stats["mean"], dtype=np.float32)
        stds = np.array([max(s, 1e-6) for s in self.continuous_stats["std"]], dtype=np.float32)

        features = []
        targets = []

        for idx, r in enumerate(records):
            norm_cont = ((raw_conts[idx] - means) / stds).tolist()

            ocr_name = float(r.get("ocr_name_match", 1))
            ocr_date = float(r.get("ocr_date_match", 1))
            mismatch_penalty = (1.0 - ocr_name) + (1.0 - ocr_date)

            svc_vec = [1.0 if r.get("service_category") == cat else 0.0 for cat in self.service_categories]
            state_vec = [1.0 if r.get("state") == st else 0.0 for st in self.states]
            status_vec = [1.0 if r.get("document_status") == st else 0.0 for st in self.doc_statuses]

            feature_vec = norm_cont + [ocr_name, ocr_date, mismatch_penalty] + svc_vec + state_vec + status_vec
            raw_target = r.get("verification_result", "MANUAL_REVIEW").strip().upper()
            target_idx = self.label_map.get(raw_target, 1)

            features.append(feature_vec)
            targets.append(target_idx)

        self.features = torch.tensor(features, dtype=torch.float32)
        self.targets = torch.tensor(targets, dtype=torch.long)
        self.input_dim = self.features.shape[1]
        self.num_classes = len(self.label_map)

    def __len__(self):
        return len(self.targets)

    def __getitem__(self, idx):
        return self.features[idx], self.targets[idx]


def get_stratified_split(records, split_ratio=0.8, seed=42):
    rng = random.Random(seed)
    by_class = {}
    for r in records:
        c = r["verification_result"]
        by_class.setdefault(c, []).append(r)

    train_recs, val_recs = [], []
    for c, items in by_class.items():
        rng.shuffle(items)
        n = int(len(items) * split_ratio)
        train_recs.extend(items[:n])
        val_recs.extend(items[n:])

    rng.shuffle(train_recs)
    rng.shuffle(val_recs)
    return train_recs, val_recs


# ==============================================================================
# 3. Residual Tabular Architecture (TabularResNet)
# ==============================================================================
class AutoGovVerificationNet(nn.Module):
    """
    Residual Tabular Neural Network with Skip-Connections and LayerNorm.
    Robust to any batch size and immune to small-sample normalization crashes.
    """
    def __init__(self, input_dim: int, hidden_dim: int = 64, num_classes: int = 3, dropout_rate: float = 0.25):
        super().__init__()
        
        self.input_proj = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.GELU()
        )

        # Residual Block 1
        self.res1_fc1 = nn.Linear(hidden_dim, hidden_dim)
        self.res1_norm1 = nn.LayerNorm(hidden_dim)
        self.res1_act = nn.GELU()
        self.res1_drop = nn.Dropout(dropout_rate)
        self.res1_fc2 = nn.Linear(hidden_dim, hidden_dim)
        self.res1_norm2 = nn.LayerNorm(hidden_dim)

        # Residual Block 2
        self.res2_fc1 = nn.Linear(hidden_dim, hidden_dim)
        self.res2_norm1 = nn.LayerNorm(hidden_dim)
        self.res2_act = nn.GELU()
        self.res2_drop = nn.Dropout(dropout_rate)
        self.res2_fc2 = nn.Linear(hidden_dim, hidden_dim)
        self.res2_norm2 = nn.LayerNorm(hidden_dim)

        # Classification Head
        self.head = nn.Sequential(
            nn.Linear(hidden_dim, 32),
            nn.LayerNorm(32),
            nn.GELU(),
            nn.Dropout(0.15),
            nn.Linear(32, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        h = self.input_proj(x)
        r1 = self.res1_norm2(self.res1_fc2(self.res1_drop(self.res1_act(self.res1_norm1(self.res1_fc1(h))))))
        h = torch.relu(h + r1)
        r2 = self.res2_norm2(self.res2_fc2(self.res2_drop(self.res2_act(self.res2_norm1(self.res2_fc1(h))))))
        h = torch.relu(h + r2)
        return self.head(h)


# ==============================================================================
# 4. Training & Validation Loop (GPU Accelerated)
# ==============================================================================
def train_model(
    data_path: str = "data/verification_dataset_1000.csv",
    output_dir: str = "models",
    epochs: int = 40,
    batch_size: int = 32,
    learning_rate: float = 0.002,
    weight_decay: float = 1e-3,
    patience: int = 15
):
    # Step 1: Detect and set device
    device = setup_device()

    # Step 2: Prepare datasets and data loaders
    if not os.path.exists(data_path):
        data_path = "data/synthetic_verification_dataset.csv"

    print(f"\n[Data Pipeline] Loading records from: {data_path}")
    with open(data_path, "r", encoding="utf-8") as f:
        records = list(csv.DictReader(f))

    train_recs, val_recs = get_stratified_split(records, split_ratio=0.8, seed=42)
    train_dataset = ProductionVerificationDataset(train_recs, is_train=True)
    vocab_map = {
        "service_categories": train_dataset.service_categories,
        "states": train_dataset.states,
        "doc_statuses": train_dataset.doc_statuses
    }
    val_dataset = ProductionVerificationDataset(
        val_recs,
        vocab_map=vocab_map,
        continuous_stats=train_dataset.continuous_stats,
        is_train=False
    )

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    print(f"[Data Pipeline] Training samples  : {len(train_dataset)}")
    print(f"[Data Pipeline] Validation samples: {len(val_dataset)}")
    print(f"[Data Pipeline] Input dimensions  : {train_dataset.input_dim}")
    print(f"[Data Pipeline] Output classes    : {train_dataset.num_classes} ({train_dataset.label_map})")

    # Step 3: Instantiate Model and move to target device (GPU/CPU)
    model = AutoGovVerificationNet(input_dim=train_dataset.input_dim, hidden_dim=64, num_classes=train_dataset.num_classes)
    
    # Requirement: model.to(device)
    model.to(device)
    print(f"[Model Deployment] AutoGovVerificationNet successfully moved to: {next(model.parameters()).device}")

    # Cost-sensitive weights
    y_tr = train_dataset.targets.tolist()
    counts_tr = [y_tr.count(i) for i in range(3)]
    total_tr = len(y_tr)
    class_weights = torch.tensor([total_tr / (3.0 * max(c, 1)) for c in counts_tr], dtype=torch.float32).to(device)

    criterion = nn.CrossEntropyLoss(weight=class_weights)
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

    os.makedirs(output_dir, exist_ok=True)
    best_val_loss = float("inf")
    best_val_acc = 0.0
    best_model_path = os.path.join(output_dir, "best_model.pth")
    runtime_model_path = os.path.join(output_dir, "verification_model.pth")
    patience_cnt = 0

    print("\n" + "=" * 80)
    print(f"Starting Model Training ({epochs} Epochs) on {device.type.upper()}...")
    print("=" * 80)

    for epoch in range(1, epochs + 1):
        model.train()
        running_train_loss = 0.0
        train_correct = 0
        train_total = 0

        for inputs, labels in train_loader:
            # Requirements: inputs.to(device) & labels.to(device)
            inputs = inputs.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_train_loss += loss.item() * inputs.size(0)
            preds = torch.argmax(outputs, dim=1)
            train_total += labels.size(0)
            train_correct += (preds == labels).sum().item()

        scheduler.step()
        epoch_train_loss = running_train_loss / train_total
        epoch_train_acc = (train_correct / train_total) * 100.0

        # Validation Phase
        model.eval()
        running_val_loss = 0.0
        val_correct = 0
        val_total = 0
        all_preds = []
        all_targets = []

        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs = inputs.to(device)
                labels = labels.to(device)

                outputs = model(inputs)
                loss = criterion(outputs, labels)

                running_val_loss += loss.item() * inputs.size(0)
                preds = torch.argmax(outputs, dim=1)
                val_total += labels.size(0)
                val_correct += (preds == labels).sum().item()
                all_preds.extend(preds.cpu().tolist())
                all_targets.extend(labels.cpu().tolist())

        epoch_val_loss = running_val_loss / max(val_total, 1)
        epoch_val_acc = (val_correct / max(val_total, 1)) * 100.0

        is_best = epoch_val_loss < best_val_loss
        if is_best:
            best_val_loss = epoch_val_loss
            best_val_acc = epoch_val_acc
            patience_cnt = 0
            torch.save({
                "epoch": epoch,
                "model_state_dict": model.state_dict(),
                "optimizer_state_dict": optimizer.state_dict(),
                "val_loss": best_val_loss,
                "val_acc": epoch_val_acc,
                "input_dim": train_dataset.input_dim,
                "num_classes": train_dataset.num_classes,
                "device_trained_on": str(device)
            }, best_model_path)
            torch.save({
                "model_state_dict": model.state_dict(),
                "input_dim": train_dataset.input_dim,
                "num_classes": train_dataset.num_classes,
                "device_trained_on": str(device)
            }, runtime_model_path)
        else:
            patience_cnt += 1

        flag = " [* Best Checkpoint]" if is_best else ""
        if epoch % 5 == 0 or epoch == 1 or epoch == epochs or is_best:
            print(f"Epoch [{epoch:02d}/{epochs:02d}] "
                  f"Train Loss: {epoch_train_loss:.4f} | Train Acc: {epoch_train_acc:5.1f}% | "
                  f"Val Loss: {epoch_val_loss:.4f} | Val Acc: {epoch_val_acc:5.1f}%{flag}")

        if patience_cnt >= patience:
            print(f"\n[Early Stopping] Triggered at epoch {epoch}.")
            break

    print("=" * 80)
    print(f"Training Complete! Best model saved to: {best_model_path}")
    print(f"Best Validation Loss: {best_val_loss:.4f} | Best Validation Accuracy: {best_val_acc:.2f}%")

    # Step 5: Save Schema & Model Metadata
    metadata_path = os.path.join(output_dir, "model_metadata.json")
    metadata = {
        "model_architecture": "AutoGovVerificationNet (TabularResNet)",
        "input_dimension": train_dataset.input_dim,
        "classes": train_dataset.idx_to_label,
        "service_categories": train_dataset.service_categories,
        "states": train_dataset.states,
        "doc_statuses": train_dataset.doc_statuses,
        "continuous_stats": train_dataset.continuous_stats,
        "device_trained_on": str(device),
        "best_val_accuracy": round(best_val_acc, 2),
        "best_val_loss": round(best_val_loss, 4)
    }
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Model metadata & schema saved to: {metadata_path}")

    # Step 6: Quick GPU/CPU Inference Verification
    run_sample_inference(model, device, val_dataset)


# ==============================================================================
# 5. Live Inference Verification
# ==============================================================================
def run_sample_inference(model: nn.Module, device: torch.device, dataset: ProductionVerificationDataset):
    print("\n" + "=" * 80)
    print("[Inference Test] Verifying live sample prediction on active device...")
    print("=" * 80)

    model.eval()
    sample_feat, actual_label_idx = dataset[0]
    sample_tensor = sample_feat.unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(sample_tensor)
        probs = torch.softmax(logits, dim=1).squeeze(0)
        pred_idx = torch.argmax(probs).item()

    pred_label = dataset.idx_to_label[pred_idx]
    actual_label = dataset.idx_to_label[actual_label_idx.item()]
    conf = probs[pred_idx].item() * 100.0

    print(f"Inference Device : {sample_tensor.device}")
    print(f"Actual Label     : {actual_label}")
    print(f"Predicted Label  : {pred_label} (Confidence: {conf:.1f}%)")
    print(f"Class Probs      : PASS={probs[0]*100:.1f}%, MANUAL={probs[1]*100:.1f}%, FAIL={probs[2]*100:.1f}%")
    print("=" * 80)


if __name__ == "__main__":
    train_model()
