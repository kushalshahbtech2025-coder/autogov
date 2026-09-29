import React, { useState } from 'react';
import { Shield, Info, X, Palette, ArrowRight } from 'lucide-react';
import { ViewMode } from '../types';

interface FooterProps {
  onNavigate?: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [modalTopic, setModalTopic] = useState<string | null>(null);

  const topicPages: { id: ViewMode; label: string }[] = [
    { id: 'platform', label: 'Platform Overview' },
    { id: 'citizen', label: 'Submit Citizen Application' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'tech-stack', label: 'Tech Stack & AI Engine' },
    { id: 'impact', label: 'Impact & Security' },
  ];

  return (
    <>
      <footer
        className="w-full py-12 px-6 mt-auto text-white"
        style={{
          background: 'rgba(0,6,16,0.97)',
          borderTop: '1px solid rgba(165,239,240,0.12)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-8"
          style={{ borderBottom: '1px solid rgba(165,239,240,0.10)' }}
        >
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-base font-bold text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#13696a] text-white flex items-center justify-center font-black text-xs">
                AG+
              </div>
              <span>AutoGov+ Intelligence Systems</span>
            </div>
            <p className="text-xs text-[#adc7f7] leading-relaxed max-w-sm">
              Sovereign AI-driven public service verification and fraud prevention platform automating trust in municipal and civil administration.
            </p>
            <div className="text-[11px] text-[#86a0cd] pt-1">
              Production Pilot Infrastructure v4.2 • ISO/IEC 42001
            </div>
          </div>

          {/* Quick Page Links */}
          <div className="md:col-span-5 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#a5eff0]">
              Dedicated Topic Pages
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {topicPages.map((pg) => (
                <button
                  key={pg.id}
                  onClick={() => onNavigate?.(pg.id)}
                  className="text-left text-[#adc7f7] hover:text-white transition-colors cursor-pointer py-1 flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-[#13696a]" />
                  <span>{pg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions & Regulatory */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#a5eff0]">
              Portals & Governance
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate?.('citizen')}
                className="w-full py-2 px-3 bg-[#1a365d] hover:bg-[#2d476f] text-[#a5eff0] text-xs font-semibold rounded transition-colors text-left flex items-center justify-between"
              >
                <span>Citizen Verification Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate?.('officer_review')}
                className="w-full py-2 px-3 bg-[#a2eded] text-[#002020] text-xs font-bold rounded hover:bg-[#89d3d4] transition-colors text-left flex items-center justify-between"
              >
                <span>Officer Cockpit (Alpha-04)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Legal bar */}
        <div className="max-w-[1440px] mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#86a0cd] gap-4">
          <div>
            © 2026 AutoGov+ Sovereign Public Systems. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setModalTopic('Dept of IT')}
              className="hover:text-[#a5eff0] transition-colors cursor-pointer"
            >
              Dept of IT Architecture
            </button>
            <button 
              onClick={() => setModalTopic('Privacy Policy')}
              className="hover:text-[#a5eff0] transition-colors cursor-pointer"
            >
              Zero-Knowledge Privacy Policy
            </button>
            <button 
              onClick={() => setModalTopic('Target Impact Disclaimer')}
              className="hover:text-[#a5eff0] transition-colors cursor-pointer"
            >
              Pilot SLA Disclaimers
            </button>
          </div>
        </div>
      </footer>

      {/* Institutional Info Modal */}
      {modalTopic && (
        <div className="fixed inset-0 bg-[#002045]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-[#0d1c2e] rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#c4c6cf] animate-in fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-[#c4c6cf] pb-3">
              <h3 className="text-lg font-bold text-[#002045] flex items-center gap-2">
                <Info className="w-5 h-5 text-[#13696a]" />
                <span>{modalTopic}</span>
              </h3>
              <button 
                onClick={() => setModalTopic(null)}
                className="p-1 rounded hover:bg-slate-100 text-[#74777f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#43474e] space-y-3 leading-relaxed">
              {modalTopic === 'Dept of IT' && (
                <p>AutoGov+ is deployed under the National E-Governance Architecture guidelines. All algorithmic models adhere to ISO/IEC 42001 AI Management and Federal Zero-Trust standards.</p>
              )}
              {modalTopic === 'Privacy Policy' && (
                <p>Zero-Knowledge ingestion: Document images are hashed, stripped of non-statutory metadata, and processed strictly in ephemeral memory boundaries.</p>
              )}
              {modalTopic === 'Target Impact Disclaimer' && (
                <p>Target impact parameters (&lt;48 hour turnaround, ~90% reduction, &gt;99.5% accuracy) are based on the AutoGov+ pilot project baseline simulations across 4.3M historical files.</p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalTopic(null)}
                className="px-4 py-2 bg-[#002045] text-white text-xs font-semibold rounded hover:bg-[#1a365d]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

