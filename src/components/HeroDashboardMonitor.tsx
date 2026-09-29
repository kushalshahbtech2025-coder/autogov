import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Users, 
  FileText, 
  BarChart2, 
  Layers, 
  Shield, 
  Cpu, 
  Check, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { ViewMode } from '../types';

interface HeroDashboardMonitorProps {
  onNavigate?: (view: ViewMode) => void;
}

export const HeroDashboardMonitor: React.FC<HeroDashboardMonitorProps> = ({ onNavigate }) => {
  const [liveClock, setLiveClock] = useState<string>('');
  const [pulseCount, setPulseCount] = useState<number>(4350129);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between rounded-2xl overflow-hidden border border-[#002045]/20 bg-[#071326] shadow-2xl group select-none">
      {/* Sleek Glossy Monitor Bezel Bar */}
      <div className="bg-[#030a14] px-4 py-2 flex items-center justify-between border-b border-white/10 text-white text-[11px] shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="ml-2 font-mono font-bold text-slate-300 text-[10px] tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SOVEREIGN GOV CLOUD • NODE #14-PUNE
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
          <span>LATENCY: <strong>1.4ms</strong></span>
          <span className="text-[#a5eff0] font-bold">{liveClock || '15:30:00'}</span>
        </div>
      </div>

      {/* Main Crisp High-Definition Dashboard Surface */}
      <div className="p-3 sm:p-4 bg-[#f8faff] text-[#002045] flex-1 flex flex-col overflow-hidden text-xs">
        
        {/* Top App Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#002045] text-white flex items-center justify-center font-black text-xs shadow-sm">
              A+
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#002045] leading-tight flex items-center gap-1.5">
                <span>AutoGov+</span>
                <span className="text-[10px] font-normal text-slate-500">| Intelligent e-Governance</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              SYS HEALTH: 99.98%
            </span>
            <div className="text-[10px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 font-medium">
              Officer: <strong>J. Smith (#402)</strong>
            </div>
          </div>
        </div>

        {/* 4 Stat Metrics Grid (Crystal Clear Typography) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5 shrink-0">
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium truncate">Total Citizens Registered</div>
            <div className="text-sm font-bold text-[#002045] font-mono mt-0.5">
              {pulseCount.toLocaleString()}
            </div>
            <div className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <span>↑ +18.4% YoY</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium truncate">Pending Ingest Queue</div>
            <div className="text-sm font-bold text-[#13696a] font-mono mt-0.5">
              189 <span className="text-[10px] font-normal text-slate-400">files</span>
            </div>
            <div className="text-[9px] text-slate-500 font-medium">Avg wait: 42s</div>
          </div>

          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium truncate">Auto-Clearance Rate</div>
            <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">
              88.4%
            </div>
            <div className="text-[9px] text-emerald-700 font-medium">Zero-touch pass</div>
          </div>

          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500 font-medium truncate">Active Gov Services</div>
            <div className="text-sm font-bold text-[#002045] font-mono mt-0.5">
              245
            </div>
            <div className="text-[9px] text-slate-500 font-medium">14 Districts live</div>
          </div>
        </div>

        {/* Center Grid: Live Table + Biometric Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 flex-1 min-h-0 overflow-hidden">
          
          {/* Live Records Table */}
          <div className="md:col-span-8 bg-white rounded-lg border border-slate-200 flex flex-col overflow-hidden shadow-xs">
            <div className="px-2.5 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[10px] font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-[#13696a]" />
                Recent Citizen Ingestion Stream
              </span>
              <span className="text-emerald-600 font-mono text-[9px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                LIVE
              </span>
            </div>

            <div className="overflow-y-auto flex-1 text-[10px] divide-y divide-slate-100">
              <div className="grid grid-cols-12 px-2.5 py-1.5 bg-slate-50/50 font-bold text-slate-500 text-[9px] uppercase">
                <div className="col-span-3">ID / Applicant</div>
                <div className="col-span-4">Service Type</div>
                <div className="col-span-3">Verification</div>
                <div className="col-span-2 text-right">Latency</div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-12 px-2.5 py-1.5 items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-3 font-semibold text-[#002045] truncate">
                  <span className="font-mono text-[9px] text-slate-400 mr-1">#1049</span>
                  Sunita Patil
                </div>
                <div className="col-span-4 text-slate-600 truncate">Income &amp; Asset Cert</div>
                <div className="col-span-3">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Auto-Cleared
                  </span>
                </div>
                <div className="col-span-2 text-right font-mono text-slate-500">1.2s</div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-12 px-2.5 py-1.5 items-center bg-amber-50/40 hover:bg-amber-50 transition-colors">
                <div className="col-span-3 font-semibold text-[#002045] truncate">
                  <span className="font-mono text-[9px] text-slate-400 mr-1">#1051</span>
                  Rajesh Kumar
                </div>
                <div className="col-span-4 text-slate-600 truncate">Domicile Verification</div>
                <div className="col-span-3">
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[9px] inline-flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5 text-amber-700" /> Review Flag (78)
                  </span>
                </div>
                <div className="col-span-2 text-right font-mono text-amber-800 font-bold">Queue</div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-12 px-2.5 py-1.5 items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-3 font-semibold text-[#002045] truncate">
                  <span className="font-mono text-[9px] text-slate-400 mr-1">#1052</span>
                  Ananya Deshmukh
                </div>
                <div className="col-span-4 text-slate-600 truncate">Caste Validity Cert</div>
                <div className="col-span-3">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Auto-Cleared
                  </span>
                </div>
                <div className="col-span-2 text-right font-mono text-slate-500">1.4s</div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-12 px-2.5 py-1.5 items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-3 font-semibold text-[#002045] truncate">
                  <span className="font-mono text-[9px] text-slate-400 mr-1">#1053</span>
                  Farhan Khan
                </div>
                <div className="col-span-4 text-slate-600 truncate">Trade &amp; Shop License</div>
                <div className="col-span-3">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Auto-Cleared
                  </span>
                </div>
                <div className="col-span-2 text-right font-mono text-slate-500">0.9s</div>
              </div>
            </div>
          </div>

          {/* Right Biometric & Security Widget */}
          <div className="hidden sm:flex md:col-span-4 bg-white rounded-lg border border-slate-200 p-2.5 flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-700 uppercase">Live Dossier Telemetry</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[8px] font-bold">XGBoost 2.0</span>
              </div>

              {/* Visual Biometric & Seal Verification */}
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#002045] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  SP
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-[#002045] truncate">Sunita Patil</div>
                  <div className="text-[8px] text-slate-500">UID: •••• •••• 8912</div>
                  <div className="text-[9px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <Fingerprint className="w-3 h-3" /> Biometric Match: 99.4%
                  </div>
                </div>
              </div>

              {/* Forensic Seal Check */}
              <div className="space-y-1 text-[9px]">
                <div className="flex justify-between text-slate-600">
                  <span>Stamp Forensics (CNN)</span>
                  <span className="font-bold text-emerald-600">Passed (0.04)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[96%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[9px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[#13696a] font-semibold">
                <ShieldCheck className="w-3 h-3" /> SHA-256 Ledger Sealed
              </span>
              <span className="font-mono text-[8px]">0x8F4E...0A24</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Telemetry Badge (Crisp Vector Card) */}
      <div className="p-3 sm:p-4 bg-[#002045] text-white border-t border-[#002045]/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-white">Active Clearance Telemetry</span>
          <span className="text-[10px] font-mono font-bold bg-[#a2eded] text-[#002020] px-2 py-0.5 rounded">
            4.3M Completed
          </span>
        </div>

        <div className="flex items-center gap-4 text-center sm:text-right">
          <div>
            <div className="text-[10px] text-slate-300">Avg Latency</div>
            <div className="text-xs sm:text-sm font-bold text-white font-mono">1.4s</div>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <div className="text-[10px] text-slate-300">Straight-Through</div>
            <div className="text-xs sm:text-sm font-bold text-[#a5eff0] font-mono">88.4%</div>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <div className="text-[10px] text-slate-300">Fraud Caught</div>
            <div className="text-xs sm:text-sm font-bold text-red-400 font-mono">11,842</div>
          </div>
        </div>
      </div>
    </div>
  );
};
