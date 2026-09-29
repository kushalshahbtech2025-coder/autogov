"""
AutoGov+ Realistic Verification Dataset Generator
==================================================
Generates high-fidelity institutional document verification data adhering
to realistic government validation rules:
- PASS: Low fraud risk (<0.35), high document quality (>=0.70), valid status, full OCR matches.
- MANUAL_REVIEW: Borderline quality/risk, partial OCR mismatch, or FLAGGED status.
- FAIL: High fraud risk (>0.60), EXPIRED documents with mismatch, or multiple failed criteria.
"""

import os
import csv
import random

def generate_production_dataset(output_path: str = "data/verification_dataset_1000.csv", num_records: int = 1200, seed: int = 42):
    random.seed(seed)

    services = ["PENSION", "HEALTHCARE", "EDUCATION", "HOUSING", "AGRICULTURE", "BUSINESS_LICENSE"]
    states = ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Uttar Pradesh", "Gujarat"]
    cities = {
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Karnataka": ["Bengaluru", "Mysuru", "Hubballi"],
        "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara"]
    }

    records = []

    for i in range(1, num_records + 1):
        app_id = f"APP-2026-{10000 + i}"
        svc = random.choice(services)
        st = random.choice(states)
        ct = random.choice(cities[st])
        yr = random.randint(2018, 2026)

        # Draw a latent profile
        latent = random.random()

        if latent < 0.50:
            # High-confidence valid application
            quality = round(random.uniform(0.75, 0.99), 3)
            fraud = round(random.uniform(0.02, 0.28), 3)
            ocr_name = 1
            ocr_date = 1
            doc_status = "VALID"
            result = "PASS"
            # 3% real-world noise
            if random.random() < 0.03:
                result = "MANUAL_REVIEW"

        elif latent < 0.78:
            # Ambiguous / review-needed application
            quality = round(random.uniform(0.50, 0.78), 3)
            fraud = round(random.uniform(0.28, 0.55), 3)
            ocr_name = 1 if random.random() > 0.35 else 0
            ocr_date = 1 if random.random() > 0.25 else 0
            doc_status = random.choice(["VALID", "FLAGGED", "FLAGGED"])
            result = "MANUAL_REVIEW"
            if random.random() < 0.04:
                result = "PASS" if fraud < 0.35 else "FAIL"

        else:
            # Clear fraud or invalid application
            quality = round(random.uniform(0.20, 0.60), 3)
            fraud = round(random.uniform(0.55, 0.98), 3)
            ocr_name = 0 if random.random() > 0.30 else 1
            ocr_date = 0 if random.random() > 0.40 else 1
            doc_status = random.choice(["EXPIRED", "FLAGGED", "EXPIRED"])
            result = "FAIL"
            if random.random() < 0.03:
                result = "MANUAL_REVIEW"

        records.append({
            "application_id": app_id,
            "service_category": svc,
            "state": st,
            "city": ct,
            "issue_year": yr,
            "document_quality_score": quality,
            "fraud_risk_score": fraud,
            "ocr_name_match": ocr_name,
            "ocr_date_match": ocr_date,
            "document_status": doc_status,
            "verification_result": result
        })

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    fieldnames = list(records[0].keys())
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    # Calculate class distribution
    counts = {}
    for r in records:
        c = r["verification_result"]
        counts[c] = counts.get(c, 0) + 1

    print(f"[Dataset Generator] Created {len(records)} records at: {output_path}")
    for c, n in counts.items():
        print(f"  - {c:15s}: {n:4d} ({n / len(records) * 100:.1f}%)")

if __name__ == "__main__":
    generate_production_dataset()
