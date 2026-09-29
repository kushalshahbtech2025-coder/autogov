import React from 'react';
import { ViewMode } from '../types';
import { ShieldCheck, UserCheck, Shield, Menu, X, Code2, Home } from 'lucide-react';

interface HeaderNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  pendingReviewsCount?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  onNavigate,
  pendingReviewsCount = 1,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const pages = [
    { id: 'platform' as ViewMode,    label: 'Home',              icon: Home     },
    { id: 'citizen' as ViewMode,     label: 'Submit Application', icon: undefined },
    { id: 'how-it-works' as ViewMode,label: 'How It Works',      icon: undefined },
    { id: 'tech-stack' as ViewMode,  label: 'Tech Stack & AI',   icon: Code2    },
    { id: 'impact' as ViewMode,      label: 'Impact & Security',  icon: undefined },
  ];

  const handlePageClick = (pageId: ViewMode) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 h-16"
      style={{
        background: 'rgba(0, 8, 24, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(165, 239, 240, 0.12)',
        boxShadow: '0 4px 32px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => handlePageClick('platform')}
            className="flex items-center gap-2.5 text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity text-left cursor-pointer"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #002045 0%, #13696a 100%)',
                border: '1px solid rgba(165,239,240,0.35)',
                boxShadow: '0 0 12px rgba(165,239,240,0.20)',
              }}
            >
              AG+
            </div>
            <span
              className="hidden sm:inline text-white algerian-header italic"
            >
              AutoGov<span style={{ color: '#a5eff0' }}>+</span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {pages.map((pg) => {
              const isActive = currentView === pg.id;
              const Icon = pg.icon;
              return (
                <button
                  key={pg.id}
                  onClick={() => handlePageClick(pg.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5"
                  style={{
                    background: isActive ? 'rgba(165,239,240,0.15)' : 'transparent',
                    color: isActive ? '#a5eff0' : 'rgba(255,255,255,0.60)',
                    border: isActive ? '1px solid rgba(165,239,240,0.30)' : '1px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.60)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }
                  }}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{pg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Citizen Demo */}
          <button
            onClick={() => handlePageClick('citizen')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              background: currentView === 'citizen' ? 'rgba(165,239,240,0.20)' : 'transparent',
              border: '1px solid rgba(165,239,240,0.40)',
              color: '#a5eff0',
            }}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Citizen Demo</span>
          </button>

          {/* Officer Cockpit */}
          <button
            onClick={() => handlePageClick('officer_review')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            style={{
              background: currentView.startsWith('officer')
                ? 'rgba(165,239,240,0.25)'
                : 'rgba(0,32,69,0.80)',
              border: '1px solid rgba(165,239,240,0.30)',
              color: '#ffffff',
              boxShadow: '0 2px 12px rgba(0,32,69,0.40)',
            }}
          >
            <Shield className="w-3.5 h-3.5 text-[#a5eff0]" />
            <span>Officer Cockpit</span>
            {pendingReviewsCount > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse ml-0.5"
                style={{ background: '#ff6b6b', color: '#fff' }}
              >
                {pendingReviewsCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden px-6 py-4 flex flex-col gap-2"
          style={{
            background: 'rgba(0,8,24,0.97)',
            borderBottom: '1px solid rgba(165,239,240,0.12)',
          }}
        >
          <div
            className="text-[10px] font-bold uppercase tracking-wider pb-1"
            style={{ color: 'rgba(165,239,240,0.45)', borderBottom: '1px solid rgba(165,239,240,0.10)' }}
          >
            Navigation
          </div>
          {pages.map((pg) => {
            const Icon = pg.icon;
            return (
              <button
                key={pg.id}
                onClick={() => handlePageClick(pg.id)}
                className="text-left py-2 px-3 rounded-lg font-medium text-xs flex items-center gap-2 cursor-pointer transition-all"
                style={{
                  background: currentView === pg.id ? 'rgba(165,239,240,0.15)' : 'transparent',
                  color: currentView === pg.id ? '#a5eff0' : 'rgba(255,255,255,0.65)',
                  border: currentView === pg.id ? '1px solid rgba(165,239,240,0.25)' : '1px solid transparent',
                }}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{pg.label}</span>
              </button>
            );
          })}
          <div className="pt-2 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(165,239,240,0.10)' }}>
            <button
              onClick={() => handlePageClick('citizen')}
              className="w-full py-2 rounded-lg text-xs font-semibold text-center cursor-pointer"
              style={{ border: '1px solid rgba(165,239,240,0.40)', color: '#a5eff0' }}
            >
              Citizen Portal Demo
            </button>
            <button
              onClick={() => handlePageClick('officer_review')}
              className="w-full py-2 rounded-lg font-semibold text-xs text-center cursor-pointer"
              style={{ background: 'rgba(0,32,69,0.80)', color: '#fff', border: '1px solid rgba(165,239,240,0.20)' }}
            >
              Officer Portal
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
