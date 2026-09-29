import { TechStackItem } from '../types';

export const INITIAL_TECH_STACK: TechStackItem[] = [
  {
    id: 'frontend',
    tier: 'Frontend & Officer UI',
    category: 'frontend',
    primaryTech: 'React.js 18 + Tailwind CSS',
    secondaryFallback: 'PWA Service Worker + IndexedDB',
    roleAndSla: 'Zero-glare caseworker canvas, offline dossiers (< 100ms render)',
    status: 'ACTIVE',
    activeRecordsCount: 5,
    healthScore: 99.9,
    lastUpdated: 'Live Active'
  },
  {
    id: 'backend',
    tier: 'Backend & Orchestration',
    category: 'backend',
    primaryTech: 'FastAPI (Async Python 3.11)',
    secondaryFallback: 'Django REST Framework (Enterprise RBAC)',
    roleAndSla: 'Asynchronous multi-model dispatch (< 1,850ms SLA)',
    status: 'ACTIVE',
    activeRecordsCount: 5,
    healthScore: 99.8,
    lastUpdated: 'Live Active'
  },
  {
    id: 'ocr-ner',
    tier: 'OCR & Token Extraction',
    category: 'ai-ml',
    primaryTech: 'Tesseract 5.3 + Vision API',
    secondaryFallback: 'HuggingFace Transformer NER (IndicBERT/RoBERTa)',
    roleAndSla: '2D coordinate bounding box entity extraction (18 languages)',
    status: 'ACTIVE',
    activeRecordsCount: 5,
    healthScore: 99.7,
    lastUpdated: 'Live Active'
  },
  {
    id: 'forgery-cnn',
    tier: 'Visual Forgery Detection',
    category: 'ai-ml',
    primaryTech: 'PyTorch CNN (ResNet-50)',
    secondaryFallback: 'Error Level Analysis (ELA) Compression Deltas',
    roleAndSla: 'JPEG quantization artifact & clone-stamp splice detection',
    status: 'ACTIVE',
    activeRecordsCount: 5,
    healthScore: 99.4,
    lastUpdated: 'Live Active'
  },
  {
    id: 'risk-engine',
    tier: 'Composite Risk Scoring',
    category: 'ai-ml',
    primaryTech: 'XGBoost 2.0 (Gradient Boosted Trees)',
    secondaryFallback: 'scikit-learn Calibrated Pipeline',
    roleAndSla: '42 statutory feature tree evaluation (0-100 risk score)',
    status: 'ACTIVE',
    activeRecordsCount: 5,
    healthScore: 99.6,
    lastUpdated: 'Live Active'
  },
  {
    id: 'dedup-faiss',
    tier: 'Entity Resolution & Dedup',
    category: 'ai-ml',
    primaryTech: 'Sentence-Transformers (MiniLM-L6)',
    secondaryFallback: 'FAISS Vector Index (IVFFlat)',
    roleAndSla: 'Sub-12ms semantic duplicate & phonetic alias identification',
    status: 'ACTIVE',
    activeRecordsCount: 5,
    healthScore: 99.9,
    lastUpdated: 'Live Active'
  },
  {
    id: 'explainability-shap',
    tier: 'Explainable AI (XAI)',
    category: 'ai-ml',
    primaryTech: 'SHAP TreeExplainer',
    secondaryFallback: 'Marginal Attribution Vectors',
    roleAndSla: 'Court-admissible, statutory decision justification logs',
    status: 'ACTIVE',
    activeRecordsCount: 5,
    healthScore: 100.0,
    lastUpdated: 'Live Active'
  },
  {
    id: 'mlops-mlflow',
    tier: 'MLOps & Drift Control',
    category: 'infra-sec',
    primaryTech: 'MLflow Model Registry',
    secondaryFallback: 'Scheduled Retraining Crons + Prometheus',
    roleAndSla: 'Weekly validation gates & zero-regression shadow deployment',
    status: 'ACTIVE',
    activeRecordsCount: 5,
    healthScore: 99.5,
    lastUpdated: 'Live Active'
  },
  {
    id: 'data-persistence',
    tier: 'Data Persistence & Cloud',
    category: 'infra-sec',
    primaryTech: 'PostgreSQL 16 (pgvector)',
    secondaryFallback: 'Docker + NGINX + Sovereign Gov Cloud VM',
    roleAndSla: 'ACID compliance, vector search, sovereign server enclaves',
    status: 'ACTIVE',
    activeRecordsCount: 5,
    healthScore: 99.9,
    lastUpdated: 'Live Active'
  },
  {
    id: 'security-auth',
    tier: 'Security & Auth Standard',
    category: 'infra-sec',
    primaryTech: 'JWT (Ed25519) + AES-256 (At Rest)',
    secondaryFallback: 'TLS 1.3 Strict + Hardware HSM Keys',
    roleAndSla: 'FedRAMP High, ISO 27001, Zero-Trust Access Protocol',
    status: 'ACTIVE',
    activeRecordsCount: 5,
    healthScore: 100.0,
    lastUpdated: 'Live Active'
  }
];
