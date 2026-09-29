import React, { useState } from 'react';
import { ViewMode } from '../../types';
import {
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Info,
  Layers,
  BarChart3,
  Lock,
  FileText,
  Zap,
  Check,
  X,
} from 'lucide-react';

interface PlatformOverviewPageProps {
  onNavigate: (view: ViewMode) => void;
  onApplicationCreated?: (app: any) => void;
  onSelectApplicationForReview?: (id: string) => void;
}

const NAV_SECTIONS: {
  icon: React.ElementType;
  label: string;
  desc: string;
  bullets: string[];
  view: ViewMode;
  accent: string;
  bg: string;
}[] = [
  {
    icon: UserCheck,
    label: 'Submit Application',
    desc: 'Citizens can upload documents and track verification status.',
    bullets: ['Upload ID & income proof', 'Real-time AI scan', 'Instant status updates'],
    view: 'citizen',
    accent: '#f8bc4b',
    bg: 'rgba(73,49,0,0.95)',
  },
  {
    icon: Info,
    label: 'How It Works',
    desc: 'Step-by-step walkthrough of the 6-stage AI pipeline.',
    bullets: ['OCR extraction', 'Forgery detection', 'Risk scoring'],
    view: 'how-it-works',
    accent: '#adc7f7',
    bg: 'rgba(26,54,93,0.95)',
  },
  {
    icon: Layers,
    label: 'Tech Stack & AI',
    desc: 'The models, infra, and architecture powering AutoGov+.',
    bullets: ['GovDoc-OCR Vision', 'FraudNet-v4', 'XGBoost Risk Matrix'],
    view: 'tech-stack',
    accent: '#a5eff0',
    bg: 'rgba(0,79,80,0.95)',
  },
  {
    icon: BarChart3,
    label: 'Impact Metrics',
    desc: 'Projected efficiency gains from the pilot deployment.',
    bullets: ['90% reduction in wait time', '83% less officer time per file', '>99.5% compliance accuracy'],
    view: 'impact',
    accent: '#f8bc4b',
    bg: 'rgba(73,49,0,0.95)',
  },
  {
    icon: Lock,
    label: 'Security & Compliance',
    desc: 'Zero-trust architecture with full audit trail.',
    bullets: ['Zero-knowledge verification', 'SHAP audit vectors', 'No raw PII stored'],
    view: 'security',
    accent: '#adc7f7',
    bg: 'rgba(26,54,93,0.95)',
  },
  {
    icon: ShieldCheck,
    label: 'Officer Cockpit',
    desc: 'Live dashboard for reviewing flagged applications.',
    bullets: ['Case review queue', 'Approve / reject with notes', 'Full audit log'],
    view: 'officer_review',
    accent: '#fca5a5',
    bg: 'rgba(120,10,10,0.95)',
  },
  {
    icon: FileText,
    label: 'Citizen Demo',
    desc: 'Try the full submission flow with sample documents.',
    bullets: ['Upload sample affidavit', 'Watch AI process live', 'See clearance result'],
    view: 'citizen',
    accent: '#86efac',
    bg: 'rgba(19,105,106,0.95)',
  },
];

const TRUST_BADGES = [
  { icon: Check, text: 'Zero-Trust Architecture' },
  { icon: Check, text: 'SHAP Explainable ML' },
  { icon: Zap,   text: '99.8% Accuracy' },
  { icon: Check, text: 'Gov Cloud Compliant' },
];

const STATS = [
  { value: '4.3M+', label: 'Verifications' },
  { value: '1.4s',  label: 'Avg Latency' },
  { value: '90%',   label: 'Time Saved' },
];

export const PlatformOverviewPage: React.FC<PlatformOverviewPageProps> = ({ onNavigate }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handleProceed = (targetView: ViewMode = 'citizen') => {
    onNavigate(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeItem = activeIdx !== null ? NAV_SECTIONS[activeIdx] : null;

  return (
    <div className="relative w-full h-screen min-h-[640px] overflow-hidden">

      {/* ============================================================
          BACKGROUND
      ============================================================ */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: "url('/parliament_new.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          imageRendering: '-webkit-optimize-contrast',
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,12,36,0.38) 0%, rgba(0,12,36,0.25) 40%, rgba(0,12,36,0.62) 100%)',
        }}
      />

      {/* ============================================================
          LEFT ICON SIDEBAR — collapsed, icons only
      ============================================================ */}
      <div
        className="absolute top-0 left-0 h-full z-40 flex flex-col items-center justify-center gap-2 py-6"
        style={{
          width: '64px',
          background: 'rgba(0,8,24,0.70)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderRight: '1px solid rgba(165,239,240,0.10)',
        }}
      >
        {/* AG+ logo at top */}
        <div
          className="absolute top-4 w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md"
          style={{ background: '#002045', border: '1px solid rgba(165,239,240,0.3)', letterSpacing: '-0.02em' }}
        >
          AG+
        </div>

        {NAV_SECTIONS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeIdx === idx;
          return (
            <button
              key={item.label}
              id={`sidebar-icon-${idx}`}
              onClick={() => setActiveIdx(isActive ? null : idx)}
              title={item.label}
              className="relative w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: isActive ? item.bg : 'rgba(255,255,255,0.07)',
                border: `1.5px solid ${isActive ? item.accent : 'rgba(255,255,255,0.12)'}`,
                boxShadow: isActive ? `0 0 16px ${item.accent}55` : 'none',
              }}
            >
              <Icon style={{ color: isActive ? item.accent : 'rgba(255,255,255,0.55)', width: '16px', height: '16px' }} />
              {/* Active dot */}
              {isActive && (
                <span
                  className="absolute -right-1 -top-1 w-2 h-2 rounded-full"
                  style={{ background: item.accent }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================
          FLYOUT POPUP — slides in from left sidebar when icon clicked
      ============================================================ */}
      {activeItem && (
        <div
          className="absolute top-0 z-30 h-full flex flex-col justify-center py-10 px-5"
          style={{
            left: '64px',
            width: '280px',
            background: activeItem.bg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: `1px solid ${activeItem.accent}30`,
            animation: 'slideInFlyout 0.22s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Close */}
          <button
            onClick={() => setActiveIdx(null)}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <X style={{ color: activeItem.accent, width: '13px', height: '13px' }} />
          </button>

          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${activeItem.accent}20`, border: `1.5px solid ${activeItem.accent}50` }}
            >
              <activeItem.icon style={{ color: activeItem.accent, width: '20px', height: '20px' }} />
            </div>
            <h2
              className="text-base font-bold text-white leading-snug"
              style={{ fontFamily: "'Segoe UI', sans-serif", textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            >
              {activeItem.label}
            </h2>
          </div>

          {/* Description */}
          <p className="text-sm text-white/70 mb-5 leading-relaxed">
            {activeItem.desc}
          </p>

          {/* Bullets */}
          <ul className="space-y-2 mb-7">
            {activeItem.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-white/85">
                <span
                  className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: activeItem.accent }}
                />
                {b}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            id={`flyout-go-${activeItem.view}`}
            onClick={() => handleProceed(activeItem.view)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: activeItem.accent,
              color: '#001020',
              fontFamily: "'Segoe UI', sans-serif",
              boxShadow: `0 6px 24px ${activeItem.accent}55`,
            }}
          >
            Open {activeItem.label}
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </button>
        </div>
      )}

      {/* ============================================================
          CENTRE — Hero content
      ============================================================ */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center transition-all duration-300"
        style={{ paddingLeft: activeItem ? '344px' : '64px', paddingRight: '24px' }}
      >
        {/* Live badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{ background: 'rgba(165,239,240,0.13)', border: '1px solid rgba(165,239,240,0.45)' }}
        >
          <span className="w-2 h-2 rounded-full bg-[#a5eff0] animate-ping flex-shrink-0" />
          <span className="text-[#a5eff0] text-xs font-semibold tracking-widest uppercase">
            AutoGov+ · Production Pilot Active
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white mb-4 leading-tight"
          style={{
            fontFamily: "'Calibri', 'Segoe UI', sans-serif",
            textShadow: '0 4px 28px rgba(0,0,0,0.65)',
            letterSpacing: '-0.01em',
          }}
        >
          Automating Trust in
          <br />
          <span style={{ color: '#a5eff0' }}>Public Services</span>
        </h1>

        {/* Subheading */}
        <p
          className="text-base sm:text-lg text-white/80 max-w-lg mb-7 leading-relaxed"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
        >
          AI-driven document verification that accelerates citizen services —
          maintaining absolute institutional integrity and compliance.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {TRUST_BADGES.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/90"
              style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.22)' }}
            >
              <Icon className="w-3.5 h-3.5 text-[#a5eff0]" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            id="hero-btn-officer"
            onClick={() => handleProceed('officer_review')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'rgba(0,32,69,0.92)',
              border: '1.5px solid rgba(165,239,240,0.65)',
              color: '#fff',
              boxShadow: '0 8px 28px rgba(0,32,69,0.55)',
              fontFamily: "'Calibri', 'Segoe UI', sans-serif",
            }}
          >
            <ShieldCheck className="w-4 h-4 text-[#a5eff0]" />
            Officer Dashboard
            <ArrowRight className="w-4 h-4 text-[#a5eff0]" />
          </button>

          <button
            id="hero-btn-citizen"
            onClick={() => handleProceed('citizen')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #13696a 0%, #002045 100%)',
              border: '1.5px solid #f8bc4b',
              color: '#fff',
              boxShadow: '0 8px 28px rgba(19,105,106,0.50)',
              fontFamily: "'Calibri', 'Segoe UI', sans-serif",
            }}
          >
            <UserCheck className="w-4 h-4 text-[#f8bc4b]" />
            Try Citizen Demo
            <ArrowRight className="w-4 h-4 text-[#f8bc4b]" />
          </button>
        </div>

        {/* Stats */}
        <div
          className="flex flex-wrap items-center justify-center gap-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem' }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-2xl font-bold text-[#a5eff0]"
                style={{ fontFamily: "'Calibri', 'Segoe UI', sans-serif", textShadow: '0 2px 8px rgba(0,0,0,0.45)' }}
              >
                {value}
              </div>
              <div className="text-xs text-white/55 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Flyout slide-in animation */}
      <style>{`
        @keyframes slideInFlyout {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
