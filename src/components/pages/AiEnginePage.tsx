import React, { useState } from 'react';
import { ViewMode } from '../../types';
import { TenStepPipeline } from '../TenStepPipeline';
import { 
  Cpu, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  BarChart3, 
  Scale, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Lock, 
  Database,
  ArrowRight,
  Info,
  LineChart,
  Workflow
} from 'lucide-react';

interface AiEnginePageProps {
  onNavigate: (view: ViewMode) => void;
}

export const AiEnginePage: React.FC<AiEnginePageProps> = ({ onNavigate }) => {
  const [activeModelTab, setActiveModelTab] = useState<'ocr' | 'fraud' | 'xgboost' | 'shap'>('shap');

  // Interactive SHAP factor simulator
  const [simFactors, setSimFactors] = useState({
    fontVariance: 75,
    registryMatch: 95,
    sealAuthenticity: 30,
    incomeRangeAnomaly: 60
  });

  // Calculate composite risk dynamically based on sliders
  const computedRisk = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (simFactors.fontVariance * 0.35) + 
        ((100 - simFactors.registryMatch) * 0.40) + 
        ((100 - simFactors.sealAuthenticity) * 0.30) + 
        (simFactors.incomeRangeAnomaly * 0.20)
      )
    )
  );

  const modelCards = [
    {
      id: 'ocr',
      name: 'GovDoc-OCR Vision v4.2',
      category: 'Vision Transformer & Spatial Tokenizer',
      accuracy: '99.91% F1-Score',
      params: '340M Spatial Parameters',
      desc: 'Multimodal document layout parser trained on structured official forms, municipal certificates, and hand-inscribed records across 18 administrative languages.',
      features: [
        'Coordinate-aware 2D bounding box extraction mapped to canonical schema fields.',
        'High tolerance for low-resolution smartphone camera captures and skew angle distortion.',
        'Zero hallucination guarantee using constrained JSON schema decoding.'
      ]
    },
    {
      id: 'fraud',
      name: 'FraudNet-v4 Pixel Integrity CNN',
      category: 'Deep Forensic Computer Vision',
      accuracy: '99.4% Forgery Recall',
      params: 'ResNet-50 + Custom ELA Layer',
      desc: 'Dual-stream forensic neural network that analyzes frequency-domain JPEG quantization inconsistencies, clone-stamping, and spliced vector glyphs.',
      features: [
        'Error Level Analysis (ELA) isolates digitally pasted or edited text layers.',
        'Font kerning and glyph stroke width statistical deviation scanning.',
        'Photometric stamp verification against mathematical vector ground truths.'
      ]
    },
    {
      id: 'xgboost',
      name: 'XGBoost Sovereign Risk Scorer',
      category: 'Gradient Boosted Decision Matrix',
      accuracy: 'AUC-ROC 0.998',
      params: '1,200 Decision Trees',
      desc: 'Evaluates 42 discrete risk features including cross-document consistency, historical municipality anomaly clusters, and time-of-issuance markers.',
      features: [
        'Outputs a normalized 0-100 continuous risk score with calibrated confidence bounds.',
        'Adjustable district risk thresholds (<15 for auto-clearance; >60 for priority triage).',
        'Built-in fairness and demographic parity constraints to prevent disparate impact.'
      ]
    },
    {
      id: 'shap',
      name: 'SHAP Explainability & Attribution',
      category: 'Shapley Additive Explanations',
      accuracy: 'Exact Mathematical Game Theory',
      params: 'Real-time Vector Attribution',
      desc: 'Translates black-box ML risk predictions into transparent, auditable feature impact scores so officers understand the exact mathematical reasoning behind every flag.',
      features: [
        'Eliminates opaque AI decisions in compliance with administrative law standards.',
        'Generates visual waterfall charts for caseworkers and citizen appeals.',
        'Legally admissible mathematical evidence logs for administrative tribunals.'
      ]
    }
  ];

  return (
    <div className="w-full pb-20 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-[#eff4ff] border-b border-[#c4c6cf]/60 py-3 px-6">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-xs text-[#43474e]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#002045]">AI & ML Architecture</span>
            <span>/</span>
            <span>Neural Models & SHAP Explainability Engine</span>
          </div>
          <span className="font-mono text-[#13696a] font-bold">ISO/IEC 42001 Compliant</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-10">
        
        {/* Title Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4e4fc] rounded-full border border-[#c4c6cf] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#002045]" />
            <span className="text-xs font-bold text-[#002045] uppercase tracking-wider">
              Transparent, Auditable Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002045] tracking-tight">
            The AutoGov+ AI Engine & Neural Suite
          </h1>
          <p className="text-base text-[#43474e] mt-3 leading-relaxed">
            Public services require absolute mathematical transparency. AutoGov+ replaces opaque black-box AI with auditable vision transformers, forensic CNNs, and SHAP game-theoretic explainability.
          </p>
        </div>

        {/* ===================== INTERACTIVE 10-STAGE AUTONOMOUS PIPELINE ===================== */}
        <section className="mb-16">
          <TenStepPipeline onNavigate={onNavigate} />
        </section>

        {/* ===================== MODEL SUITE TABS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {modelCards.map((model) => {
            const isSelected = activeModelTab === model.id;
            return (
              <button
                key={model.id}
                onClick={() => setActiveModelTab(model.id as any)}
                className={`p-5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#002045] text-white border-[#002045] shadow-md ring-2 ring-[#002045]/20'
                    : 'bg-white text-[#002045] border-[#c4c6cf] hover:bg-[#eff4ff]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-[#1a365d] text-[#a5eff0]' : 'bg-[#eff4ff] text-[#002045]'
                    }`}>
                      {model.accuracy}
                    </span>
                    <Cpu className={`w-4 h-4 ${isSelected ? 'text-[#a5eff0]' : 'text-[#13696a]'}`} />
                  </div>
                  <h3 className="text-base font-bold leading-snug mt-1">
                    {model.name}
                  </h3>
                  <p className={`text-xs mt-1 ${isSelected ? 'text-[#adc7f7]' : 'text-[#43474e]'}`}>
                    {model.category}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t text-[11px] font-mono ${
                  isSelected ? 'border-[#2d476f] text-[#a5eff0]' : 'border-[#c4c6cf]/50 text-[#13696a]'
                }`}>
                  {model.params}
                </div>
              </button>
            );
          })}
        </div>

        {/* ===================== MODEL DETAILED BLUEPRINT ===================== */}
        {(() => {
          const m = modelCards.find(item => item.id === activeModelTab)!;
          return (
            <div className="bg-white rounded-2xl border border-[#c4c6cf] p-6 lg:p-8 shadow-sm mb-16">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[#c4c6cf] gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#13696a]">
                      Active Model Inspection
                    </span>
                    <span className="text-xs font-mono bg-[#d4e4fc] text-[#002045] px-2 py-0.5 rounded">
                      Production Build v4.2.8
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#002045] mt-1">{m.name}</h2>
                  <p className="text-sm text-[#43474e] mt-1 max-w-3xl">{m.desc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => onNavigate('officer_review')}
                    className="px-4 py-2 bg-[#002045] text-white text-xs font-bold rounded-lg hover:bg-[#1a365d] transition-all flex items-center gap-1.5"
                  >
                    <span>Inspect in Live Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {m.features.map((feat, fIdx) => (
                  <div key={fIdx} className="bg-[#eff4ff] p-5 rounded-xl border border-[#c4c6cf]/80 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-white text-[#002045] flex items-center justify-center font-bold text-xs border border-[#c4c6cf]">
                      0{fIdx + 1}
                    </div>
                    <p className="text-xs text-[#002045] font-medium leading-relaxed">
                      {feat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ===================== INTERACTIVE SHAP FEATURE WEIGHT EXPLORER ===================== */}
        <section className="bg-[#002045] text-white rounded-2xl p-8 lg:p-10 border border-[#1a365d] shadow-lg mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Explainer and Sliders */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a365d] rounded-full text-xs font-semibold text-[#a5eff0]">
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive SHAP Sensitivity Matrix</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Tune Feature Vectors in Real Time
              </h2>
              <p className="text-sm text-[#adc7f7] leading-relaxed">
                Experience how individual document anomaly signals mathematically contribute to the final XGBoost risk assessment.
              </p>

              {/* Slider 1 */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-[#adc7f7]">
                  <span>Font Kerning & Glyph Variance</span>
                  <span className="font-mono font-bold text-white">{simFactors.fontVariance}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={simFactors.fontVariance}
                  onChange={(e) => setSimFactors({...simFactors, fontVariance: Number(e.target.value)})}
                  className="w-full accent-[#f87171] h-2 bg-[#1a365d] rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#adc7f7]">
                  <span>State Civil Registry Match Score</span>
                  <span className="font-mono font-bold text-white">{simFactors.registryMatch}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={simFactors.registryMatch}
                  onChange={(e) => setSimFactors({...simFactors, registryMatch: Number(e.target.value)})}
                  className="w-full accent-[#2dd4bf] h-2 bg-[#1a365d] rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#adc7f7]">
                  <span>Official Stamp Seal Contour Authenticity</span>
                  <span className="font-mono font-bold text-white">{simFactors.sealAuthenticity}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={simFactors.sealAuthenticity}
                  onChange={(e) => setSimFactors({...simFactors, sealAuthenticity: Number(e.target.value)})}
                  className="w-full accent-[#fbbf24] h-2 bg-[#1a365d] rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Real-time Output & Gauge */}
            <div className="lg:col-span-6 bg-[#1a365d] rounded-xl p-6 border border-[#2d476f] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a5eff0]">
                  Computed Composite Risk Score
                </span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                  computedRisk > 50 
                    ? 'bg-[#f87171] text-black' 
                    : computedRisk > 20 
                    ? 'bg-[#fbbf24] text-black' 
                    : 'bg-[#2dd4bf] text-black'
                }`}>
                  {computedRisk > 50 ? 'OFFICER REVIEW MANDATORY' : computedRisk > 20 ? 'ELEVATED ATTENTION' : 'AUTONOMOUS CLEAR'}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-white font-mono">{computedRisk}</span>
                <span className="text-lg text-[#adc7f7] font-bold">/ 100 Risk Index</span>
              </div>

              {/* Dynamic SHAP waterfall bars */}
              <div className="space-y-2 pt-2 border-t border-[#2d476f]">
                <div className="text-[11px] uppercase font-bold text-[#86a0cd]">
                  Mathematical Feature Attribution (SHAP Values)
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200">Font Kerning Disparity</span>
                  <span className="font-mono text-[#f87171] font-bold">
                    +{(simFactors.fontVariance * 0.35).toFixed(1)} pts
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200">Registry Verification Delta</span>
                  <span className="font-mono text-[#2dd4bf] font-bold">
                    {simFactors.registryMatch > 80 ? '-' : '+'}
                    {Math.abs((100 - simFactors.registryMatch) * 0.40).toFixed(1)} pts
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200">Stamp Seal Artifact Impact</span>
                  <span className="font-mono text-[#fbbf24] font-bold">
                    +{( (100 - simFactors.sealAuthenticity) * 0.30).toFixed(1)} pts
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#09182b] rounded-lg text-xs text-[#adc7f7] flex items-center justify-between mt-2">
                <span>Want to see how an officer reviews this in production?</span>
                <button
                  onClick={() => onNavigate('officer_review')}
                  className="px-3 py-1.5 bg-[#a2eded] text-[#002020] text-xs font-bold rounded hover:bg-[#89d3d4] transition-colors"
                >
                  Launch Officer Dossier
                </button>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
