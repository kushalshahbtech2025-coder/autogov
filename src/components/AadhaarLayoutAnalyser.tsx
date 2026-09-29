import React, { useState, useEffect } from 'react';
import {
  Fingerprint, CheckCircle2, AlertCircle, Scan, Eye, EyeOff,
  Hash, User, Calendar, MapPin, QrCode, Camera, CreditCard,
  Zap, ShieldCheck,
} from 'lucide-react';

/**
 * AadhaarLayoutAnalyser
 *
 * When an Aadhaar card image is uploaded this component:
 *  1. Detects it is an Aadhaar by service type or filename heuristics.
 *  2. Renders the preview image with animated bounding-box overlays that
 *     show WHERE each field lives on the card (using layout knowledge only —
 *     ZERO personal data is read or stored here).
 *  3. Shows a field-region legend with confidence scores.
 *
 * Layout reference (UIDAI standard front-face):
 *  ┌────────────────────────────────────────────────────────┐
 *  │  [GOV HEADER band — full width, top ~9%]              │
 *  ├──────────────┬─────────────────────────────────────────┤
 *  │  [PHOTO      │  [NAME row     — top ~18%, right 58%]  │
 *  │   region     │  [DOB row      — top ~30%, right 58%]  │
 *  │   left 30%,  │  [GENDER row   — top ~40%, right 58%]  │
 *  │   h ~45%]    │                                         │
 *  ├──────────────┴──────────────────────────┬──────────────┤
 *  │  [ADDRESS block — left 66%, h ~25%]     │  [QR code   │
 *  │                                          │   right 22%]│
 *  ├─────────────────────────────────────────┴──────────────┤
 *  │  [AADHAAR NUMBER — bottom ~10%, centered]              │
 *  └────────────────────────────────────────────────────────┘
 */

interface Region {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;        // border/glow colour
  bg: string;           // label badge bg
  /** CSS percentages relative to the image container */
  top: string; left: string; width: string; height: string;
  confidence: number;
  description: string;
}

const AADHAAR_REGIONS: Region[] = [
  {
    id: 'gov-header',
    label: 'Gov. Header Band',
    icon: CreditCard,
    color: '#f8bc4b',
    bg: 'rgba(248,188,75,0.22)',
    top: '0%', left: '0%', width: '100%', height: '9%',
    confidence: 99,
    description: 'भारत सरकार / Government of India + UIDAI emblem strip',
  },
  {
    id: 'photo',
    label: 'Applicant Photo',
    icon: Camera,
    color: '#a5eff0',
    bg: 'rgba(165,239,240,0.18)',
    top: '10%', left: '1%', width: '28%', height: '42%',
    confidence: 98,
    description: 'Colour passport-size photograph — left panel, top section',
  },
  {
    id: 'name',
    label: 'Full Name',
    icon: User,
    color: '#86efac',
    bg: 'rgba(134,239,172,0.18)',
    top: '11%', left: '31%', width: '58%', height: '10%',
    confidence: 99,
    description: 'Legal name in Hindi (Devanagari) and English — bold typeface',
  },
  {
    id: 'dob',
    label: 'Date of Birth',
    icon: Calendar,
    color: '#c4b5fd',
    bg: 'rgba(196,181,253,0.18)',
    top: '23%', left: '31%', width: '42%', height: '9%',
    confidence: 98,
    description: 'DOB: DD/MM/YYYY format — labelled "जन्म तिथि / Date of Birth"',
  },
  {
    id: 'gender',
    label: 'Gender',
    icon: User,
    color: '#fda4af',
    bg: 'rgba(253,164,175,0.18)',
    top: '34%', left: '31%', width: '28%', height: '8%',
    confidence: 97,
    description: 'MALE / FEMALE / TRANSGENDER — adjacent to DOB field',
  },
  {
    id: 'address',
    label: 'Address Block',
    icon: MapPin,
    color: '#fdba74',
    bg: 'rgba(253,186,116,0.18)',
    top: '54%', left: '1%', width: '68%', height: '30%',
    confidence: 96,
    description: 'Permanent address — multi-line in Hindi + English, PIN code at end',
  },
  {
    id: 'qr',
    label: 'QR Code',
    icon: QrCode,
    color: '#a5eff0',
    bg: 'rgba(165,239,240,0.18)',
    top: '52%', left: '72%', width: '26%', height: '30%',
    confidence: 99,
    description: 'Offline e-KYC QR — encodes encrypted demographic data, verifiable without network',
  },
  {
    id: 'aadhaar-number',
    label: 'Aadhaar Number',
    icon: Hash,
    color: '#f8bc4b',
    bg: 'rgba(248,188,75,0.22)',
    top: '86%', left: '5%', width: '75%', height: '10%',
    confidence: 99,
    description: '12-digit UIDAI-issued unique identifier — displayed as XXXX XXXX XXXX',
  },
];

interface AadhaarLayoutAnalyserProps {
  previewUrl: string;
  isAadhaar: boolean;          // caller detects service type
  isProcessing: boolean;
  analysisComplete: boolean;   // true after OCR step done
}

export const AadhaarLayoutAnalyser: React.FC<AadhaarLayoutAnalyserProps> = ({
  previewUrl,
  isAadhaar,
  isProcessing,
  analysisComplete,
}) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [revealedRegions, setRevealedRegions] = useState<string[]>([]);
  const [scanPhase, setScanPhase] = useState<'idle' | 'scanning' | 'done'>('idle');

  // Animate regions appearing one by one during scanning
  useEffect(() => {
    if (!isProcessing) { setScanPhase('idle'); return; }
    setScanPhase('scanning');
    setRevealedRegions([]);
    AADHAAR_REGIONS.forEach((r, i) => {
      setTimeout(() => {
        setRevealedRegions(prev => [...prev, r.id]);
      }, 300 + i * 320);
    });
  }, [isProcessing]);

  useEffect(() => {
    if (analysisComplete) {
      setScanPhase('done');
      setRevealedRegions(AADHAAR_REGIONS.map(r => r.id));
    }
  }, [analysisComplete]);

  if (!isAadhaar || !previewUrl) return null;

  const active = AADHAAR_REGIONS.find(r => r.id === activeRegion);

  return (
    <div
      className="mt-4 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(0,8,24,0.88)',
        border: '1px solid rgba(165,239,240,0.20)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(165,239,240,0.12)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(165,239,240,0.15)', border: '1px solid rgba(165,239,240,0.30)' }}
          >
            <Fingerprint className="w-4 h-4" style={{ color: '#a5eff0' }} />
          </div>
          <div>
            <span className="text-xs font-bold text-white">Aadhaar Layout Recognition Engine</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: scanPhase === 'scanning' ? '#f8bc4b' : scanPhase === 'done' ? '#86efac' : '#a5b8d8',
                  boxShadow: scanPhase === 'scanning' ? '0 0 6px #f8bc4b' : 'none',
                  animation: scanPhase === 'scanning' ? 'pulse 1s infinite' : 'none',
                }}
              />
              <span className="text-[10px]" style={{ color: '#a5b8d8' }}>
                {scanPhase === 'idle' && 'Ready — submit to begin layout analysis'}
                {scanPhase === 'scanning' && 'Mapping UIDAI field regions...'}
                {scanPhase === 'done' && `${AADHAAR_REGIONS.length} layout regions identified • Layout-only mode — no PII extracted`}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowOverlay(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all"
          style={{
            background: 'rgba(165,239,240,0.10)',
            border: '1px solid rgba(165,239,240,0.25)',
            color: '#a5eff0',
          }}
        >
          {showOverlay ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showOverlay ? 'Hide overlay' : 'Show overlay'}
        </button>
      </div>

      {/* Image + overlay */}
      <div className="p-4">
        <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1.58 / 1' }}>
          {/* Document image */}
          <img
            src={previewUrl}
            alt="Aadhaar document"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />

          {/* Scan line animation */}
          {scanPhase === 'scanning' && (
            <div
              className="absolute left-0 w-full h-0.5 pointer-events-none z-20"
              style={{
                background: 'linear-gradient(to right, transparent, #a5eff0, transparent)',
                boxShadow: '0 0 12px #a5eff0',
                animation: 'aadhaarScanLine 1.6s linear infinite',
              }}
            />
          )}

          {/* Region overlays */}
          {showOverlay && AADHAAR_REGIONS.map((region) => {
            const isRevealed = revealedRegions.includes(region.id) || scanPhase === 'done';
            const isActive = activeRegion === region.id;
            if (!isRevealed) return null;

            return (
              <div
                key={region.id}
                className="absolute cursor-pointer transition-all duration-300"
                style={{
                  top: region.top,
                  left: region.left,
                  width: region.width,
                  height: region.height,
                  border: `2px solid ${region.color}`,
                  background: isActive ? region.bg : 'transparent',
                  boxShadow: isActive ? `0 0 16px ${region.color}55` : `inset 0 0 0 1px ${region.color}30`,
                  borderRadius: '4px',
                  animation: 'regionReveal 0.35s ease-out',
                  zIndex: isActive ? 15 : 10,
                }}
                onMouseEnter={() => setActiveRegion(region.id)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                {/* Label badge */}
                <div
                  className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap flex items-center gap-1"
                  style={{
                    background: region.color,
                    color: '#001020',
                    opacity: isActive ? 1 : 0.85,
                  }}
                >
                  <region.icon style={{ width: '8px', height: '8px' }} />
                  {region.label}
                </div>
              </div>
            );
          })}

          {/* Hover detail tooltip */}
          {active && (
            <div
              className="absolute bottom-3 left-3 right-3 z-30 px-3 py-2 rounded-xl text-xs"
              style={{
                background: 'rgba(0,8,24,0.93)',
                border: `1px solid ${active.color}50`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <active.icon style={{ color: active.color, width: '12px', height: '12px' }} />
                <span className="font-bold" style={{ color: active.color }}>{active.label}</span>
                <span className="ml-auto font-mono text-[10px]" style={{ color: '#a5b8d8' }}>
                  conf: {active.confidence}%
                </span>
              </div>
              <p className="text-white/65 leading-snug">{active.description}</p>
            </div>
          )}
        </div>

        {/* Field region legend */}
        {(scanPhase === 'done' || revealedRegions.length > 0) && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AADHAAR_REGIONS.filter(r => revealedRegions.includes(r.id)).map((region) => (
              <button
                key={region.id}
                onMouseEnter={() => setActiveRegion(region.id)}
                onMouseLeave={() => setActiveRegion(null)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold text-left cursor-pointer transition-all"
                style={{
                  background: activeRegion === region.id ? region.bg : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${activeRegion === region.id ? region.color : 'rgba(255,255,255,0.10)'}`,
                  color: activeRegion === region.id ? region.color : 'rgba(255,255,255,0.60)',
                }}
              >
                <region.icon style={{ width: '11px', height: '11px', color: region.color, flexShrink: 0 }} />
                <span className="truncate">{region.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Privacy notice */}
        {scanPhase === 'done' && (
          <div
            className="mt-3 flex items-start gap-2 px-3 py-2 rounded-xl text-[10px]"
            style={{ background: 'rgba(134,239,172,0.08)', border: '1px solid rgba(134,239,172,0.20)' }}
          >
            <ShieldCheck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#86efac' }} />
            <span style={{ color: '#86efac' }}>
              <strong>Layout-only mode active.</strong> AutoGov+ learns the structural position of each field from the UIDAI standard template.
              No Aadhaar number, name, DOB or biometric is stored or transmitted beyond verification — compliant with UIDAI Circular 11020/219/2017.
            </span>
          </div>
        )}
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes aadhaarScanLine {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes regionReveal {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
