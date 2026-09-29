"""
AutoGov+ Systematic Model Improvement & Ablation Experiments
================================================================================
Exhaustive benchmarking across 6 systematic stages:
- Stage 0: Baseline (Unweighted CrossEntropy, Random Split, Standard MLP)
- Stage 1: Stratified Sampling & Train/Val Alignment
- Stage 2: Balanced Class Weighting (Cost-Sensitive CrossEntropy)
- Stage 3: Domain Feature Engineering & Z-Score Standardization
- Stage 4: Tabular Data Augmentation (Feature Jittering & Same-Class Mixup)
- Stage 5: Residual Tabular Architecture (TabularResNet) with Weight Decay & Early Stopping
================================================================================
"""

import os
import csv
import json
import random
import copy
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

# Set seed for exact reproducibility across all experiments
def seed_everything(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

seed_everything(42)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[Device Selection] Running experiments on: {device}")
if device.type == "cuda":
    print(f"[GPU Telemetry] GPU Name: {torch.cuda.get_device_name(0)}")

# Load raw records
CSV_PATH = "data/synthetic_verification_dataset.csv"
with open(CSV_PATH, "r", encoding="utf-8") as f:
    RAW_RECORDS = list(csv.DictReader(f))

LABEL_MAP = {"PASS": 0, "MANUAL_REVIEW": 1, "FAIL": 2}
IDX_TO_LABEL = {v: k for k, v in LABEL_MAP.items()}

# ------------------------------------------------------------------------------
# Helper Metrics & Evaluation
# ------------------------------------------------------------------------------
def evaluate_model(model, dataloader, criterion, device):
    model.eval()
    total_loss = 0.0
    total_samples = 0
    all_preds = []
    all_targets = []

    with torch.no_grad():
        for inputs, targets in dataloader:
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

    # Confusion matrix
    matrix = [[0]*3 for _ in range(3)]
    for t, p in zip(all_targets, all_preds):
        matrix[t][p] += 1

    # Per-class precision, recall, F1
    precisions, recalls, f1s = [], [], []
    for i in range(3):
        tp = matrix[i][i]
        fp = sum(matrix[r][i] for r in range(3)) - tp
        fn = sum(matrix[i][c] for c in range(3)) - tp
        p = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        r = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f = (2 * p * r) / (p + r) if (p + r) > 0 else 0.0
        precisions.append(p)
        recalls.append(r)
        f1s.append(f)

    macro_f1 = sum(f1s) / 3.0
    return {
        "loss": avg_loss,
        "acc": acc,
        "macro_f1": macro_f1,
        "matrix": matrix,
        "f1_per_class": f1s,
        "prec_per_class": precisions,
        "rec_per_class": recalls,
        "preds": all_preds,
        "targets": all_targets
    }

# ------------------------------------------------------------------------------
# Feature Extractors
# ------------------------------------------------------------------------------
SERVICE_CATS = sorted(list({r["service_category"] for r in RAW_RECORDS}))
STATES = sorted(list({r["state"] for r in RAW_RECORDS}))
DOC_STATUSES = sorted(list({r["document_status"] for r in RAW_RECORDS}))

def extract_features_v1(row):
    """Baseline feature representation (20 features)"""
    doc_quality = float(row.get("document_quality_score", 0.8))
    fraud_risk = float(row.get("fraud_risk_score", 0.2))
    ocr_name = float(row.get("ocr_name_match", 1))
    ocr_date = float(row.get("ocr_date_match", 1))
    year_val = float(row.get("issue_year", 2024))
    norm_year = (year_val - 2020.0) / 10.0

    svc_vec = [1.0 if row.get("service_category") == cat else 0.0 for cat in SERVICE_CATS]
    state_vec = [1.0 if row.get("state") == st else 0.0 for st in STATES]
    status_vec = [1.0 if row.get("document_status") == st else 0.0 for st in DOC_STATUSES]

    return [doc_quality, fraud_risk, ocr_name, ocr_date, norm_year] + svc_vec + state_vec + status_vec

def extract_features_v2(row, stats=None):
    """
    Engineered Feature Representation:
    - Non-linear fraud interaction terms
    - Credential consistency ratios
    - Anomaly status flags
    - Standardized continuous features
    """
    quality = float(row.get("document_quality_score", 0.8))
    fraud = float(row.get("fraud_risk_score", 0.2))
    ocr_name = float(row.get("ocr_name_match", 1))
    ocr_date = float(row.get("ocr_date_match", 1))
    year = float(row.get("issue_year", 2024))

    # Interaction & domain indicators
    composite_risk = fraud * (1.0 - quality)
    ocr_mismatch_penalty = (1.0 - ocr_name) + (1.0 - ocr_date)
    is_expired = 1.0 if row.get("document_status") == "EXPIRED" else 0.0
    is_flagged = 1.0 if row.get("document_status") == "FLAGGED" else 0.0
    is_valid = 1.0 if row.get("document_status") == "VALID" else 0.0
    year_offset = (year - 2023.0) / 3.0

    # Categorical one-hot
    svc_vec = [1.0 if row.get("service_category") == cat else 0.0 for cat in SERVICE_CATS]
    state_vec = [1.0 if row.get("state") == st else 0.0 for st in STATES]

    continuous = [quality, fraud, composite_risk, ocr_mismatch_penalty, year_offset]
    if stats is not None:
        # Standardize using training mean and std
        continuous = [(v - stats["mean"][i]) / max(stats["std"][i], 1e-6) for i, v in enumerate(continuous)]

    discrete = [ocr_name, ocr_date, is_expired, is_flagged, is_valid]
    return continuous + discrete + svc_vec + state_vec

# ------------------------------------------------------------------------------
# Splitters
# ------------------------------------------------------------------------------
def get_random_split(records, split_ratio=0.8, seed=42):
    rng = random.Random(seed)
    shuffled = list(records)
    rng.shuffle(shuffled)
    n = int(len(shuffled) * split_ratio)
    return shuffled[:n], shuffled[n:]

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

# ------------------------------------------------------------------------------
# Datasets & Augmentation
# ------------------------------------------------------------------------------
class SimpleDataset(Dataset):
    def __init__(self, X, y):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.long)
    def __len__(self):
        return len(self.y)
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

def augment_training_data(X, y, jitter_std=0.03, mixup_prob=0.3):
    """
    Tabular Data Augmentation:
    1. Small Gaussian jitter on continuous features to prevent memorization
    2. Within-class feature convex combination (Intra-class Mixup)
    """
    X_aug = [list(x) for x in X]
    y_aug = list(y)

    class_indices = {}
    for idx, label in enumerate(y):
        class_indices.setdefault(label, []).append(idx)

    rng = random.Random(42)
    # Generate 1 augmented sample per training sample
    for idx, x in enumerate(X):
        c = y[idx]
        new_x = list(x)

        # 1. Jitter first 5 continuous features
        for j in range(min(5, len(new_x))):
            noise = rng.gauss(0, jitter_std)
            new_x[j] += noise

        # 2. Intra-class Mixup with probability
        if rng.random() < mixup_prob and len(class_indices[c]) > 1:
            partner_idx = rng.choice(class_indices[c])
            partner_x = X[partner_idx]
            alpha = rng.uniform(0.7, 0.95)
            for j in range(len(new_x)):
                new_x[j] = alpha * new_x[j] + (1.0 - alpha) * partner_x[j]

        X_aug.append(new_x)
        y_aug.append(c)

    return X_aug, y_aug

# ------------------------------------------------------------------------------
# Neural Network Models
# ------------------------------------------------------------------------------
class BaselineMLP(nn.Module):
    def __init__(self, input_dim, num_classes=3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.BatchNorm1d(128),
            nn.SiLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.SiLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.SiLU(),
            nn.Linear(32, num_classes)
        )
    def forward(self, x):
        return self.net(x)

class TabularResNet(nn.Module):
    """
    Residual Tabular Network with Skip-Connections and Swish / GELU activations.
    Highly effective at learning non-linear tabular interactions without gradient vanishing.
    """
    def __init__(self, input_dim, hidden_dim=64, num_classes=3, dropout_rate=0.3):
        super().__init__()
        self.input_layer = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.GELU()
        )
        # Residual Block 1
        self.res1_fc1 = nn.Linear(hidden_dim, hidden_dim)
        self.res1_bn1 = nn.BatchNorm1d(hidden_dim)
        self.res1_act = nn.GELU()
        self.res1_drop = nn.Dropout(dropout_rate)
        self.res1_fc2 = nn.Linear(hidden_dim, hidden_dim)
        self.res1_bn2 = nn.BatchNorm1d(hidden_dim)

        # Residual Block 2
        self.res2_fc1 = nn.Linear(hidden_dim, hidden_dim)
        self.res2_bn1 = nn.BatchNorm1d(hidden_dim)
        self.res2_act = nn.GELU()
        self.res2_drop = nn.Dropout(dropout_rate)
        self.res2_fc2 = nn.Linear(hidden_dim, hidden_dim)
        self.res2_bn2 = nn.BatchNorm1d(hidden_dim)

        # Classification Head
        self.head = nn.Sequential(
            nn.Linear(hidden_dim, 32),
            nn.BatchNorm1d(32),
            nn.GELU(),
            nn.Dropout(0.15),
            nn.Linear(32, num_classes)
        )

    def forward(self, x):
        h = self.input_layer(x)
        # Residual 1
        res1 = self.res1_bn2(self.res1_fc2(self.res1_drop(self.res1_act(self.res1_bn1(self.res1_fc1(h))))))
        h = torch.relu(h + res1)
        # Residual 2
        res2 = self.res2_bn2(self.res2_fc2(self.res2_drop(self.res2_act(self.res2_bn1(self.res2_fc1(h))))))
        h = torch.relu(h + res2)
        return self.head(h)


# ==============================================================================
# Experiment Runner Framework
# ==============================================================================
def run_training_experiment(
    exp_name: str,
    model_class,
    train_loader: DataLoader,
    val_loader: DataLoader,
    criterion,
    learning_rate: float = 0.003,
    weight_decay: float = 1e-4,
    epochs: int = 40,
    patience: int = 15,
    save_checkpoint_name: str = None
):
    sample_x, _ = next(iter(train_loader))
    input_dim = sample_x.shape[1]
    model = model_class(input_dim=input_dim, num_classes=3).to(device)

    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

    best_val_f1 = -1.0
    best_eval = None
    best_weights = None
    best_epoch = 0
    patience_counter = 0

    for epoch in range(1, epochs + 1):
        model.train()
        for inputs, targets in train_loader:
            inputs = inputs.to(device)
            targets = targets.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()

        scheduler.step()

        val_eval = evaluate_model(model, val_loader, criterion, device)
        # Rank primarily on Macro F1 to balance minority classes
        score = val_eval["macro_f1"]

        if score > best_val_f1:
            best_val_f1 = score
            best_eval = val_eval
            best_epoch = epoch
            best_weights = copy.deepcopy(model.state_dict())
            patience_counter = 0
        else:
            patience_counter += 1
            if patience_counter >= patience:
                break

    if save_checkpoint_name and best_weights is not None:
        os.makedirs("models", exist_ok=True)
        ckpt_path = os.path.join("models", save_checkpoint_name)
        torch.save({
            "model_state_dict": best_weights,
            "metrics": best_eval,
            "input_dim": input_dim,
            "experiment": exp_name,
            "epoch": best_epoch,
            "device": str(device)
        }, ckpt_path)

    return {
        "name": exp_name,
        "best_epoch": best_epoch,
        "val_loss": best_eval["loss"],
        "val_acc": best_eval["acc"],
        "macro_f1": best_eval["macro_f1"],
        "f1_per_class": best_eval["f1_per_class"],
        "matrix": best_eval["matrix"]
    }


# ==============================================================================
# Executing Systematic Stages
# ==============================================================================
def run_all_stages():
    results = []
    print("=" * 80)
    print("AUTOGOV+ EMPIRICAL ABLATION STUDY: SYSTEMATIC MODEL IMPROVEMENTS")
    print("=" * 80)

    # --------------------------------------------------------------------------
    # Stage 0: Baseline (Random Split, Unweighted CrossEntropy, Standard MLP)
    # --------------------------------------------------------------------------
    train_recs_0, val_recs_0 = get_random_split(RAW_RECORDS, 0.8, seed=42)
    X_train_0 = [extract_features_v1(r) for r in train_recs_0]
    y_train_0 = [LABEL_MAP[r["verification_result"]] for r in train_recs_0]
    X_val_0 = [extract_features_v1(r) for r in val_recs_0]
    y_val_0 = [LABEL_MAP[r["verification_result"]] for r in val_recs_0]

    ds_tr_0 = SimpleDataset(X_train_0, y_train_0)
    ds_va_0 = SimpleDataset(X_val_0, y_val_0)
    tl_0 = DataLoader(ds_tr_0, batch_size=16, shuffle=True)
    vl_0 = DataLoader(ds_va_0, batch_size=16, shuffle=False)

    res_0 = run_training_experiment(
        exp_name="Stage 0: Baseline (Random Split, Unweighted, Standard MLP)",
        model_class=BaselineMLP,
        train_loader=tl_0,
        val_loader=vl_0,
        criterion=nn.CrossEntropyLoss(),
        learning_rate=0.003,
        weight_decay=1e-4,
        epochs=35,
        patience=35
    )
    results.append(res_0)

    # --------------------------------------------------------------------------
    # Stage 1: Stratified Split (Guarantees fair test representation)
    # --------------------------------------------------------------------------
    train_recs_1, val_recs_1 = get_stratified_split(RAW_RECORDS, 0.8, seed=42)
    X_train_1 = [extract_features_v1(r) for r in train_recs_1]
    y_train_1 = [LABEL_MAP[r["verification_result"]] for r in train_recs_1]
    X_val_1 = [extract_features_v1(r) for r in val_recs_1]
    y_val_1 = [LABEL_MAP[r["verification_result"]] for r in val_recs_1]

    ds_tr_1 = SimpleDataset(X_train_1, y_train_1)
    ds_va_1 = SimpleDataset(X_val_1, y_val_1)
    tl_1 = DataLoader(ds_tr_1, batch_size=16, shuffle=True)
    vl_1 = DataLoader(ds_va_1, batch_size=16, shuffle=False)

    res_1 = run_training_experiment(
        exp_name="Stage 1: + Stratified Train/Val Split",
        model_class=BaselineMLP,
        train_loader=tl_1,
        val_loader=vl_1,
        criterion=nn.CrossEntropyLoss(),
        learning_rate=0.003,
        weight_decay=1e-4,
        epochs=35,
        patience=35
    )
    results.append(res_1)

    # --------------------------------------------------------------------------
    # Stage 2: Class-Weighted Loss (Tackling 59% / 23% / 18% Imbalance)
    # --------------------------------------------------------------------------
    # Compute inverse-frequency class weights on training split
    counts_tr = [y_train_1.count(i) for i in range(3)]
    total_tr = len(y_train_1)
    # w_i = N / (C * n_i)
    weights_tensor = torch.tensor([total_tr / (3.0 * max(c, 1)) for c in counts_tr], dtype=torch.float32).to(device)

    weighted_criterion = nn.CrossEntropyLoss(weight=weights_tensor)

    res_2 = run_training_experiment(
        exp_name="Stage 2: + Inverse Class-Weighted Loss",
        model_class=BaselineMLP,
        train_loader=tl_1,
        val_loader=vl_1,
        criterion=weighted_criterion,
        learning_rate=0.003,
        weight_decay=1e-4,
        epochs=35,
        patience=35
    )
    results.append(res_2)

    # --------------------------------------------------------------------------
    # Stage 3: Domain Feature Engineering & Standardization
    # --------------------------------------------------------------------------
    # Compute training continuous statistics (mean, std)
    raw_conts = []
    for r in train_recs_1:
        q = float(r.get("document_quality_score", 0.8))
        f = float(r.get("fraud_risk_score", 0.2))
        raw_conts.append([q, f, f * (1.0 - q), (1.0 - int(r.get("ocr_name_match", 1))) + (1.0 - int(r.get("ocr_date_match", 1))), (float(r.get("issue_year", 2024)) - 2023.0) / 3.0])
    raw_conts = np.array(raw_conts)
    stats_3 = {
        "mean": raw_conts.mean(axis=0).tolist(),
        "std": raw_conts.std(axis=0).tolist()
    }

    X_train_3 = [extract_features_v2(r, stats_3) for r in train_recs_1]
    X_val_3 = [extract_features_v2(r, stats_3) for r in val_recs_1]

    ds_tr_3 = SimpleDataset(X_train_3, y_train_1)
    ds_va_3 = SimpleDataset(X_val_3, y_val_1)
    tl_3 = DataLoader(ds_tr_3, batch_size=16, shuffle=True)
    vl_3 = DataLoader(ds_va_3, batch_size=16, shuffle=False)

    res_3 = run_training_experiment(
        exp_name="Stage 3: + Domain Feature Engineering & Z-Score Scaling",
        model_class=BaselineMLP,
        train_loader=tl_3,
        val_loader=vl_3,
        criterion=weighted_criterion,
        learning_rate=0.003,
        weight_decay=1e-4,
        epochs=35,
        patience=35
    )
    results.append(res_3)

    # --------------------------------------------------------------------------
    # Stage 4: Tabular Data Augmentation (Intra-Class MixUp & Jitter)
    # --------------------------------------------------------------------------
    X_train_4, y_train_4 = augment_training_data(X_train_3, y_train_1, jitter_std=0.03, mixup_prob=0.35)
    ds_tr_4 = SimpleDataset(X_train_4, y_train_4)
    tl_4 = DataLoader(ds_tr_4, batch_size=16, shuffle=True)

    res_4 = run_training_experiment(
        exp_name="Stage 4: + Tabular Data Augmentation (Jitter & Intra-MixUp)",
        model_class=BaselineMLP,
        train_loader=tl_4,
        val_loader=vl_3,
        criterion=weighted_criterion,
        learning_rate=0.002,
        weight_decay=2e-3,
        epochs=40,
        patience=25
    )
    results.append(res_4)

    # --------------------------------------------------------------------------
    # Stage 5: TabularResNet + Weight Decay + Early Stopping
    # --------------------------------------------------------------------------
    res_5 = run_training_experiment(
        exp_name="Stage 5: + TabularResNet + Weight Decay (5e-3) + Early Stopping",
        model_class=TabularResNet,
        train_loader=tl_4,
        val_loader=vl_3,
        criterion=weighted_criterion,
        learning_rate=0.0015,
        weight_decay=5e-3,
        epochs=50,
        patience=20,
        save_checkpoint_name="best_model.pth"
    )
    results.append(res_5)

    # --------------------------------------------------------------------------
    # Summary Report Table
    # --------------------------------------------------------------------------
    print("\n" + "=" * 95)
    print(f"{'Experiment Stage':<50} | {'Val Acc':<9} | {'Macro F1':<9} | {'Val Loss':<9} | {'Best Ep'}")
    print("-" * 95)
    for r in results:
        print(f"{r['name']:<50} | {r['val_acc']*100:6.1f}%   | {r['macro_f1']*100:6.1f}%   | {r['val_loss']:7.4f}   | {r['best_epoch']:2d}")
    print("=" * 95)

    best_exp = max(results, key=lambda x: x["macro_f1"])
    print(f"\n[Champion Model Selected]: {best_exp['name']}")
    print(f"Validation Accuracy: {best_exp['val_acc']*100:.1f}%")
    print(f"Macro F1-Score     : {best_exp['macro_f1']*100:.1f}%")
    print(f"Validation Loss    : {best_exp['val_loss']:.4f}")
    print("\nConfusion Matrix for Champion Model:")
    print("          Pred_PASS  Pred_MANUAL  Pred_FAIL")
    for idx, row in enumerate(best_exp["matrix"]):
        label_name = IDX_TO_LABEL[idx]
        print(f"True_{label_name:13s} {row[0]:9d} {row[1]:12d} {row[2]:10d}")
    print("-" * 50)
    for idx in range(3):
        label_name = IDX_TO_LABEL[idx]
        print(f"{label_name:15s} -> F1: {best_exp['f1_per_class'][idx]*100:.1f}%")
    print("=" * 95)

    # Save experiment log to disk
    with open("models/experiments_summary.json", "w", encoding="utf-8") as f:
        # Convert non-serializable objects
        clean_res = []
        for item in results:
            clean_res.append({
                "name": item["name"],
                "best_epoch": item["best_epoch"],
                "val_loss": float(item["val_loss"]),
                "val_acc": float(item["val_acc"]),
                "macro_f1": float(item["macro_f1"]),
                "f1_per_class": [float(x) for x in item["f1_per_class"]],
                "matrix": item["matrix"]
            })
        json.dump(clean_res, f, indent=2)
    print("[Report Saved] Full metrics saved to models/experiments_summary.json")

if __name__ == "__main__":
    run_all_stages()
