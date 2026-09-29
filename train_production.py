"""
AutoGov+ Institutional Document Verification Deep Learning Engine
==================================================================
Production PyTorch Training Pipeline with GPU Acceleration & Device Placement

Key Architecture:
- Strict requirement: device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
- Dynamic hardware telemetry: Prints device properties, VRAM, and GPU model
- Uniform device placement:
    * model.to(device)
    * inputs.to(device)
    * labels.to(device)
- Automatic fallback to CPU if CUDA is unavailable
- TabularResNet architecture with Skip Connections, LayerNorm, and GELU
- Stratified sampling, Cost-sensitive loss weighting, and Cosine Annealing
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
# 1. Reproducibility & Device Configuration
# ==============================================================================
def seed_everything(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

def setup_device() -> torch.device:
    """
    Detects hardware accelerator (CUDA GPU) and configures torch.device.
    Prints device properties if CUDA is available, otherwise explains CPU fallback.
    """
    # Strict requirement:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    print("=" * 80)
    print("AutoGov+ AI Engine - PyTorch Training Pipeline")
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
        print("[Device Status] CUDA is not currently active in this PyTorch session.")
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

        # Collect continuous features for standardization
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
            # Standardized continuous features
            norm_cont = ((raw_conts[idx] - means) / stds).tolist()

            # Discrete indicators
            ocr_name = float(r.get("ocr_name_match", 1))
            ocr_date = float(r.get("ocr_date_match", 1))
            mismatch_penalty = (1.0 - ocr_name) + (1.0 - ocr_date)

            # One-hot categoricals
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
# 3. TabularResNet Architecture (Robust with LayerNorm & GELU)
# ==============================================================================
class TabularResNet(nn.Module):
    """
    Residual Tabular Neural Network with Skip-Connections and LayerNorm.
    LayerNorm is fully immune to batch size 1 fluctuations and guarantees stable
    gradient flow regardless of batch composition.
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
        # Residual Block 1
        r1 = self.res1_norm2(self.res1_fc2(self.res1_drop(self.res1_act(self.res1_norm1(self.res1_fc1(h))))))
        h = torch.relu(h + r1)
        # Residual Block 2
        r2 = self.res2_norm2(self.res2_fc2(self.res2_drop(self.res2_act(self.res2_norm1(self.res2_fc1(h))))))
        h = torch.relu(h + r2)
        return self.head(h)


# ==============================================================================
# 4. Evaluation Function
# ==============================================================================
def evaluate(model, loader, criterion, device):
    model.eval()
    total_loss = 0.0
    total_samples = 0
    all_preds = []
    all_targets = []

    with torch.no_grad():
        for inputs, targets in loader:
            inputs = inputs.to(device)
            targets = targets.to(device)

            outputs = model(inputs)
            loss = criterion(outputs, targets)

            total_loss += loss.item() * inputs.size(0)
            preds = torch.argmax(outputs, dim=1)

            all_preds.extend(preds.cpu().tolist())
            all_targets.extend(targets.cpu().tolist())
            total_samples += targets.size(0)

    avg_loss = total_loss / max(total_samples, 1)
    acc = sum(p == t for p, t in zip(all_preds, all_targets)) / max(total_samples, 1)

    matrix = [[0]*3 for _ in range(3)]
    for t, p in zip(all_targets, all_preds):
        matrix[t][p] += 1

    f1s, precs, recs = [], [], []
    for i in range(3):
        tp = matrix[i][i]
        fp = sum(matrix[r][i] for r in range(3)) - tp
        fn = sum(matrix[i][c] for c in range(3)) - tp
        p = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        r = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f = (2 * p * r) / (p + r) if (p + r) > 0 else 0.0
        precs.append(p)
        recs.append(r)
        f1s.append(f)

    macro_f1 = sum(f1s) / 3.0
    return {
        "loss": avg_loss,
        "acc": acc,
        "macro_f1": macro_f1,
        "matrix": matrix,
        "f1_per_class": f1s,
        "precs": precs,
        "recs": recs
    }


# ==============================================================================
# 5. Full GPU Accelerated Training Loop
# ==============================================================================
def train_production_model(
    data_path: str = "data/verification_dataset_1000.csv",
    output_dir: str = "models",
    epochs: int = 40,
    batch_size: int = 32,
    learning_rate: float = 0.002,
    weight_decay: float = 1e-3,
    patience: int = 15
):
    seed_everything(42)
    device = setup_device()

    with open(data_path, "r", encoding="utf-8") as f:
        records = list(csv.DictReader(f))

    print(f"\n[Dataset] Loaded {len(records)} records from: {data_path}")
    train_recs, val_recs = get_stratified_split(records, split_ratio=0.8, seed=42)

    # Build datasets
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

    print(f"[Dataset Split] Training Set  : {len(train_dataset)} samples")
    print(f"[Dataset Split] Validation Set: {len(val_dataset)} samples")
    print(f"[Dataset Split] Input Features: {train_dataset.input_dim}")

    # Compute inverse-frequency class weights
    y_tr = train_dataset.targets.tolist()
    counts_tr = [y_tr.count(i) for i in range(3)]
    total_tr = len(y_tr)
    class_weights = torch.tensor([total_tr / (3.0 * max(c, 1)) for c in counts_tr], dtype=torch.float32).to(device)
    print(f"[Cost-Sensitive Weights] PASS: {class_weights[0]:.2f}, MANUAL: {class_weights[1]:.2f}, FAIL: {class_weights[2]:.2f}")

    # Instantiate model and move to device
    model = TabularResNet(input_dim=train_dataset.input_dim, hidden_dim=64, num_classes=3, dropout_rate=0.20)
    model.to(device)

    # Verify device placement
    param_device = next(model.parameters()).device
    print(f"[Model Deployment] TabularResNet successfully placed on: {param_device}")

    criterion = nn.CrossEntropyLoss(weight=class_weights)
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

    os.makedirs(output_dir, exist_ok=True)
    best_val_f1 = -1.0
    best_val_acc = 0.0
    best_eval = None
    best_epoch = 0
    patience_cnt = 0

    print("\n" + "=" * 80)
    print(f"Starting GPU-Accelerated Training ({epochs} Epochs) on {device}...")
    print("=" * 80)

    for epoch in range(1, epochs + 1):
        model.train()
        running_train_loss = 0.0
        train_correct = 0
        train_total = 0

        for inputs, labels in train_loader:
            # Strict requirement: inputs.to(device), labels.to(device)
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
        epoch_tr_loss = running_train_loss / train_total
        epoch_tr_acc = (train_correct / train_total) * 100.0

        # Evaluate on validation split
        val_res = evaluate(model, val_loader, criterion, device)
        epoch_va_loss = val_res["loss"]
        epoch_va_acc = val_res["acc"] * 100.0
        epoch_va_f1 = val_res["macro_f1"] * 100.0

        is_best = val_res["macro_f1"] > best_val_f1
        if is_best:
            best_val_f1 = val_res["macro_f1"]
            best_val_acc = epoch_va_acc
            best_eval = val_res
            best_epoch = epoch
            patience_cnt = 0

            # Save champion checkpoint
            torch.save({
                "epoch": epoch,
                "model_state_dict": model.state_dict(),
                "optimizer_state_dict": optimizer.state_dict(),
                "val_loss": epoch_va_loss,
                "val_acc": epoch_va_acc,
                "macro_f1": epoch_va_f1,
                "input_dim": train_dataset.input_dim,
                "num_classes": train_dataset.num_classes,
                "device": str(device)
            }, os.path.join(output_dir, "best_model.pth"))

            # Also save as verification_model.pth for runtime service
            torch.save({
                "model_state_dict": model.state_dict(),
                "input_dim": train_dataset.input_dim,
                "num_classes": train_dataset.num_classes,
                "device": str(device)
            }, os.path.join(output_dir, "verification_model.pth"))
        else:
            patience_cnt += 1

        flag = " [* Best]" if is_best else ""
        if epoch % 5 == 0 or epoch == 1 or epoch == epochs or is_best:
            print(f"Epoch [{epoch:02d}/{epochs:02d}] "
                  f"Train Loss: {epoch_tr_loss:.4f} | Train Acc: {epoch_tr_acc:5.1f}% | "
                  f"Val Loss: {epoch_va_loss:.4f} | Val Acc: {epoch_va_acc:5.1f}% | Val Macro F1: {epoch_va_f1:5.1f}%{flag}")

        if patience_cnt >= patience:
            print(f"\n[Early Stopping] Triggered at epoch {epoch} (No improvement for {patience} epochs).")
            break

    print("\n" + "=" * 80)
    print("TRAINING COMPLETE - FINAL PERFORMANCE REPORT")
    print("=" * 80)
    print(f"Champion Epoch           : {best_epoch}")
    print(f"Validation Accuracy      : {best_val_acc:.2f}%")
    print(f"Validation Macro F1      : {best_val_f1 * 100:.2f}%")
    print(f"Validation Loss          : {best_eval['loss']:.4f}")
    print("-" * 80)
    print("Class-by-Class Breakdown:")
    for idx in range(3):
        label_name = train_dataset.idx_to_label[idx]
        p = best_eval["precs"][idx] * 100
        r = best_eval["recs"][idx] * 100
        f = best_eval["f1_per_class"][idx] * 100
        print(f"  {label_name:15s} | Precision: {p:5.1f}% | Recall: {r:5.1f}% | F1-Score: {f:5.1f}%")
    print("-" * 80)
    print("Confusion Matrix:")
    print("                   Pred PASS  Pred MANUAL  Pred FAIL")
    for idx, row in enumerate(best_eval["matrix"]):
        label_name = train_dataset.idx_to_label[idx]
        print(f"  True {label_name:12s} {row[0]:10d} {row[1]:12d} {row[2]:10d}")
    print("=" * 80)

    # Save metadata schema
    schema = {
        "model_architecture": "TabularResNet",
        "input_dimension": train_dataset.input_dim,
        "classes": train_dataset.idx_to_label,
        "service_categories": train_dataset.service_categories,
        "states": train_dataset.states,
        "doc_statuses": train_dataset.doc_statuses,
        "continuous_stats": train_dataset.continuous_stats,
        "device_trained_on": str(device),
        "validation_accuracy": round(best_val_acc, 2),
        "validation_macro_f1": round(best_val_f1 * 100, 2)
    }
    with open(os.path.join(output_dir, "model_metadata.json"), "w", encoding="utf-8") as f:
        json.dump(schema, f, indent=2)

    print(f"Best model checkpoint saved to: {os.path.join(output_dir, 'best_model.pth')}")
    print(f"Model schema & metadata saved to: {os.path.join(output_dir, 'model_metadata.json')}")

if __name__ == "__main__":
    train_production_model()
