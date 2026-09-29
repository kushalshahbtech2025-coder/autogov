import React, { useState } from 'react';
import { ViewMode } from '../../types';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  FileKey, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  EyeOff, 
  Database, 
  Fingerprint, 
  FileText, 
  Terminal, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

interface SecurityCompliancePageProps {
  onNavigate: (view: ViewMode) => void;
}

export const SecurityCompliancePage: React.FC<SecurityCompliancePageProps> = ({ onNavigate }) => {
  // Live simulated ZK Hash verifier tool
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
    signer: 'State Digital Notary Node #04 (Root Authority)'
  });

  const securityPillars = [
    {
      icon: EyeOff,
      title: 'Zero-Knowledge Proofs (ZKP)',
      category: 'Citizen Data Minimization',
      desc: 'AutoGov+ verifies eligibility conditions (e.g. "Income < $25,000", "Resident of District 4") mathematically without transferring or persisting raw banking or identity records.',
      badge: 'Zero PII Retention'
    },
    {
      icon: Lock,
      title: 'Ephemeral Sandbox Execution',
      category: 'Memory & Ingestion Safety',
      desc: 'Citizen uploaded PDFs and images are processed inside isolated, unprivileged container sandboxes. Raster payloads are purged immediately after cryptographic hash calculation.',
      badge: '100% Volatile RAM Only'
    },
    {
      icon: Database,
      title: 'Immutable SHA-256 Ledger',
      category: 'Cryptographic Audit Integrity',
      desc: 'Every OCR token, confidence coefficient, and officer clearance signature is anchored to a write-once cryptographic ledger, ensuring non-repudiation in judicial appeals.',
      badge: 'Tamper-Evident'
    },
    {
      icon: Server,
      title: 'Sovereign GovCloud Isolation',
      category: 'Infrastructure & Hosting',
      desc: 'Air-gapped dedicated instances with hardware security modules (HSM) and FIPS 140-3 Level 4 physical protection. Data never exits national sovereign jurisdiction.',
      badge: 'FedRAMP High Equivalent'
    }
  ];

  const complianceStandards = [
    {
      standard: 'ISO/IEC 42001:2023',
      authority: 'International Organization for Standardization',
      scope: 'Artificial Intelligence Management System (AIMS) governance and risk management.',
      status: 'Fully Certified'
    },
    {
      standard: 'ISO/IEC 27001 & 27701',
      authority: 'Global Information Security Consortium',
      scope: 'Information Security Management & Privacy Information Management System.',
      status: 'Audited Annually'
    },
    {
      standard: 'GovCloud High & FedRAMP',
      authority: 'National Security Agency Standards',
      scope: 'Strict multi-tenant cryptographic isolation with TLS 1.3 quantum-resistant cipher suites.',
      status: 'Authorized'
    },
    {
      standard: 'State Data Privacy Act & GDPR',
      authority: 'Public Data Protection Authority',
      scope: 'Article 22 compliance: Right to human explanation & non-automated appeal avenues.',
      status: 'Guaranteed by Design'
    }
  ];

  return (
    <div className="w-full pb-20 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-[#eff4ff] border-b border-[#c4c6cf]/60 py-3 px-6">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-xs text-[#43474e]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#002045]">Security & Trust</span>
            <span>/</span>
            <span>Zero-Trust Architecture & Statutory Compliance</span>
          </div>
          <span className="font-mono text-[#13696a] font-bold">FIPS 140-3 Level 4 Encryption</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-10">
        
        {/* Title Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4e4fc] rounded-full border border-[#c4c6cf] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#002045]" />
            <span className="text-xs font-bold text-[#002045] uppercase tracking-wider">
              Zero-Trust Institutional Security
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002045] tracking-tight">
            Cryptographic Integrity & Public Trust
          </h1>
          <p className="text-base text-[#43474e] mt-3 leading-relaxed">
            Public institutions cannot compromise on citizen data privacy. AutoGov+ implements cryptographic zero-knowledge verification, ephemeral compute sandboxes, and immutable audit ledgers.
          </p>
        </div>

        {/* ===================== FOUR SECURITY PILLARS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {securityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-7 border border-[#c4c6cf] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#eff4ff] border border-[#c4c6cf] text-[#002045] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold font-mono bg-[#a2eded] text-[#002020] px-2.5 py-1 rounded">
                      {pillar.badge}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#13696a] uppercase tracking-wider mb-1">
                    {pillar.category}
                  </div>
                  <h3 className="text-xl font-bold text-[#002045] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#43474e] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#c4c6cf]/40 flex items-center gap-2 text-xs text-[#002045] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#13696a]" />
                  <span>Verified by State Cyber Security Directorate</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===================== LIVE CRYPTOGRAPHIC LEDGER PROOF VERIFIER ===================== */}
        <section className="bg-[#002045] text-white rounded-2xl p-8 lg:p-10 border border-[#1a365d] shadow-lg mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a365d] rounded-full text-xs font-semibold text-[#a5eff0]">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Zero-Knowledge Verification Oracle</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Verify Document Cryptographic Proof
              </h2>
              <p className="text-sm text-[#adc7f7] leading-relaxed">
                Enter or test any SHA-256 document fingerprint to instantly validate its timestamp and non-repudiable state clearance signature.
              </p>

              <div className="space-y-2 pt-2">
                <label className="text-xs text-[#86a0cd] font-semibold">
                  SHA-256 Document Fingerprint:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testHash}
                    onChange={(e) => setTestHash(e.target.value)}
                    className="w-full bg-[#09182b] border border-[#2d476f] rounded-lg px-3 py-2 text-xs font-mono text-[#a5eff0] focus:outline-none focus:border-[#a2eded]"
                    placeholder="Enter 64-char hex hash..."
                  />
                  <button
                    onClick={() => {
                      setVerifyResult({
                        valid: true,
                        blockNumber: Math.floor(190000000 + Math.random() * 9000000),
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
                        merkleRoot: '0x' + Math.random().toString(16).substring(2, 10) + '...9f',
                        signer: 'State Digital Notary Node #04 (Root Authority)'
                      });
                    }}
                    className="px-4 py-2 bg-[#a2eded] text-[#002020] text-xs font-bold rounded-lg hover:bg-[#89d3d4] transition-colors shrink-0"
                  >
                    Verify Proof
                  </button>
                </div>
              </div>
            </div>

            {/* Verification Result Card */}
            <div className="lg:col-span-6 bg-[#1a365d] rounded-xl p-6 border border-[#2d476f] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#2d476f]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2dd4bf]" />
                  <span className="text-sm font-bold text-white">VALID CRYPTOGRAPHIC RECORD</span>
                </div>
                <span className="text-[11px] bg-[#2dd4bf] text-black px-2 py-0.5 rounded font-bold">
                  IMMUTABLE
                </span>
              </div>

              {verifyResult && (
                <div className="space-y-2 text-slate-200">
                  <div className="flex justify-between">
                    <span className="text-[#86a0cd]">State Block:</span>
                    <span className="font-bold text-white">#{verifyResult.blockNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86a0cd]">Attestation Time:</span>
                    <span className="text-[#a5eff0]">{verifyResult.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86a0cd]">Merkle Root:</span>
                    <span className="text-[#f8bc4b]">{verifyResult.merkleRoot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86a0cd]">Authorized Signer:</span>
                    <span className="text-white font-sans text-xs">{verifyResult.signer}</span>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#2d476f] flex items-center justify-between font-sans">
                <span className="text-xs text-[#adc7f7]">Admissible in administrative court tribunals</span>
                <button
                  onClick={() => onNavigate('officer_review')}
                  className="text-xs text-[#a5eff0] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open Audit Log</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ===================== COMPLIANCE STANDARDS LIST ===================== */}
        <section className="mb-16">
          <div className="mb-8">
            <div className="text-xs font-bold text-[#13696a] uppercase tracking-wider mb-1">
              Certifications & Audits
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#002045]">
              Regulatory & Statutory Compliance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceStandards.map((std, sIdx) => (
              <div 
                key={sIdx}
                className="bg-white rounded-xl p-6 border border-[#c4c6cf] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#002045]">
                      {std.standard}
                    </h3>
                    <span className="text-xs font-bold text-[#13696a] bg-[#eff4ff] px-2.5 py-1 rounded border border-[#c4c6cf]/60">
                      {std.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#13696a] mb-2">
                    {std.authority}
                  </div>
                  <p className="text-xs text-[#43474e] leading-relaxed">
                    {std.scope}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
