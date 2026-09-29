import React from 'react';
import { ViewMode, Application } from '../../types';
import { CitizenApplicationSection } from '../CitizenApplicationSection';
import { ArrowLeft, ShieldCheck, Sparkles, CheckCircle2, Lock, Zap } from 'lucide-react';

interface CitizenApplicationPageProps {
  onNavigate: (view: ViewMode) => void;
  onApplicationCreated?: (app: Application) => void;
  onSelectApplicationForReview?: (appId: string) => void;
}

export const CitizenApplicationPage: React.FC<CitizenApplicationPageProps> = ({
  onNavigate,
  onApplicationCreated,
  onSelectApplicationForReview
}) => {
  return (
    <div className="w-full pb-20 animate-in fade-in duration-300 bg-[#f8f9ff]">
      
      {/* Top Breadcrumb & Status Bar */}
      <div className="bg-[#eff4ff] border-b border-[#c4c6cf]/60 py-3.5 px-6">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between text-sm text-[#43474e] gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('platform')}
              className="text-[#002045] font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>
            <span>/</span>
            <span className="font-bold text-[#002045]">Citizen Application &amp; Verification Portal</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[#13696a] font-bold text-xs sm:text-sm">
              Gemini 3.8 Flash Vision Active • &lt; 1.85s SLA
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* The Complete Citizen Application Section */}
        <CitizenApplicationSection
          onNavigate={onNavigate}
          onApplicationCreated={onApplicationCreated}
          onSelectApplicationForReview={onSelectApplicationForReview}
        />

        {/* Institutional Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
          <div className="bg-white p-6 rounded-2xl border border-[#c4c6cf] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#002045] flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#13696a]" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-[#002045]">Sub-2s Real-Time Verification</div>
              <p className="text-xs sm:text-sm text-[#43474e] mt-1">Automated clearance without bureaucratic queuing delays.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c4c6cf] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#002045] flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-[#13696a]" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-[#002045]">Zero-Knowledge Data Privacy</div>
              <p className="text-xs sm:text-sm text-[#43474e] mt-1">Documents purged from memory immediately post-hash verification.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c4c6cf] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#002045] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#13696a]" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-[#002045]">SHA-256 Legal Admissibility</div>
              <p className="text-xs sm:text-sm text-[#43474e] mt-1">Permanent tamper-evident cryptographic state ledger block.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
