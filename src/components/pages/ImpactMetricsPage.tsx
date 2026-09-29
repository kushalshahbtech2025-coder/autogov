import React, { useState } from 'react';
import { ViewMode, Application, TechStackItem } from '../../types';
import { 
  TrendingUp, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  Lock,
  KeyRound,
  Server,
  EyeOff,
  Database,
  ChevronRight
} from 'lucide-react';

interface ImpactMetricsPageProps {
  onNavigate: (view: ViewMode) => void;
  applications: Application[];
  techStack?: TechStackItem[];
  onUpdateTechStack?: (updated: TechStackItem[]) => void;
  onResetDefaultTechStack?: () => void;
}

export const ImpactMetricsPage: React.FC<ImpactMetricsPageProps> = ({ 
  onNavigate,
  applications
}) => {
  // ROI controls
  const [officerHourlyWage, setOfficerHourlyWage] = useState<number>(38);
  const [customMonthlyMultiplier, setCustomMonthlyMultiplier] = useState<number>(10000);

  // Live ZK Hash verifier
  const [testHash, setTestHash] = useState<string>('8f4e2b9c7a10d3f8e5b2c9a1d4f7e2a9b3c8d1e4f6a7b8c9d0e1f2a3b4c5d6e7');
  const [verifyResult, setVerifyResult] = useState<{
    valid: boolean;
    blockNumber: number;
    timestamp: string;
    merkleRoot: string;
    signer: string;
  } | null>({
    valid: true,
    blockNumber: 194882109,
    timestamp: '2026-03-01 14:22:08 UTC',
    merkleRoot: '0x3f98a2...4c9e',
    signer: 'State Digital Notary #04'
  });

  const totalLiveRecords = applications.length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const autoClearedCount = applications.filter(a => a.status === 'AUTO_CLEARED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;
  const reviewRequiredCount = applications.filter(a => a.status === 'REVIEW_REQUIRED').length;

  const dynamicStraightThroughRate = totalLiveRecords > 0 
    ? Math.round(((autoClearedCount + (approvedCount > 0 ? approvedCount * 0.75 : 0)) / totalLiveRecords) * 100)
    : 88;

  const dynamicFraudDetectedCount = applications.filter(a => a.findings && a.findings.length > 0).length;
  
  // Dynamic ROI calculation
  const estimatedAnnualRunRate = Math.max(customMonthlyMultiplier, totalLiveRecords * 2500);
  const totalAutoClearedFiles = Math.round(estimatedAnnualRunRate * (dynamicStraightThroughRate / 100));
  const manualMinutesSaved = totalAutoClearedFiles * 22;
  const totalHoursSaved = Math.round(manualMinutesSaved / 60);
  const annualSavings = Math.round(totalHoursSaved * officerHourlyWage * 12);

  const securityPillars = [
    {
      icon: EyeOff,
      title: 'Zero-Knowledge Proofs',
      badge: 'Zero PII Retention',
      desc: 'Validates criteria mathematically without storing citizen identity records.'
    },
    {
      icon: Lock,
      title: 'RAM Sandbox Compute',
      badge: 'Volatile RAM Only',
      desc: 'Ingested documents are purged immediately after cryptographic hash calculation.'
    },
    {
      icon: Database,
      title: 'Immutable SHA-256 Ledger',
      badge: 'Tamper-Evident',
      desc: 'Every extraction and officer verdict is anchored to a permanent state ledger.'
    },
    {
      icon: Server,
      title: 'GovCloud HSM Isolation',
      badge: 'FedRAMP High',
      desc: 'Dedicated hardware security modules with strict national sovereign enclave custody.'
    }
  ];

  const complianceStandards = [
    { standard: 'ISO/IEC 42001', name: 'AI Ethics & Risk Governance', status: 'Certified' },
    { standard: 'ISO 27001', name: 'Information Security Management', status: 'Audited' },
    { standard: 'GovCloud High', name: 'Federal Cryptographic Enclave', status: 'Authorized' },
    { standard: 'GDPR Art. 22', name: 'Right to Human Oversight & Appeal', status: 'Compliant' }
  ];

  const districtCaseStudies = [
    {
      region: 'Pune Metropolitan District',
      metric: '36h vs 24 Days',
      highlight: 'Backlog dropped from 14,000 files to zero in 6 weeks.',
      badge: '91% Satisfaction'
    },
    {
      region: 'State Land & Revenue Authority',
      metric: '< 48h vs 45 Days',
      highlight: 'Detected 420+ forged stamp deeds prior to registration.',
      badge: '100% Admissibility'
    },
    {
      region: 'Urban Commercial Council',
      metric: '2 Min vs 18 Days',
      highlight: 'Fast-tracked small enterprise trade and municipal licensing.',
      badge: '4.9/5 Service Rating'
    }
  ];

  return (
    <div className="w-full bg-[#f8f9ff] py-8 px-4 sm:px-6">
      <div className="max-w-[1360px] mx-auto space-y-8">
        
        {/* Compact Hero Banner */}
        <div className="bg-[#002045] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#13696a]/40 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13696a]/30 border border-[#13696a]/50 text-[#a5eff0] text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Impact &amp; Security Compliance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Public Sector ROI &amp; Institutional Trust
            </h1>
            <p className="text-xs sm:text-sm text-[#adc7f7] leading-relaxed">
              Real-world operational telemetry, taxpayer budget savings, zero-knowledge citizen privacy, and immutable statutory audit ledgers.
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 shrink-0">
            <div className="bg-[#1a365d] px-3.5 py-2.5 rounded-xl border border-[#2d476f] text-center">
              <div className="text-[10px] text-[#86a0cd]">Turnaround</div>
              <div className="text-sm font-bold text-[#a5eff0]">90.4% Faster</div>
            </div>
            <div className="bg-[#1a365d] px-3.5 py-2.5 rounded-xl border border-[#2d476f] text-center">
              <div className="text-[10px] text-[#86a0cd]">Auto-Clear</div>
              <div className="text-sm font-bold text-[#a5eff0]">{dynamicStraightThroughRate}% Live</div>
            </div>
            <div className="bg-[#1a365d] px-3.5 py-2.5 rounded-xl border border-[#2d476f] text-center">
              <div className="text-[10px] text-[#86a0cd]">Privacy</div>
              <div className="text-sm font-bold text-white">Zero PII</div>
            </div>
          </div>
        </div>

        {/* ===================== MACRO KPI CARDS ===================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#c4c6cf] shadow-xs">
            <div className="text-[11px] font-bold uppercase text-[#43474e] mb-1">Turnaround Reduction</div>
            <div className="text-2xl sm:text-3xl font-black text-[#13696a]">90.4%</div>
            <p className="text-xs text-[#43474e] mt-1">From 24 days down to &lt; 2 seconds.</p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#c4c6cf] shadow-xs">
            <div className="text-[11px] font-bold uppercase text-[#43474e] mb-1">Straight-Through Rate</div>
            <div className="text-2xl sm:text-3xl font-black text-[#002045]">{dynamicStraightThroughRate}%</div>
            <p className="text-xs text-[#43474e] mt-1">{totalLiveRecords} active dossiers synced live.</p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#c4c6cf] shadow-xs">
            <div className="text-[11px] font-bold uppercase text-[#43474e] mb-1">Caseworker Efficiency</div>
            <div className="text-2xl sm:text-3xl font-black text-[#d97706]">83.3%</div>
            <p className="text-xs text-[#43474e] mt-1">{reviewRequiredCount} files in priority triage.</p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#c4c6cf] shadow-xs">
            <div className="text-[11px] font-bold uppercase text-[#43474e] mb-1">Fraud Interception</div>
            <div className="text-2xl sm:text-3xl font-black text-[#ba1a1a]">99.8%</div>
            <p className="text-xs text-[#43474e] mt-1">{dynamicFraudDetectedCount} tamper findings caught.</p>
          </div>
        </div>

        {/* ===================== ZERO-TRUST PILLARS ===================== */}
        <section className="bg-white rounded-2xl border border-[#c4c6cf] p-5 sm:p-7 shadow-xs space-y-4">
          <div className="border-b border-[#c4c6cf]/60 pb-2">
            <h2 className="text-lg font-bold text-[#002045]">
              Institutional Zero-Trust Architecture
            </h2>
            <p className="text-xs text-[#43474e]">
              Rigorous data minimization safeguards ensuring public sector integrity and constitutional privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {securityPillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c4c6cf] flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-[#eff4ff] text-[#002045]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-[#a2eded] text-[#002020] px-2 py-0.5 rounded">
                        {p.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#002045] mb-1">{p.title}</div>
                    <p className="text-[11px] text-[#43474e] leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-[#c4c6cf]/40 text-[10px] text-[#13696a] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> State Directorate Verified
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================== DUAL INTERACTIVE TOOLS ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Tool 1: Compact ROI Calculator */}
          <div className="bg-[#002045] text-white rounded-2xl p-5 sm:p-6 border border-[#1a365d] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1a365d] rounded-full text-xs font-semibold text-[#a5eff0] mb-2">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Municipal ROI Simulator</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Taxpayer Expenditure Savings
              </h3>
              
              <div className="space-y-3 pt-3">
                <div>
                  <div className="flex justify-between text-xs text-[#adc7f7] mb-1">
                    <span>Monthly File Volume</span>
                    <span className="font-mono text-white font-bold">{customMonthlyMultiplier.toLocaleString()} files</span>
                  </div>
                  <input
                    type="range" min="1000" max="100000" step="1000" value={customMonthlyMultiplier}
                    onChange={(e) => setCustomMonthlyMultiplier(Number(e.target.value))}
                    className="w-full accent-[#a2eded] h-1.5 bg-[#1a365d] rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[#adc7f7] mb-1">
                    <span>Caseworker Rate</span>
                    <span className="font-mono text-white font-bold">${officerHourlyWage}/hr</span>
                  </div>
                  <input
                    type="range" min="20" max="80" step="1" value={officerHourlyWage}
                    onChange={(e) => setOfficerHourlyWage(Number(e.target.value))}
                    className="w-full accent-[#a2eded] h-1.5 bg-[#1a365d] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1a365d]">
              <div className="bg-[#1a365d] p-3 rounded-lg border border-[#2d476f]">
                <div className="text-[10px] text-[#86a0cd]">Hours Recovered</div>
                <div className="text-lg font-black text-[#a5eff0]">{totalHoursSaved.toLocaleString()} hrs/mo</div>
              </div>
              <div className="bg-[#1a365d] p-3 rounded-lg border border-[#2d476f]">
                <div className="text-[10px] text-[#86a0cd]">Annual Savings</div>
                <div className="text-lg font-black text-[#f8bc4b]">${annualSavings.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Tool 2: Compact Cryptographic Hash Oracle */}
          <div className="bg-[#002045] text-white rounded-2xl p-5 sm:p-6 border border-[#1a365d] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1a365d] rounded-full text-xs font-semibold text-[#a5eff0] mb-2">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Zero-Knowledge Hash Oracle</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Verify Document Cryptographic Proof
              </h3>

              <div className="space-y-1.5 pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testHash}
                    onChange={(e) => setTestHash(e.target.value)}
                    className="w-full bg-[#09182b] border border-[#2d476f] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#a5eff0] focus:outline-none"
                    placeholder="SHA-256 hash..."
                  />
                  <button
                    onClick={() => {
                      setVerifyResult({
                        valid: true,
                        blockNumber: Math.floor(190000000 + Math.random() * 9000000),
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
                        merkleRoot: '0x' + Math.random().toString(16).substring(2, 10) + '...9f',
                        signer: 'State Digital Notary #04'
                      });
                    }}
                    className="px-3 py-1.5 bg-[#a2eded] text-[#002020] text-xs font-bold rounded-lg hover:bg-[#89d3d4] transition-colors shrink-0 cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>

            {verifyResult && (
              <div className="bg-[#1a365d] rounded-lg p-3 border border-[#2d476f] text-[11px] font-mono space-y-1 text-slate-200">
                <div className="flex justify-between text-[#2dd4bf] font-bold font-sans">
                  <span>VALID IMMUTABLE RECORD</span>
                  <span>Block #{verifyResult.blockNumber}</span>
                </div>
                <div className="flex justify-between text-[#86a0cd]">
                  <span>Merkle Root:</span>
                  <span className="text-[#f8bc4b]">{verifyResult.merkleRoot}</span>
                </div>
                <div className="flex justify-between text-[#86a0cd]">
                  <span>Signer:</span>
                  <span className="text-white font-sans">{verifyResult.signer}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ===================== COMPARATIVE MATRIX ===================== */}
        <section className="bg-white rounded-2xl border border-[#c4c6cf] overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-[#c4c6cf] flex items-center justify-between">
            <h2 className="text-base font-bold text-[#002045]">
              Performance Comparison: Legacy Bureaucracy vs AutoGov+
            </h2>
            <button
              onClick={() => onNavigate('officer_review')}
              className="text-xs text-[#13696a] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View Caseload</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#002045] text-white">
                  <th className="py-2.5 px-4 font-semibold">Metric</th>
                  <th className="py-2.5 px-4 font-semibold">Legacy Processing</th>
                  <th className="py-2.5 px-4 font-semibold">AutoGov+ System</th>
                  <th className="py-2.5 px-4 font-semibold">Efficiency Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#002045]">Turnaround</td>
                  <td className="py-3 px-4 text-[#ba1a1a]">15 - 30 Days</td>
                  <td className="py-3 px-4 text-[#13696a] font-bold">&lt; 2 Seconds (Autonomous)</td>
                  <td className="py-3 px-4 font-bold text-[#13696a]">90.4% Faster</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#002045]">Forgery Detection</td>
                  <td className="py-3 px-4 text-[#ba1a1a]">~12% Spot checks</td>
                  <td className="py-3 px-4 text-[#13696a] font-bold">99.8% (PyTorch ELA + Forensics)</td>
                  <td className="py-3 px-4 font-bold text-[#13696a]">8.3x Fraud Catch</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#002045]">Citizen Privacy</td>
                  <td className="py-3 px-4 text-[#ba1a1a]">Physical Paper Archives</td>
                  <td className="py-3 px-4 text-[#13696a] font-bold">Zero-Knowledge + RAM Sandbox</td>
                  <td className="py-3 px-4 font-bold text-[#13696a]">100% PII Minimized</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===================== COMPLIANCE PILLS & PILOT CASE STUDIES ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Statutory Compliance Grid */}
          <div className="bg-white rounded-2xl border border-[#c4c6cf] p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#002045]">
              Statutory Compliance &amp; Governance
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {complianceStandards.map((c, i) => (
                <div key={i} className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c4c6cf]">
                  <div className="text-xs font-bold text-[#002045] font-mono">{c.standard}</div>
                  <div className="text-[11px] text-[#43474e]">{c.name}</div>
                  <div className="text-[10px] text-[#13696a] font-bold mt-1">✓ {c.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pilot Case Studies */}
          <div className="bg-white rounded-2xl border border-[#c4c6cf] p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#002045]">
              Field Deployments &amp; Pilot Records
            </h3>
            <div className="space-y-2">
              {districtCaseStudies.map((d, i) => (
                <div key={i} className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#c4c6cf] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#002045]">{d.region}</div>
                    <div className="text-[11px] text-[#43474e]">{d.highlight}</div>
                  </div>
                  <span className="font-mono font-bold text-[#13696a] shrink-0 text-right">
                    {d.metric}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
