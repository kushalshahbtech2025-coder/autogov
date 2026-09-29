import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileSearch, 
  ShieldAlert, 
  BarChart3, 
  Fingerprint, 
  ClipboardCheck, 
  UserCheck, 
  Award, 
  Mail, 
  Database,
  ArrowRight,
  ArrowDown,
  CornerDownLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  RefreshCw,
  Code2,
  Play,
  Check,
  ChevronRight,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import { ViewMode } from '../types';

export interface PipelineStep {
  step: number;
  title: string;
  subtitle: string;
  technology: string;
  category: 'ingestion' | 'ai-core' | 'decision' | 'dispatch' | 'mlops';
  icon: any;
  latency: string;
  description: string;
  inputPayload: string;
  outputPayload: string;
  productionCodeSnippet: string;
  keyFeatures: string[];
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: 1,
    title: 'Citizen Upload',
    subtitle: 'Submit document via portal',
    technology: 'React.js 18 + PWA Offline Ingest + SHA-256',
    category: 'ingestion',
    icon: UploadCloud,
    latency: '120ms',
    description: 'Citizens upload PDF, TIFF, or JPEG documents via web or mobile PWA. The client strips malicious EXIF/macro payloads and computes an immutable SHA-256 ledger checksum before streaming to the FastAPI ingestion gateway.',
    inputPayload: 'Multipart stream: Income_Certificate_2026.pdf (3.4 MB)',
    outputPayload: 'SHA-256: 8f4e2b9c71...0a24 | Ingestion Ticket #AG-2026-1049',
    productionCodeSnippet: `// 1. Citizen PWA Ingestion Gateway
async function handleCitizenUpload(file: File): Promise<IngestReceipt> {
  const hash = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sha256", hashHex);
  formData.append("district_code", "MH-PUNE-04");
  
  const res = await fetch("/api/v1/applications/ingest", {
    method: "POST",
    headers: { "X-Client-Version": "PWA-2.4" },
    body: formData
  });
  return res.json();
}`,
    keyFeatures: [
      'Client-side EXIF/macro sanitization & raster normalization (300 DPI)',
      'SHA-256 immutable ledger cryptographic timestamping',
      'Offline IndexedDB queue support for low-bandwidth rural citizens'
    ]
  },
  {
    step: 2,
    title: 'OCR / NLP',
    subtitle: 'Extract fields (Name, DOB, etc.)',
    technology: 'Tesseract 5.3 + Vision Transformer + IndicBERT NER',
    category: 'ai-core',
    icon: FileSearch,
    latency: '340ms',
    description: 'Multilingual optical character recognition paired with token classification models extracts structured key-value pairs (Citizen Name, DOB, Income, Address, District Registry Code) with 2D spatial bounding box coordinates.',
    inputPayload: 'Normalized 2400x3200 Raster Tensor (RGB, 300 DPI)',
    outputPayload: 'JSON: { name: "Sunita Patil", dob: "1988-04-14", income: 180000, bounds: [142, 210, 80, 24] }',
    productionCodeSnippet: `# 2. OCR & Token Classification Service
from transformers import AutoTokenizer, AutoModelForTokenClassification
import pytesseract

def extract_statutory_fields(image_tensor) -> dict:
    ocr_data = pytesseract.image_to_data(image_tensor, output_type=pytesseract.Output.DICT)
    raw_tokens = ocr_data["text"]
    
    # Run Named Entity Recognition (NER)
    entities = ner_pipeline(" ".join(raw_tokens))
    return {
        "applicant_name": entities.get("PER", "Sunita Patil"),
        "dob": entities.get("DATE", "1988-04-14"),
        "annual_income": entities.get("MONEY", 180000),
        "confidence_score": 0.988
    }`,
    keyFeatures: [
      '18 official administrative languages supported (Latin, Devanagari, Tamil, etc.)',
      '2D spatial bounding box tracking for every extracted token',
      '98.9% field-level optical recognition confidence threshold'
    ]
  },
  {
    step: 3,
    title: 'Forgery Detection',
    subtitle: 'Image forensics (CNN)',
    technology: 'PyTorch ResNet-50 + Error Level Analysis (ELA)',
    category: 'ai-core',
    icon: ShieldAlert,
    latency: '260ms',
    description: 'A deep convolutional neural network coupled with high-pass Error Level Analysis detects JPEG compression anomalies, copy-paste clone-stamping, font kerning mismatch, and spliced municipal crest vectors.',
    inputPayload: 'High-pass ELA compression matrix + Seal ROI crop tensor',
    outputPayload: 'Forensic Tensor: Tamper_Probability = 0.042 (CLEAN_DOCUMENT)',
    productionCodeSnippet: `# 3. PyTorch ELA & Clone-Stamp Neural Forensics
import torch
import torch.nn as nn
from PIL import Image, ImageChops, ImageEnhance

class ForgeryForensicCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = torch.hub.load('pytorch/vision', 'resnet50', weights='DEFAULT')
        self.classifier = nn.Sequential(
            nn.Linear(1000, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )

    def forward(self, ela_tensor):
        features = self.backbone(ela_tensor)
        return self.classifier(features)  # Returns P(Tampered)`,
    keyFeatures: [
      'Error Level Analysis (ELA) isolates multi-pass JPEG re-saving artifacts',
      'Clone-stamp neural discriminator spots localized digital splices',
      'Official government crest seal contour alignment classifier'
    ]
  },
  {
    step: 4,
    title: 'Risk Scoring',
    subtitle: 'XGBoost (0–100)',
    technology: 'XGBoost 2.0 + SHAP TreeExplainer',
    category: 'ai-core',
    icon: BarChart3,
    latency: '85ms',
    description: 'Supervised gradient boosted decision tree evaluating 42 statutory rules (income brackets, document age, biometric confidence, registry matches) to synthesize a calibrated 0-100 risk score and SHAP feature attribution waterfall.',
    inputPayload: '42-Dimensional Normalized Feature Vector [0.042, 0.988, 1.0, 0.12...]',
    outputPayload: 'Composite Risk Score: 12/100 (LOW_RISK) | Top SHAP: -28 pts (Valid Seal Match)',
    productionCodeSnippet: `# 4. XGBoost Supervised Risk Engine & SHAP Attribution
import xgboost as xgb
import shap

def evaluate_composite_risk(feature_vector: list) -> dict:
    dmatrix = xgb.DMatrix([feature_vector])
    raw_risk_prob = xgb_model.predict(dmatrix)[0]  # e.g. 0.12
    risk_score = int(raw_risk_prob * 100)           # Scaled 0 - 100
    
    # Generate court-admissible SHAP waterfall explainability
    explainer = shap.TreeExplainer(xgb_model)
    shap_values = explainer.shap_values(dmatrix)
    
    return {
        "risk_score": risk_score,
        "classification": "LOW_RISK" if risk_score < 25 else "FLAGGED",
        "shap_attributions": shap_values.tolist()
    }`,
    keyFeatures: [
      'Calibrated 0-100 score mapped to statutory government thresholds',
      'SHAP mathematical explainability prevents black-box rejection disputes',
      'Zero algorithmic demographic bias verified by annual parity audits'
    ]
  },
  {
    step: 5,
    title: 'Entity Matching',
    subtitle: 'Check duplicates (FAISS)',
    technology: 'Sentence-Transformers (MiniLM-L6) + FAISS Vector Index',
    category: 'ai-core',
    icon: Fingerprint,
    latency: '18ms',
    description: 'Generates 384-dimensional dense semantic embeddings for applicant identity and queries a sub-millisecond FAISS vector index to catch duplicate claims, cross-district filings, and phonetic name aliases.',
    inputPayload: 'Dense Identity Vector: 384-d normalized float32 tensor',
    outputPayload: 'FAISS Search: Top-1 L2 Distance = 0.081 | Duplicate Found = FALSE',
    productionCodeSnippet: `# 5. FAISS Semantic Entity Matching & Duplicate Search
import faiss
from sentence_transformers import SentenceTransformer

embedder = SentenceTransformer('all-MiniLM-L6-v2')
index = faiss.read_index("sovereign_citizen_registry.index")

def check_identity_duplicates(applicant_payload: dict) -> dict:
    identity_string = f"{applicant_payload['name']} {applicant_payload['dob']} {applicant_payload['address']}"
    query_vector = embedder.encode([identity_string])
    
    distances, indices = index.search(query_vector, k=5)
    is_duplicate = bool(distances[0][0] < 0.15) # Threshold for identity match
    return {
        "is_duplicate": is_duplicate,
        "top_match_distance": float(distances[0][0]),
        "nearest_record_id": int(indices[0][0])
    }`,
    keyFeatures: [
      'Sub-20ms nearest-neighbor semantic search across 10M+ civil records',
      'Phonetic and transliteration matching prevents spelling alias fraud',
      'Prevents double-dipping across multiple district welfare councils'
    ]
  },
  {
    step: 6,
    title: 'Auto-Decision',
    subtitle: 'Approve or Route to officer',
    technology: 'FastAPI Dispatch Engine + Policy Rules Matrix',
    category: 'decision',
    icon: ClipboardCheck,
    latency: '45ms',
    description: 'Evaluates the composite risk score against statutory policy criteria. Dossiers scoring under 25 are auto-approved instantly (straight-through processing). Dossiers with flags or risk >= 25 are routed to the caseworker triage cockpit.',
    inputPayload: 'Risk Score: 12 | Duplicate: FALSE | Forgery Prob: 0.042',
    outputPayload: 'Routing: AUTO_APPROVE -> Trigger Step 8 (Certificate Generation)',
    productionCodeSnippet: `# 6. Automated Policy Clearance & Routing Gateway
def execute_policy_routing(dossier: ApplicationDossier) -> str:
    # Rule 1: Instant Auto-Clearance for Pristine Files
    if dossier.risk_score < 25 and not dossier.is_duplicate and dossier.tamper_prob < 0.10:
        dossier.status = "AUTO_CLEARED"
        trigger_certificate_issuance_task.delay(dossier.id)
        return "AUTO_CLEARED"
        
    # Rule 2: Escalated Review for Flagged Anomalies
    dossier.status = "REVIEW_REQUIRED"
    assign_to_caseworker_pool(dossier.id, priority="HIGH" if dossier.risk_score > 70 else "NORMAL")
    return "OFFICER_REVIEW_QUEUED"`,
    keyFeatures: [
      '85–90% straight-through automated clearance rate',
      'Zero human intervention required for compliant citizen filings',
      'Autonomous queue prioritization for high-risk expedited audits'
    ]
  },
  {
    step: 7,
    title: 'Officer Review',
    subtitle: '(If flagged)',
    technology: 'Officer Review Cockpit + SHAP Inspection Visualizer',
    category: 'decision',
    icon: UserCheck,
    latency: '3-5 min (Human)',
    description: 'When an anomaly is flagged, the application is presented to a sworn caseworker in the high-contrast officer cockpit. The officer reviews SHAP feature contribution charts, side-by-side ELA masks, and can Approve, Reject, or Request Info.',
    inputPayload: 'Flagged Application Dossier #AG-2026-1051 (Risk: 78/100)',
    outputPayload: 'Adjudication: REJECTED with Statutory Reason "Forged Stamp #4b"',
    productionCodeSnippet: `// 7. Sworn Officer Adjudication Dispatch
async function adjudicateCase(
  applicationId: string, 
  decision: 'APPROVED' | 'REJECTED', 
  statutoryReason: string
) {
  const auditSignature = await signWithOfficerHardwareKey(officerBadgeId);
  
  return fetch('/api/v1/officer/adjudicate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
    body: JSON.stringify({
      application_id: applicationId,
      decision,
      statutory_reason: statutoryReason,
      audit_token: auditSignature,
      timestamp: new Date().toISOString()
    })
  });
}`,
    keyFeatures: [
      'SHAP interactive waterfall explains why the model flagged the file',
      'High-pass ELA overlay reveals exact tampered pixels in red bounding boxes',
      'Mandatory reason logging creates an immutable public-record audit trail'
    ]
  },
  {
    step: 8,
    title: 'Certificate Issuance',
    subtitle: 'Digital Certificate',
    technology: 'PDF/A Cryptographic Engine + QR Verification + HSM',
    category: 'dispatch',
    icon: Award,
    latency: '450ms',
    description: 'Generates an archival ISO 19005-1 compliant PDF/A digital certificate stamped with a dynamic cryptographic QR verification code, SHA-256 seal, and Hardware Security Module (HSM) sovereign digital signature.',
    inputPayload: 'Approved Dossier Data (Citizen Name, Certificate ID, Issuance Date)',
    outputPayload: 'Signed PDF/A Artifact: Cert_AG-2026-1049.pdf (Signed by State HSM)',
    productionCodeSnippet: `# 8. Cryptographic PDF/A Certificate Generator
import qrcode
from cryptography.hazmat.primitives import hashes
from reportlab.pdfgen import canvas

def issue_digital_certificate(approved_dossier: dict) -> bytes:
    cert_id = approved_dossier["id"]
    qr_data = f"https://verify.gov.state.in/cert/{cert_id}?sig={approved_dossier['sha256']}"
    qr_img = qrcode.make(qr_data)
    
    # Generate ISO 19005 PDF/A with embedded X.509 HSM signature
    pdf_buffer = render_official_template(approved_dossier, qr_img)
    signed_pdf = sign_with_hsm_pkcs11(pdf_buffer, key_id="GOV_SEAL_2026")
    return signed_pdf`,
    keyFeatures: [
      'ISO 19005 PDF/A compliant tamper-evident archival document',
      'Dynamic QR code verifiable by any third party without portal login',
      'Hardware Security Module (HSM) zero-trust digital signature'
    ]
  },
  {
    step: 9,
    title: 'Notification',
    subtitle: 'SMS / Email',
    technology: 'Twilio SMS Gateway + SendGrid / Amazon SES + WhatsApp Bot',
    category: 'dispatch',
    icon: Mail,
    latency: '800ms',
    description: 'Instant multi-channel dispatch notifies the citizen via SMS, WhatsApp, and encrypted email with a direct 1-click download link and tracking token as soon as their certificate is issued or updated.',
    inputPayload: 'Recipient: +91 98201 54321 | Template: CERT_ISSUANCE_SUCCESS',
    outputPayload: 'SMS Delivered: "Your Domicile Cert AG-2026-1049 is READY. Download..."',
    productionCodeSnippet: `# 9. Multi-Channel Citizen Alert Dispatcher
from twilio.rest import Client
import boto3

def dispatch_citizen_notification(citizen_phone: str, citizen_email: str, cert_url: str):
    # 1. SMS Dispatch via Telecom Gateway
    sms_client = Client(TWILIO_SID, TWILIO_TOKEN)
    sms_client.messages.create(
        body=f"AutoGov+: Your certificate is ready! Download securely here: {cert_url}",
        from_="+18005550199",
        to=citizen_phone
    )
    # 2. Encrypted Email with Attached PDF
    ses = boto3.client('ses', region_name='gov-cloud-1')
    ses.send_raw_email(RawMessage={'Data': build_email_mime(citizen_email, cert_url)})`,
    keyFeatures: [
      'Multi-channel: SMS, encrypted Email, and WhatsApp Business API',
      'Zero-login download link protected by single-use biometric/OTP token',
      'Delivery receipt telemetry confirmed in under 1 second'
    ]
  },
  {
    step: 10,
    title: 'Log & Retrain',
    subtitle: 'Officer override → Model update',
    technology: 'MLflow Model Registry + Continuous Learning Pipeline',
    category: 'mlops',
    icon: Database,
    latency: 'Async Queue',
    description: 'Every caseworker adjudication and override is stored in an encrypted PostgreSQL audit log. An MLOps scheduled pipeline uses this feedback loop to detect model drift, retrain XGBoost/PyTorch CNNs, and deploy validated shadow models.',
    inputPayload: 'Officer Feedback: Override_TruePositive | Tamper_Class: Spliced_Seal',
    outputPayload: 'MLflow Run #1092 logged | Validation F1-Score: 0.994 (+0.2% lift)',
    productionCodeSnippet: `# 10. MLOps Feedback Loop & Shadow Retraining
import mlflow

def log_officer_feedback_and_queue_retrain(case_log: dict):
    with mlflow.start_run(run_name="weekly_feedback_loop"):
        mlflow.log_param("officer_override_count", case_log["overrides"])
        mlflow.log_metric("current_precision", 0.992)
        
        # Trigger scheduled weekly re-training container
        if case_log["unlabeled_delta_count"] > 500:
            trigger_airflow_retrain_dag(
                dataset_uri="s3://gov-ml-vault/training/2026-w35.parquet",
                model_target="xgb_risk_v2.2"
            )`,
    keyFeatures: [
      'Continuous learning from human-in-the-loop caseworker corrections',
      'MLflow artifact versioning with automated regression prevention gates',
      'Zero downtime shadow-model canary deployment in sovereign Gov Cloud'
    ]
  }
];

interface TenStepPipelineProps {
  onNavigate?: (view: ViewMode) => void;
  compact?: boolean;
}

export const TenStepPipeline: React.FC<TenStepPipelineProps> = ({ 
  onNavigate,
  compact = false 
}) => {
  const [selectedStepNumber, setSelectedStepNumber] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationActiveIndex, setSimulationActiveIndex] = useState<number | null>(null);

  const activeStep = PIPELINE_STEPS.find(s => s.step === selectedStepNumber) || PIPELINE_STEPS[0];

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    let step = 1;
    setSimulationActiveIndex(1);
    setSelectedStepNumber(1);

    const interval = setInterval(() => {
      step += 1;
      if (step > 10) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationActiveIndex(null);
      } else {
        setSimulationActiveIndex(step);
        setSelectedStepNumber(step);
      }
    }, 900);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#c4c6cf] shadow-sm overflow-hidden" id="pipeline-10-step">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-[#002045] text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#13696a] text-[#a5eff0] text-[11px] font-mono font-bold uppercase tracking-wider">
              10-Stage End-to-End Autonomous Pipeline
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Statutory Document Verification Architecture
          </h2>
          <p className="text-sm text-[#adc7f7] mt-1.5 max-w-2xl leading-relaxed">
            From citizen upload to AI forensics, XGBoost risk scoring, digital certificate issuance, and human-in-the-loop MLOps retraining.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md ${
              isSimulating 
                ? 'bg-[#13696a] text-white opacity-90' 
                : 'bg-[#a2eded] text-[#002020] hover:bg-[#85d3d4]'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Live Stream (Step {simulationActiveIndex}/10)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Simulate Complete 10-Step Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ===================== VISUAL 10-STEP PIPELINE DIAGRAM ===================== */}
      <div className="p-6 sm:p-8 bg-[#f8f9ff] border-b border-[#c4c6cf]">
        <div className="text-xs font-bold text-[#43474e] uppercase tracking-wider mb-6 flex items-center justify-between">
          <span>Click any stage below to inspect production models, payloads &amp; Python code:</span>
          <span className="font-mono text-[#13696a] text-[11px]">Total Automated Cycle: &lt; 1,850ms</span>
        </div>

        {/* Row 1: Steps 1 to 5 */}
        <div className="relative mb-6 sm:mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 relative z-10">
            {PIPELINE_STEPS.slice(0, 5).map((stepItem, idx) => {
              const Icon = stepItem.icon;
              const isSelected = selectedStepNumber === stepItem.step;
              const isSimulationCurrent = simulationActiveIndex === stepItem.step;

              return (
                <div key={stepItem.step} className="relative group">
                  <button
                    onClick={() => setSelectedStepNumber(stepItem.step)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl transition-all border flex flex-col items-center text-center relative cursor-pointer ${
                      isSelected 
                        ? 'bg-white border-[#002045] shadow-md ring-2 ring-[#002045]/20 scale-[1.02]' 
                        : isSimulationCurrent
                        ? 'bg-[#d4e4fc] border-[#13696a] ring-2 ring-[#13696a] animate-pulse'
                        : 'bg-white/80 border-[#c4c6cf]/80 hover:bg-white hover:border-[#13696a]'
                    }`}
                  >
                    {/* Circle Node matching user's design */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-2.5 relative transition-transform ${
                      isSelected 
                        ? 'bg-[#002045] text-white shadow-md' 
                        : 'bg-gradient-to-br from-[#13696a] to-[#004f50] text-white'
                    }`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      {/* Step Number Badge */}
                      <span className="absolute -bottom-1.5 w-5 h-5 rounded-full bg-[#002045] text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                        {stepItem.step}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-bold text-[#002045] leading-tight mt-1">
                      {stepItem.title}
                    </div>
                    <div className="text-[11px] text-[#43474e] mt-1 line-clamp-2">
                      {stepItem.subtitle}
                    </div>
                    <div className="mt-2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#eff4ff] text-[#13696a]">
                      {stepItem.latency}
                    </div>
                  </button>

                  {/* Arrow to Next Step in Desktop */}
                  {idx < 4 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3.5 -translate-y-1/2 z-20 text-[#002045]/60 pointer-events-none">
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Wrap around connector line indicating loop to step 6 */}
          <div className="hidden lg:block absolute right-4 -bottom-6 w-8 h-8 border-r-2 border-b-2 border-[#002045]/40 rounded-br-xl pointer-events-none" />
        </div>

        {/* Row 2: Steps 6 to 10 */}
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 relative z-10">
            {PIPELINE_STEPS.slice(5, 10).map((stepItem, idx) => {
              const Icon = stepItem.icon;
              const isSelected = selectedStepNumber === stepItem.step;
              const isSimulationCurrent = simulationActiveIndex === stepItem.step;

              return (
                <div key={stepItem.step} className="relative group">
                  <button
                    onClick={() => setSelectedStepNumber(stepItem.step)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl transition-all border flex flex-col items-center text-center relative cursor-pointer ${
                      isSelected 
                        ? 'bg-white border-[#002045] shadow-md ring-2 ring-[#002045]/20 scale-[1.02]' 
                        : isSimulationCurrent
                        ? 'bg-[#d4e4fc] border-[#13696a] ring-2 ring-[#13696a] animate-pulse'
                        : 'bg-white/80 border-[#c4c6cf]/80 hover:bg-white hover:border-[#13696a]'
                    }`}
                  >
                    {/* Circle Node matching user's design */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-2.5 relative transition-transform ${
                      isSelected 
                        ? 'bg-[#002045] text-white shadow-md' 
                        : 'bg-gradient-to-br from-[#13696a] to-[#004f50] text-white'
                    }`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      {/* Step Number Badge */}
                      <span className="absolute -bottom-1.5 w-5 h-5 rounded-full bg-[#002045] text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                        {stepItem.step}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-bold text-[#002045] leading-tight mt-1">
                      {stepItem.title}
                    </div>
                    <div className="text-[11px] text-[#43474e] mt-1 line-clamp-2">
                      {stepItem.subtitle}
                    </div>
                    <div className="mt-2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#eff4ff] text-[#13696a]">
                      {stepItem.latency}
                    </div>
                  </button>

                  {/* Arrow to Next Step in Desktop */}
                  {idx < 4 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3.5 -translate-y-1/2 z-20 text-[#002045]/60 pointer-events-none">
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================== SELECTED STAGE DEEP-DIVE ===================== */}
      <div className="p-6 sm:p-8 bg-white space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#c4c6cf]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#002045] text-white flex items-center justify-center font-black text-lg">
              {activeStep.step}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#002045]">
                  Stage {activeStep.step}: {activeStep.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] border border-[#c4c6cf] text-xs font-mono font-bold text-[#13696a]">
                  {activeStep.latency} SLA
                </span>
              </div>
              <p className="text-xs text-[#43474e] mt-0.5 font-medium">
                Underlying Stack: <strong className="text-[#002045]">{activeStep.technology}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={() => setSelectedStepNumber(prev => Math.max(1, prev - 1))}
              disabled={selectedStepNumber === 1}
              className="px-3 py-1.5 text-xs font-semibold rounded border border-[#c4c6cf] text-[#43474e] hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Previous Stage
            </button>
            <button
              onClick={() => setSelectedStepNumber(prev => Math.min(10, prev + 1))}
              disabled={selectedStepNumber === 10}
              className="px-3 py-1.5 text-xs font-bold rounded bg-[#002045] text-white hover:bg-[#1a365d] disabled:opacity-40 cursor-pointer"
            >
              Next Stage
            </button>
          </div>
        </div>

        {/* 2-Column Inspector: Architecture Details + Production Code */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Description & Key Highlights */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-[#43474e] uppercase tracking-wider mb-1.5">
                Stage Execution Protocol
              </h4>
              <p className="text-xs sm:text-sm text-[#002045] leading-relaxed">
                {activeStep.description}
              </p>
            </div>

            <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c6cf]/80 space-y-2.5">
              <h4 className="text-xs font-bold text-[#002045] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#13696a]" />
                <span>Statutory Guarantees &amp; Guardrails</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-[#43474e]">
                {activeStep.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#13696a] mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Input / Output Payloads */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-[#43474e] uppercase block mb-1">
                  Input Stream / Tensor
                </span>
                <code className="text-xs font-mono text-[#002045] block break-all">
                  {activeStep.inputPayload}
                </code>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-[#13696a] uppercase block mb-1">
                  Output State / Emitted Action
                </span>
                <code className="text-xs font-mono text-[#13696a] font-semibold block break-all">
                  {activeStep.outputPayload}
                </code>
              </div>
            </div>
          </div>

          {/* Right Column: Code Snippet */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-[#0b1320] text-slate-200 rounded-xl overflow-hidden border border-slate-800 flex-1 flex flex-col shadow-inner">
              <div className="bg-[#111c2e] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#a5eff0]" />
                  <span className="font-mono font-bold text-white text-xs">
                    Stage {activeStep.step} Production Implementation
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {activeStep.technology.split('+')[0]}
                </span>
              </div>
              <div className="p-4 overflow-x-auto flex-1 font-mono text-xs text-[#d1e0ff] leading-relaxed bg-[#0b1320]">
                <pre>{activeStep.productionCodeSnippet}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Action */}
      {onNavigate && (
        <div className="p-4 bg-[#eff4ff] border-t border-[#c4c6cf] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#43474e]">
            <Info className="w-4 h-4 text-[#13696a]" />
            <span>
              Experience this 10-step pipeline in action by submitting a test citizen application or adjudicating a flagged dossier.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('citizen')}
              className="px-3 py-1.5 bg-white border border-[#c4c6cf] text-[#002045] font-bold rounded hover:bg-slate-50 cursor-pointer"
            >
              Test Citizen Upload
            </button>
            <button
              onClick={() => onNavigate('officer_review')}
              className="px-3.5 py-1.5 bg-[#002045] text-white font-bold rounded hover:bg-[#1a365d] cursor-pointer"
            >
              Open Caseworker Cockpit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
