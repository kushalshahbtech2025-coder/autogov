import React, { useState } from 'react';
import { ViewMode, TechStackItem, Application } from '../../types';
import { DynamicTechStackMatrix } from '../DynamicTechStackMatrix';
import { 
  Code2, 
  Server, 
  Cpu, 
  Search, 
  ShieldAlert, 
  BarChart3, 
  Database, 
  Lock, 
  ArrowRight, 
  ArrowDown,
  CheckCircle2, 
  Zap, 
  GitBranch, 
  Check, 
  Workflow, 
  ChevronRight,
  UploadCloud,
  FileSearch,
  UserCheck,
  RefreshCw
} from 'lucide-react';

interface TechStackPageProps {
  onNavigate: (view: ViewMode) => void;
  techStack: TechStackItem[];
  onUpdateTechStack: (updated: TechStackItem[]) => void;
  onResetDefaultTechStack: () => void;
  applications: Application[];
}

export const TechStackPage: React.FC<TechStackPageProps> = ({ 
  onNavigate,
  techStack,
  onUpdateTechStack,
  onResetDefaultTechStack,
  applications
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-3');

  // Interactive risk simulator
  const [simFactors, setSimFactors] = useState({
    fontVariance: 20,
    registryMatch: 95,
    sealAuthenticity: 90,
    incomeRangeAnomaly: 15
  });

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

  const isAutoCleared = computedRisk < 15;
  const [activeModelTab, setActiveModelTab] = useState<'ocr' | 'fraud' | 'xgboost' | 'shap'>('ocr');

  const flowchartNodes = [
    {
      id: 'node-1',
      stepNumber: 1,
      stage: 'Ingestion',
      title: 'PWA Upload & Hash',
      tech: 'React 18 • SHA-256',
      latency: '120ms',
      icon: UploadCloud,
      desc: 'Sanitizes macros, calculates SHA-256 ledger checksum, and normalizes to 300 DPI.',
      input: 'PDF / Image Stream (300 DPI)',
      output: 'Immutable SHA-256 Checksum + Queue Ticket',
      guarantee: 'Zero PII exposure before cryptographic handshake'
    },
    {
      id: 'node-2',
      stepNumber: 2,
      stage: 'Gateway',
      title: 'API Orchestrator',
      tech: 'FastAPI / Node.js • Queue',
      latency: '45ms',
      icon: Server,
      desc: 'Validates bearer auth, applies rate limits, and routes to GPU worker pools.',
      input: 'Bearer JWT + Normalized Document Buffer',
      output: 'Priority Session Queue #4492',
      guarantee: 'Sub-50ms dispatch with zero dropped requests'
    },
    {
      id: 'node-3',
      stepNumber: 3,
      stage: 'AI Vision',
      title: 'GovDoc-OCR & NER',
      tech: 'ViT • IndicBERT • Tesseract',
      latency: '340ms',
      icon: FileSearch,
      desc: 'Multilingual 2D layout parser extracting Name, Income, DOB, and ID with bounding boxes.',
      input: '2400x3200 Raster Tensor',
      output: 'Structured JSON Key-Value Map',
      guarantee: '99.91% F1-score across 18 administrative languages'
    },
    {
      id: 'node-4',
      stepNumber: 4,
      stage: 'Forensics',
      title: 'FraudNet CNN Forensics',
      tech: 'ResNet-50 • ELA • Stamp Verifier',
      latency: '280ms',
      icon: ShieldAlert,
      desc: 'Scans for JPEG compression splices, font kerning variance, and seal authenticity.',
      input: 'Document Sub-regions & ELA Matrix',
      output: 'Tamper Probability: 0.04% (Valid)',
      guarantee: 'Sub-pixel detection of digital edits and stamp splices'
    },
    {
      id: 'node-5',
      stepNumber: 5,
      stage: 'Risk Engine',
      title: 'XGBoost & FAISS Match',
      tech: 'XGBoost 2.0 • FAISS • SHAP',
      latency: '190ms',
      icon: BarChart3,
      desc: 'Evaluates 42 risk factors and checks state registry duplicates to yield 0-100% score.',
      input: '42 Statutory Features + FAISS Vector',
      output: 'Composite Risk Score + SHAP Vector',
      guarantee: 'Calibrated continuous probabilities with zero bias'
    }
  ];

  const activeNode = flowchartNodes.find(n => n.id === selectedNodeId) || flowchartNodes[2];

  const modelSpecs = [
    {
      id: 'ocr',
      name: 'GovDoc-OCR Vision',
      metric: '99.91% F1 • 340ms',
      summary: 'Multimodal vision transformer trained on official municipal forms and certificates.'
    },
    {
      id: 'fraud',
      name: 'FraudNet-v4 CNN',
      metric: '99.4% Recall • 280ms',
      summary: 'Dual-stream forensic neural net detecting font splices and manipulated seals.'
    },
    {
      id: 'xgboost',
      name: 'XGBoost Risk Matrix',
      metric: 'AUC 0.998 • 190ms',
      summary: '1,200 decision trees evaluating cross-field consistency and registry anomalies.'
    },
    {
      id: 'shap',
      name: 'SHAP Explainability',
      metric: 'Game-Theoretic • Real-Time',
      summary: 'Translates ML risk predictions into transparent, auditable feature impact scores.'
    }
  ];

  const supportedServices = [
    { name: 'Income Certificate', authority: 'Revenue & Tax', sla: '< 1.8s', acc: '99.92%' },
    { name: 'Domicile Registry', authority: 'Home & Civil Affairs', sla: '< 1.4s', acc: '99.88%' },
    { name: 'Caste Validation', authority: 'Social Welfare', sla: '< 2.1s', acc: '99.95%' },
    { name: 'Land Deeds & Mutation', authority: 'Land Resources', sla: '< 3.2s', acc: '99.78%' },
    { name: 'Pension Verification', authority: 'Social Security', sla: '< 1.2s', acc: '99.97%' },
    { name: 'Trade & Business License', authority: 'Urban Commerce', sla: '< 2.4s', acc: '99.84%' }
  ];

  return (
    <div className="w-full bg-[#f8f9ff] py-8 px-4 sm:px-6">
      <div className="max-w-[1360px] mx-auto space-y-8">
        
        {/* Compact Hero Banner */}
        <div className="bg-[#002045] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#13696a]/40 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13696a]/30 border border-[#13696a]/50 text-[#a5eff0] text-xs font-bold uppercase tracking-wider">
              <Workflow className="w-3.5 h-3.5" />
              <span>Unified Tech Stack &amp; AI Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Document Verification Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-[#adc7f7] leading-relaxed">
              Real-time architectural flow from client-side upload through AI vision, forensic checks, and risk scoring to automated clearance or officer review.
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 shrink-0">
            <div className="bg-[#1a365d] px-3.5 py-2.5 rounded-xl border border-[#2d476f] text-center">
              <div className="text-[10px] text-[#86a0cd]">Total Latency</div>
              <div className="text-sm font-bold text-[#a5eff0]">&lt; 1.85s SLA</div>
            </div>
            <div className="bg-[#1a365d] px-3.5 py-2.5 rounded-xl border border-[#2d476f] text-center">
              <div className="text-[10px] text-[#86a0cd]">Auto-Clearance</div>
              <div className="text-sm font-bold text-[#a5eff0]">88% Instant</div>
            </div>
            <div className="bg-[#1a365d] px-3.5 py-2.5 rounded-xl border border-[#2d476f] text-center">
              <div className="text-[10px] text-[#86a0cd]">Audit Ledger</div>
              <div className="text-sm font-bold text-white">SHA-256</div>
            </div>
          </div>
        </div>

        {/* ===================== THE PIPELINE FLOWCHART ===================== */}
        <section className="bg-white rounded-2xl border border-[#c4c6cf] p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#c4c6cf]/60 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
                Verification Dataflow Flowchart
              </h2>
              <p className="text-xs text-[#43474e]">
                Click any step to inspect technical contracts, latency, and guarantees.
              </p>
            </div>
            <span className="text-xs bg-[#eff4ff] text-[#002045] font-bold px-2.5 py-1 rounded border border-[#c4c6cf]">
              7 Connected Stages
            </span>
          </div>

          {/* Sequential 5 Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {flowchartNodes.map((node, idx) => {
              const Icon = node.icon;
              const isSelected = selectedNodeId === node.id;
              return (
                <div key={node.id} className="relative flex flex-col">
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`h-full rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-[#002045] bg-[#eff4ff] shadow-sm ring-2 ring-[#002045]/20' 
                        : 'border-[#c4c6cf] bg-white hover:border-[#002045]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-6 h-6 rounded text-xs font-black flex items-center justify-center ${
                          isSelected ? 'bg-[#002045] text-white' : 'bg-[#e2e8f0] text-[#002045]'
                        }`}>
                          0{node.stepNumber}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#13696a]">
                          {node.latency}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="w-3.5 h-3.5 text-[#13696a]" />
                        <span className="text-[11px] font-bold text-[#13696a] uppercase">{node.stage}</span>
                      </div>

                      <h3 className="text-xs font-bold text-[#002045] mb-1 leading-tight">
                        {node.title}
                      </h3>

                      <p className="text-[11px] text-[#43474e] leading-snug line-clamp-2 mb-2">
                        {node.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#c4c6cf]/40">
                      <span className="text-[10px] font-mono text-[#002045] block truncate">
                        {node.tech}
                      </span>
                    </div>
                  </div>

                  {idx < 4 && (
                    <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-white border border-[#c4c6cf] items-center justify-center text-[#13696a]">
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  )}
                  {idx < 4 && (
                    <div className="md:hidden flex justify-center py-1 text-[#13696a]">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Router Decision Connector */}
          <div className="flex flex-col items-center justify-center py-1">
            <div className="w-0.5 h-4 bg-[#002045]/40" />
            <div className="px-3 py-1 rounded-full bg-[#002045] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
              <GitBranch className="w-3 h-3 text-[#a5eff0]" />
              <span>Stage 6: Intelligent Decision Router</span>
            </div>
            <div className="w-0.5 h-4 bg-[#002045]/40" />
          </div>

          {/* Two Compact Branches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Branch A */}
            <div className="bg-[#f0fdfa] rounded-xl p-4 border border-[#14b8a6] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#0f766e] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Branch A • Risk &lt; 15% (88% Volume)
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white text-[#0f766e] px-2 py-0.5 rounded border border-[#14b8a6]/40">
                    &lt; 1.85s SLA
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#002045] mb-1">
                  Instant Autonomous Clearance
                </h4>
                <p className="text-xs text-[#43474e] leading-relaxed">
                  Documents with valid seals and no anomaly flags are approved instantly with an Ed25519 digital signature and dispatched to the citizen.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#14b8a6]/30 flex items-center justify-between text-xs">
                <span className="text-[#0f766e] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Zero Manual Delay
                </span>
                <button 
                  onClick={() => onNavigate('citizen')}
                  className="font-bold text-[#002045] hover:underline cursor-pointer"
                >
                  Test Citizen Path →
                </button>
              </div>
            </div>

            {/* Branch B */}
            <div className="bg-[#fff1f2] rounded-xl p-4 border border-[#f43f5e] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#be123c] flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    Branch B • Risk &ge; 15% (12% Volume)
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white text-[#be123c] px-2 py-0.5 rounded border border-[#f43f5e]/40">
                    &lt; 2h Triage
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#002045] mb-1">
                  Officer Adjudication Cockpit
                </h4>
                <p className="text-xs text-[#43474e] leading-relaxed">
                  Documents with tamper traces or registry mismatches route to caseworkers with bounding box highlights and SHAP feature scores.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#f43f5e]/30 flex items-center justify-between text-xs">
                <span className="text-[#be123c] font-semibold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Human-in-the-Loop
                </span>
                <button 
                  onClick={() => onNavigate('officer_review')}
                  className="font-bold text-[#002045] hover:underline cursor-pointer"
                >
                  Open Cockpit →
                </button>
              </div>
            </div>

          </div>

          {/* Convergence to Stage 7 */}
          <div className="bg-[#002045] text-white rounded-xl p-4 sm:p-5 border border-[#13696a]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#a5eff0] uppercase flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Stage 7: Permanent Audit Ledger</span>
              </div>
              <p className="text-xs text-[#adc7f7]">
                PostgreSQL 16 + pgvector with SHA-256 cryptographic audit logs and zero PII retention in volatile memory.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className="text-[10px] bg-[#1a365d] text-[#a5eff0] px-2.5 py-1 rounded border border-[#2d476f] font-mono">
                ISO 42001
              </span>
              <span className="text-[10px] bg-[#1a365d] text-[#a5eff0] px-2.5 py-1 rounded border border-[#2d476f] font-mono">
                FedRAMP High
              </span>
            </div>
          </div>

          {/* Compact Node Inspector */}
          <div className="bg-[#eff4ff] rounded-xl p-4 border border-[#c4c6cf] space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#002045] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-[#002045] text-white text-[10px] font-black flex items-center justify-center">
                  0{activeNode.stepNumber}
                </span>
                <span>Selected: {activeNode.title}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#13696a] bg-white px-2 py-0.5 rounded border border-[#c4c6cf]">
                {activeNode.latency}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-[#c4c6cf]">
                <span className="text-[10px] text-[#43474e] block">Input:</span>
                <span className="font-mono text-[11px] text-[#002045]">{activeNode.input}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#c4c6cf]">
                <span className="text-[10px] text-[#43474e] block">Output:</span>
                <span className="font-mono text-[11px] text-[#13696a]">{activeNode.output}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#c4c6cf]">
                <span className="text-[10px] text-[#43474e] block">Guarantee:</span>
                <span className="text-[11px] font-semibold text-[#002045]">{activeNode.guarantee}</span>
              </div>
            </div>
          </div>

        </section>

        {/* ===================== COMPACT AI SIMULATOR & MODEL SPECS ===================== */}
        <section className="bg-white rounded-2xl border border-[#c4c6cf] p-5 sm:p-7 shadow-xs space-y-5">
          <div className="border-b border-[#c4c6cf]/60 pb-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#002045]">
              AI Risk Engine &amp; Decision Simulator
            </h2>
            <p className="text-xs text-[#43474e]">
              Adjust indicators to test how the model classifies between Branch A (Auto) and Branch B (Officer Review).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#f8f9ff] p-4 sm:p-6 rounded-xl border border-[#c4c6cf]">
            
            {/* Sliders */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold text-[#002045]">
                  <span>Font Variance (Tamper)</span>
                  <span className="font-mono text-[#13696a]">{simFactors.fontVariance}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={simFactors.fontVariance}
                  onChange={(e) => setSimFactors({...simFactors, fontVariance: Number(e.target.value)})}
                  className="w-full accent-[#002045] h-1.5 bg-[#e2e8f0] rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold text-[#002045]">
                  <span>Registry Match %</span>
                  <span className="font-mono text-[#13696a]">{simFactors.registryMatch}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={simFactors.registryMatch}
                  onChange={(e) => setSimFactors({...simFactors, registryMatch: Number(e.target.value)})}
                  className="w-full accent-[#002045] h-1.5 bg-[#e2e8f0] rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold text-[#002045]">
                  <span>Seal Authenticity %</span>
                  <span className="font-mono text-[#13696a]">{simFactors.sealAuthenticity}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={simFactors.sealAuthenticity}
                  onChange={(e) => setSimFactors({...simFactors, sealAuthenticity: Number(e.target.value)})}
                  className="w-full accent-[#002045] h-1.5 bg-[#e2e8f0] rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold text-[#002045]">
                  <span>Income Anomaly %</span>
                  <span className="font-mono text-[#13696a]">{simFactors.incomeRangeAnomaly}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={simFactors.incomeRangeAnomaly}
                  onChange={(e) => setSimFactors({...simFactors, incomeRangeAnomaly: Number(e.target.value)})}
                  className="w-full accent-[#002045] h-1.5 bg-[#e2e8f0] rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Gauge */}
            <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-[#c4c6cf] space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#43474e]">Risk Output:</span>
                <span className={`text-3xl font-extrabold ${isAutoCleared ? 'text-[#13696a]' : 'text-[#b91c1c]'}`}>
                  {computedRisk}%
                </span>
              </div>
              <div className={`p-2 rounded text-xs font-semibold ${isAutoCleared ? 'bg-[#eff4ff] text-[#13696a]' : 'bg-[#fff1f2] text-[#b91c1c]'}`}>
                {isAutoCleared ? '✓ Routes to Branch A (Auto-Cleared)' : '⚠ Routes to Branch B (Officer Review)'}
              </div>
              <button 
                onClick={() => setSimFactors({ fontVariance: 10, registryMatch: 98, sealAuthenticity: 95, incomeRangeAnomaly: 5 })}
                className="text-[11px] text-[#13696a] hover:underline cursor-pointer block text-right w-full"
              >
                Reset to Low Risk
              </button>
            </div>

          </div>

          {/* Model Specs Quick Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {modelSpecs.map(m => (
              <div key={m.id} className="bg-[#f8f9ff] p-3 rounded-xl border border-[#c4c6cf] space-y-1">
                <div className="text-xs font-bold text-[#002045]">{m.name}</div>
                <div className="text-[11px] font-mono font-bold text-[#13696a]">{m.metric}</div>
                <p className="text-[11px] text-[#43474e] leading-snug">{m.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== DYNAMIC TECH STACK MATRIX ===================== */}
        <DynamicTechStackMatrix 
          techStack={techStack}
          onUpdateTechStack={onUpdateTechStack}
          onResetDefault={onResetDefaultTechStack}
          applications={applications}
          onNavigate={onNavigate}
        />

        {/* ===================== DEPLOYED CITIZEN SERVICES TABLE ===================== */}
        <section className="bg-white rounded-2xl border border-[#c4c6cf] p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#c4c6cf]/60 pb-3">
            <h2 className="text-lg font-bold text-[#002045]">
              Deployed Services &amp; Departmental SLAs
            </h2>
            <button 
              onClick={() => onNavigate('citizen')}
              className="text-xs text-[#13696a] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Test in Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {supportedServices.map((s, idx) => (
              <div key={idx} className="bg-[#f8f9ff] p-3 rounded-xl border border-[#c4c6cf] space-y-1">
                <div className="text-xs font-bold text-[#002045] leading-tight">{s.name}</div>
                <div className="text-[10px] text-[#43474e]">{s.authority}</div>
                <div className="text-[11px] font-mono font-bold text-[#13696a] pt-1 border-t border-[#c4c6cf]/40">
                  {s.sla} • {s.acc}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
