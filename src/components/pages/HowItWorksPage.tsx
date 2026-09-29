import React from 'react';
import { ViewMode } from '../../types';
import { TenStepPipeline } from '../TenStepPipeline';
import { 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Sparkles,
  Award,
  Lock,
  Workflow
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (view: ViewMode) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full pb-20 animate-in fade-in duration-300">
      {/* Top Breadcrumb Header */}
      <div className="bg-[#eff4ff] border-b border-[#c4c6cf]/60 py-3 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#43474e] gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#002045]">Pipeline Architecture</span>
            <span>/</span>
            <span>10-Stage Autonomous Verification Pipeline</span>
          </div>
          <span className="font-mono text-[#13696a] font-bold">Total E2E Pipeline Latency: &lt; 1.85s SLA</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-10 space-y-12">
        
        {/* Page Title */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4e4fc] rounded-full border border-[#c4c6cf] mb-3">
            <Workflow className="w-3.5 h-3.5 text-[#002045]" />
            <span className="text-xs font-bold text-[#002045] uppercase tracking-wider">
              Statutory End-to-End Architecture
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002045] tracking-tight">
            How AutoGov+ Verifies Documents in Seconds
          </h1>
          <p className="text-base text-[#43474e] mt-3 leading-relaxed">
            The 10-stage autonomous document verification lifecycle — from citizen upload, multilingual OCR, deep convolutional forgery forensics, and XGBoost risk scoring to digital certificate issuance and continuous human-in-the-loop retraining.
          </p>
        </div>

        {/* ===================== INTEGRATED 10-STEP PIPELINE ===================== */}
        <TenStepPipeline onNavigate={onNavigate} />

        {/* ===================== 3 CORE ARCHITECTURAL GUARANTEES ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white rounded-xl p-6 border border-[#c4c6cf] shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#eff4ff] text-[#002045] flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-[#13696a]" />
            </div>
            <h3 className="text-base font-bold text-[#002045] mb-1">
              Sub-2-Second End-to-End Latency
            </h3>
            <p className="text-xs text-[#43474e] leading-relaxed">
              Asynchronous FastAPI worker pools dispatch multi-model inferencing across Tesseract, ResNet-50 CNNs, and FAISS in parallel.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#c4c6cf] shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#eff4ff] text-[#002045] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-[#13696a]" />
            </div>
            <h3 className="text-base font-bold text-[#002045] mb-1">
              Court-Admissible SHAP Explainability
            </h3>
            <p className="text-xs text-[#43474e] leading-relaxed">
              Every flagged document generates a mathematical feature attribution waterfall ensuring full legal transparency and zero algorithmic bias.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#c4c6cf] shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#eff4ff] text-[#002045] flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-[#13696a]" />
            </div>
            <h3 className="text-base font-bold text-[#002045] mb-1">
              Zero-Trust &amp; Sovereign Cloud Enclave
            </h3>
            <p className="text-xs text-[#43474e] leading-relaxed">
              FedRAMP High and ISO 27001 compliant. No citizen biometric or sensitive PII is shared or exposed to public LLM endpoints.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
