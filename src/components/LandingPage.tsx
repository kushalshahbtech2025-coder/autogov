import React, { useState } from 'react';
import { ViewMode } from '../types';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Hourglass, 
  Zap, 
  UserCheck, 
  UploadCloud, 
  FileText, 
  ShieldAlert, 
  Activity, 
  Fingerprint, 
  Gavel, 
  Timer, 
  Scale, 
  Check, 
  Info, 
  ChevronRight,
  Lock,
  Cpu,
  Database,
  BarChart3,
  Search,
  Sliders
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: ViewMode) => void;
  activeSection?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, activeSection }) => {
  const [activePipelineStep, setActivePipelineStep] = useState<number | null>(2);
  const [interactiveParam, setInteractiveParam] = useState<'standard' | 'accelerated' | 'conservative'>('standard');

  const pipelineSteps = [
    {
      step: 1,
      name: 'Upload',
      icon: UploadCloud,
      model: 'Ingest-Gate v2.1',
      desc: 'Sanitizes document payloads, extracts metadata, and generates SHA-256 tamper-proof ledger hashes.'
    },
    {
      step: 2,
      name: 'OCR Extraction',
      icon: FileText,
      model: 'GovDoc-OCR Vision',
      desc: 'Multilingual neural text recognition extracts key-value fields with coordinate spatial mapping.'
    },
    {
      step: 3,
      name: 'Forgery Detect',
      icon: ShieldAlert,
      model: 'FraudNet-v4',
      desc: 'Scans for pixel manipulation, stamp clone artifacts, font variance, and metadata inconsistencies.'
    },
    {
      step: 4,
      name: 'Risk Scoring',
      icon: Activity,
      model: 'XGBoost Risk Matrix',
      desc: 'Evaluates composite anomaly factors to compute transparent 0-100 risk scores with SHAP attribution.'
    },
    {
      step: 5,
      name: 'Identity Check',
      icon: Fingerprint,
      model: 'Central Registry Bridge',
      desc: 'Direct zero-knowledge cryptographic lookup against state civil registers and revenue databases.'
    },
    {
      step: 6,
      name: 'Decision',
      icon: Gavel,
      model: 'Autonomous Clearance Engine',
      desc: 'Auto-clears verified low-risk cases (<15 score) or routes flagged anomalies to officers in real-time.'
    }
  ];

  return (
    <div className="w-full pb-20">
      {/* Top Banner Notice */}
      <div className="bg-[#eff4ff] border-b border-[#c4c6cf]/60 py-2 px-6 text-center text-xs text-[#002045] font-medium flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#13696a] animate-ping" />
        <span>AutoGov+ Production Pilot: Processing 4.3M+ citizen verifications with 99.8% straight-through accuracy.</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-10">
        
        {/* ===================== HERO SECTION ===================== */}
        <section id="platform" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-24 min-h-[580px]">
          <div className="col-span-1 lg:col-span-6 space-y-5">
            {/* Enterprise Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4e4fc] rounded-full border border-[#c4c6cf]">
              <ShieldCheck className="w-4 h-4 text-[#002045]" />
              <span className="text-xs font-semibold text-[#002045] uppercase tracking-wider">
                Enterprise Security Grade
              </span>
            </div>

            {/* Display Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-bold text-[#002045] tracking-tight leading-[1.15]">
              Automating Trust in Public Services
            </h1>

            {/* Subtext */}
            <p className="text-lg text-[#43474e] leading-relaxed max-w-xl">
              Deploying rigorous, AI-driven document verification to accelerate citizen services while maintaining absolute institutional integrity and compliance.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('officer_review')}
                className="px-6 py-3.5 rounded bg-[#002045] text-white font-semibold hover:bg-[#1a365d] transition-all shadow-sm border border-[#002045] flex items-center gap-2 cursor-pointer group"
              >
                <span>Officer Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('citizen')}
                className="px-6 py-3.5 rounded border border-[#13696a] text-[#13696a] font-semibold hover:bg-[#a2eded]/30 transition-all bg-white shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Try Citizen Demo</span>
              </button>
            </div>

            {/* Key Pilot Badges */}
            <div className="pt-4 flex items-center gap-6 text-xs text-[#43474e] font-medium border-t border-[#c4c6cf]/40">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#13696a]" />
                <span>Zero-Trust Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#13696a]" />
                <span>SHAP Explainable ML</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#13696a]" />
                <span>Gov Cloud Compliant</span>
              </div>
            </div>
          </div>

          {/* Hero Monitor Display */}
          <div className="col-span-1 lg:col-span-6 relative h-[380px] sm:h-[460px] lg:h-[540px] rounded-xl overflow-hidden border border-[#c4c6cf] shadow-lg bg-[#e5eeff] group">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              alt="AutoGov+ Government Command Dashboard monitor preview"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKZ1BEwGdrh1qgpbR6cDeZq15PXlXXPrBdblummBYrPiygtwNWxxr6e_L85zjchYzsAu26NOtJe8Cq1cImsaZYAJ-wOm5OQn3aw9SyjiTikrQBIaRgzCyZXbDMf2XJNnoObTRN3h9yWaafsTPvZzvSL1rNB3B9tnZ7dX4QsE_-05JUvrBu-4qN4eY692KArtVVreNXiBtZZMvr_MV0e0BN5PUPk-VHsKI4LniHEwpyK-wie9YsD7sE"
            />

            {/* Floating Explainability Module */}
            <div className="absolute bottom-5 right-5 glass-card rounded-lg p-4 w-72 shadow-xl border border-white/80 transition-all duration-300 hover:translate-y-[-2px]">
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-5 h-5 text-[#13696a] fill-[#13696a] text-white" />
                <span className="text-sm font-bold text-[#0d1c2e]">Auto-Cleared</span>
                <span className="ml-auto text-[11px] font-semibold bg-[#a2eded] text-[#002020] px-1.5 py-0.5 rounded">
                  Rule 4A
                </span>
              </div>
              <div className="font-mono text-xs text-[#43474e] mb-1 font-semibold">
                Confidence: 99.8%
              </div>
              <div className="text-xs text-[#43474e] leading-snug">
                ID matches state registry. No forgery markers detected.
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-[#13696a] font-medium">
                <span>Latency: 1.4s</span>
                <button 
                  onClick={() => onNavigate('officer_review')}
                  className="hover:underline flex items-center gap-0.5"
                >
                  View Dossier →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== PROBLEM / SOLUTION BENTO GRID ===================== */}
        <section id="how-it-works" className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Problem Card */}
            <div className="col-span-1 md:col-span-5 bg-[#eff4ff] rounded-xl p-7 border border-[#c4c6cf] flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="absolute top-2 right-2 p-4 opacity-10 pointer-events-none">
                <Hourglass className="w-32 h-32 text-[#002045]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#ba1a1a] uppercase mb-2 tracking-wider">
                  The Bottleneck
                </div>
                <h2 className="text-2xl font-bold text-[#002045] mb-3">
                  Delayed Public Services
                </h2>
                <p className="text-sm text-[#43474e] leading-relaxed">
                  Manual document verification creates systemic backlogs. Citizens wait weeks for critical services while highly-trained officers spend hours on routine data entry rather than complex case resolution.
                </p>
              </div>

              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-between border-b border-[#c4c6cf]/60 py-2.5">
                  <span className="text-sm text-[#43474e]">Average Wait Time</span>
                  <span className="text-base font-bold text-[#ba1a1a]">15-30 Days</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-[#43474e]">Manual Review per File</span>
                  <span className="text-base font-bold text-[#ba1a1a]">20-30 Mins</span>
                </div>
              </div>
            </div>

            {/* Solution Card */}
            <div className="col-span-1 md:col-span-7 bg-[#002045] rounded-xl p-7 border border-[#1a365d] text-white flex flex-col justify-between relative overflow-hidden shadow-md">
              <div 
                className="absolute top-0 right-0 w-1/2 h-full opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              <div className="relative z-10">
                <div className="text-xs font-bold text-[#a5eff0] uppercase mb-2 tracking-wider">
                  The AutoGov+ Solution
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Real-Time Clearance
                </h2>
                <p className="text-sm text-[#adc7f7] max-w-lg mb-6 leading-relaxed">
                  An AI-driven pipeline that instantaneously validates standard submissions, reserving human expertise strictly for complex flags and anomalies. Trust is automated; oversight is guaranteed.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                  <div className="bg-[#1a365d] p-4 rounded-lg border border-[#2d476f] transition-all hover:border-[#a5eff0]/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Zap className="w-5 h-5 text-[#a5eff0]" />
                      <span className="text-sm font-bold text-white">AI-Cleared Cases</span>
                    </div>
                    <p className="text-xs text-[#adc7f7] leading-normal">
                      Routine applications processed instantly, updating citizen status in real-time.
                    </p>
                  </div>

                  <div className="bg-[#1a365d] p-4 rounded-lg border border-[#2d476f] transition-all hover:border-[#f8bc4b]/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <UserCheck className="w-5 h-5 text-[#f8bc4b]" />
                      <span className="text-sm font-bold text-white">Human-in-the-Loop</span>
                    </div>
                    <p className="text-xs text-[#adc7f7] leading-normal">
                      Anomalies routed to officers with comprehensive explainability modules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== AI PIPELINE ARCHITECTURE ===================== */}
        <section id="ai-engine" className="mb-24">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#002045]">
              Intelligent Processing Architecture
            </h2>
            <p className="text-sm text-[#43474e] mt-2">
              Rigorous, multi-stage validation ensuring zero-trust security principles.
            </p>
          </div>

          <div className="relative w-full overflow-x-auto pb-4">
            <div className="flex items-center justify-between min-w-[920px] bg-white rounded-xl border border-[#c4c6cf] p-6 shadow-sm">
              {pipelineSteps.map((step, idx) => {
                const IconComponent = step.icon;
                const isSelected = activePipelineStep === step.step;
                const isDecision = step.step === 6;

                return (
                  <React.Fragment key={step.step}>
                    {/* Step Node */}
                    <div 
                      onClick={() => setActivePipelineStep(step.step)}
                      className="flex flex-col items-center flex-1 z-10 bg-white group cursor-pointer"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isDecision
                          ? 'bg-[#a2eded] border border-[#13696a] text-[#1a6d6e] shadow-[0_0_12px_rgba(19,105,106,0.35)]'
                          : isSelected
                          ? 'bg-[#002045] text-white border-2 border-[#002045] scale-110 shadow-md'
                          : 'bg-[#dce9ff] border border-[#74777f] text-[#002045] group-hover:border-[#002045]'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-semibold text-center ${
                        isDecision 
                          ? 'text-[#1a6d6e]' 
                          : isSelected 
                          ? 'text-[#002045] font-bold underline decoration-[#13696a] decoration-2 underline-offset-4' 
                          : 'text-[#002045]'
                      }`}>
                        {step.name}
                      </span>
                    </div>

                    {/* Connector Arrow */}
                    {idx < pipelineSteps.length - 1 && (
                      <div className={`flex-1 h-[2px] relative transition-colors ${
                        idx === 4 ? 'bg-[#13696a]' : 'bg-[#c4c6cf]'
                      }`}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1">
                          <ArrowRight className={`w-3.5 h-3.5 ${
                            idx === 4 ? 'text-[#13696a]' : 'text-[#74777f]'
                          }`} />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Active Step Explainer Drawer */}
          {activePipelineStep !== null && (
            <div className="mt-4 bg-[#eff4ff] border border-[#c4c6cf] rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#002045] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  0{activePipelineStep}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-[#002045]">
                      Stage {activePipelineStep}: {pipelineSteps[activePipelineStep - 1].name}
                    </h4>
                    <span className="font-mono text-xs bg-[#d4e4fc] text-[#002045] px-2 py-0.5 rounded border border-[#c4c6cf]">
                      {pipelineSteps[activePipelineStep - 1].model}
                    </span>
                  </div>
                  <p className="text-sm text-[#43474e] mt-1">
                    {pipelineSteps[activePipelineStep - 1].desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('citizen')}
                className="shrink-0 px-4 py-2 bg-white border border-[#13696a] text-[#13696a] text-xs font-semibold rounded hover:bg-[#a2eded]/20 transition-colors flex items-center gap-1.5"
              >
                <span>Test this stage in Demo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>

        {/* ===================== PROPOSED IMPACT MATRIX ===================== */}
        <section id="impact" className="mb-16">
          <div className="bg-white rounded-xl border border-[#c4c6cf] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#c4c6cf] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#002045]">
                  Proposed Impact Matrix
                </h2>
                <p className="text-xs text-[#43474e] mt-1">
                  Projected operational efficiencies based on pilot parameters.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#43474e]">
                <span>Pilot Parameter:</span>
                <span className="px-2.5 py-1 bg-[#eff4ff] text-[#002045] border border-[#c4c6cf] rounded">
                  Tier-1 Revenue & Municipal Services
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#002045] text-white">
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider">Metric</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider">Current State (Manual)</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider">AutoGov+ Target</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider">Efficiency Gain</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#c4c6cf] zebra-row hover:bg-[#eff4ff] transition-colors">
                    <td className="p-4 text-sm font-medium text-[#002045]">Application Turnaround</td>
                    <td className="p-4 text-sm text-[#43474e]">15-30 Days</td>
                    <td className="p-4 text-sm text-[#13696a] font-bold flex items-center gap-1.5">
                      <Timer className="w-4 h-4" />
                      <span>&lt;48 Hours</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 bg-[#a2eded] text-[#1a6d6e] text-xs rounded font-bold">
                        ~90% Reduction
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b border-[#c4c6cf] zebra-row hover:bg-[#eff4ff] transition-colors">
                    <td className="p-4 text-sm font-medium text-[#002045]">Officer Time per File</td>
                    <td className="p-4 text-sm text-[#43474e]">20-30 Minutes</td>
                    <td className="p-4 text-sm text-[#13696a] font-bold flex items-center gap-1.5">
                      <Scale className="w-4 h-4" />
                      <span>3-5 Minutes</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 bg-[#a2eded] text-[#1a6d6e] text-xs rounded font-bold">
                        ~83% Reduction
                      </span>
                    </td>
                  </tr>

                  <tr className="zebra-row hover:bg-[#eff4ff] transition-colors">
                    <td className="p-4 text-sm font-medium text-[#002045]">Accuracy / Compliance</td>
                    <td className="p-4 text-sm text-[#43474e]">Variable (Human Error)</td>
                    <td className="p-4 text-sm text-[#13696a] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>&gt;99.5%</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 bg-[#a2eded] text-[#1a6d6e] text-xs rounded font-bold">
                        Standardized
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-white border-t border-[#c4c6cf] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#43474e] shrink-0 mt-0.5" />
              <p className="text-xs text-[#43474e] italic">
                Target impact defined in the AutoGov+ proposal; to be validated during pilot deployment.
              </p>
            </div>
          </div>
        </section>

        {/* ===================== SECURITY & INSTITUTIONAL TRUST ===================== */}
        <section id="security" className="mb-16 bg-[#002045] rounded-xl p-8 text-white border border-[#1a365d]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#1a365d] rounded text-xs font-semibold text-[#a5eff0]">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-Knowledge Verification</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Institutional Integrity & Auditable Compliance
              </h3>
              <p className="text-sm text-[#adc7f7] leading-relaxed">
                AutoGov+ does not store raw biometrics or unnecessary citizen personally identifiable information (PII). All model decisions produce mathematical SHAP vectors and an immutable cryptographic audit log for legislative review.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => onNavigate('officer_review')}
                className="w-full py-3 px-4 bg-[#a2eded] text-[#002020] font-bold text-sm rounded hover:bg-[#89d3d4] transition-colors text-center"
              >
                Inspect Live Case AG-2026-1049
              </button>
              <button
                onClick={() => onNavigate('citizen')}
                className="w-full py-3 px-4 bg-transparent border border-[#a5eff0] text-[#a5eff0] font-semibold text-sm rounded hover:bg-[#1a365d] transition-colors text-center"
              >
                Launch Citizen Demo Portal
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
