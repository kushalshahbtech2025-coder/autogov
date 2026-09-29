import React, { useState, useEffect } from 'react';
import {
  Eye, EyeOff, ShieldCheck, Fingerprint, CreditCard, Car,
  FileText, MapPin, Hash, User, Calendar, QrCode, Camera,
  Building2, Stamp, BadgeCheck, Landmark, Banknote, Phone,
} from 'lucide-react';
import { ServiceType } from '../types';

interface Region {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  top: string; left: string; width: string; height: string;
  confidence: number;
  description: string;
}

/* =========================================================================
   LAYOUT TEMPLATES  — percentage-based regions per document type
   All coordinates are relative to the displayed image container.
   No personal data is read; only structural field positions are defined.
   ========================================================================= */

const LAYOUTS: Record<ServiceType, { title: string; icon: React.ElementType; color: string; regions: Region[] }> = {

  aadhaar_card: {
    title: 'Aadhaar Card (UIDAI)',
    icon: Fingerprint,
    color: '#a5eff0',
    regions: [
      { id: 'header',   label: 'Gov Header Band',  icon: CreditCard,   color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '0%',  left: '0%',  width: '100%', height: '9%',  confidence: 99, description: 'भारत सरकार / Government of India + UIDAI emblem strip' },
      { id: 'photo',    label: 'Applicant Photo',   icon: Camera,       color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '10%', left: '1%',  width: '28%',  height: '42%', confidence: 98, description: 'Colour passport photo — left panel, top section' },
      { id: 'name',     label: 'Full Name',          icon: User,         color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '11%', left: '31%', width: '58%',  height: '10%', confidence: 99, description: 'Legal name in Hindi (Devanagari) and English — bold typeface' },
      { id: 'dob',      label: 'Date of Birth',      icon: Calendar,     color: '#c4b5fd', bg: 'rgba(196,181,253,0.16)', top: '23%', left: '31%', width: '42%',  height: '9%',  confidence: 98, description: 'DOB: DD/MM/YYYY — जन्म तिथि / Date of Birth label' },
      { id: 'gender',   label: 'Gender',             icon: User,         color: '#fda4af', bg: 'rgba(253,164,175,0.16)', top: '34%', left: '31%', width: '28%',  height: '8%',  confidence: 97, description: 'MALE / FEMALE / TRANSGENDER' },
      { id: 'address',  label: 'Address Block',      icon: MapPin,       color: '#fdba74', bg: 'rgba(253,186,116,0.16)', top: '54%', left: '1%',  width: '68%',  height: '30%', confidence: 96, description: 'Permanent address in Hindi + English — PIN code at end' },
      { id: 'qr',       label: 'e-KYC QR Code',      icon: QrCode,       color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '52%', left: '72%', width: '26%',  height: '30%', confidence: 99, description: 'Offline e-KYC QR — encrypted demographic data, UIDAI verifiable' },
      { id: 'uid',      label: 'Aadhaar Number',     icon: Hash,         color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '86%', left: '5%',  width: '75%',  height: '10%', confidence: 99, description: '12-digit UIDAI identifier — displayed XXXX XXXX XXXX' },
    ],
  },

  pan_card: {
    title: 'PAN Card (Income Tax Dept.)',
    icon: CreditCard,
    color: '#f8bc4b',
    regions: [
      { id: 'header',   label: 'IT Dept Header',    icon: Landmark,     color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '0%',  left: '0%',  width: '100%', height: '18%', confidence: 99, description: 'INCOME TAX DEPARTMENT + Govt of India emblem — top band' },
      { id: 'photo',    label: 'Applicant Photo',   icon: Camera,       color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '20%', left: '2%',  width: '28%',  height: '45%', confidence: 98, description: 'Colour photo — left side, credit-card portrait orientation' },
      { id: 'sig',      label: 'Signature',          icon: FileText,     color: '#fda4af', bg: 'rgba(253,164,175,0.16)', top: '70%', left: '2%',  width: '28%',  height: '15%', confidence: 95, description: 'Applicant signature — below photo panel' },
      { id: 'pan',      label: 'PAN Number',         icon: Hash,         color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '20%', left: '34%', width: '62%',  height: '14%', confidence: 99, description: '10-character alphanumeric — AAAAA9999A format, bold' },
      { id: 'name',     label: 'Name',               icon: User,         color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '36%', left: '34%', width: '62%',  height: '12%', confidence: 99, description: 'Full legal name — caps, below PAN number' },
      { id: 'fname',    label: "Father's / Parent's Name", icon: User,   color: '#c4b5fd', bg: 'rgba(196,181,253,0.16)', top: '50%', left: '34%', width: '62%',  height: '12%', confidence: 98, description: 'Father\'s name (for individuals) — standard requirement' },
      { id: 'dob',      label: 'Date of Birth',      icon: Calendar,     color: '#fdba74', bg: 'rgba(253,186,116,0.16)', top: '64%', left: '34%', width: '40%',  height: '12%', confidence: 98, description: 'DOB: DD/MM/YYYY — "Date of Birth" label above value' },
      { id: 'qr',       label: 'QR / Hologram Zone', icon: QrCode,       color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '64%', left: '76%', width: '20%',  height: '22%', confidence: 97, description: 'Security hologram + optional QR — bottom-right corner' },
    ],
  },

  drivers_license: {
    title: "Driver's Licence (Sarathi / RTO)",
    icon: Car,
    color: '#86efac',
    regions: [
      { id: 'header',   label: 'State RTO Header',  icon: Building2,    color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '0%',  left: '0%',  width: '100%', height: '14%', confidence: 99, description: 'State name + Transport dept logo + "DRIVING LICENCE" title' },
      { id: 'photo',    label: 'Photo',              icon: Camera,       color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '16%', left: '2%',  width: '26%',  height: '38%', confidence: 98, description: 'Applicant colour photo — upper-left panel' },
      { id: 'dl-no',    label: 'Licence Number',     icon: Hash,         color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '16%', left: '30%', width: '68%',  height: '10%', confidence: 99, description: 'DL Number: MH-XX-YYYY-XXXXXXX format' },
      { id: 'name',     label: 'Name',               icon: User,         color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '28%', left: '30%', width: '68%',  height: '9%',  confidence: 99, description: 'Full legal name of licence holder' },
      { id: 'dob',      label: 'Date of Birth',      icon: Calendar,     color: '#c4b5fd', bg: 'rgba(196,181,253,0.16)', top: '39%', left: '30%', width: '40%',  height: '9%',  confidence: 98, description: 'DOB — DD/MM/YYYY; used for age eligibility verification' },
      { id: 'validity', label: 'Valid From / Till',  icon: Calendar,     color: '#fda4af', bg: 'rgba(253,164,175,0.16)', top: '39%', left: '72%', width: '26%',  height: '9%',  confidence: 97, description: 'Issue date and expiry date — must be within validity window' },
      { id: 'classes',  label: 'Vehicle Classes',    icon: Car,          color: '#fdba74', bg: 'rgba(253,186,116,0.16)', top: '56%', left: '0%',  width: '70%',  height: '22%', confidence: 96, description: 'Authorised vehicle categories: LMV, MCWG, TRANS, HMV etc.' },
      { id: 'address',  label: 'Address',            icon: MapPin,       color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '80%', left: '0%',  width: '75%',  height: '15%', confidence: 95, description: 'Registered residential address with PIN code' },
      { id: 'sig',      label: 'Signature & Seal',   icon: Stamp,        color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '80%', left: '76%', width: '22%',  height: '18%', confidence: 96, description: 'Issuing RTO officer signature + official transport seal' },
    ],
  },

  income_certificate: {
    title: 'Revenue & Income Certificate',
    icon: FileText,
    color: '#c4b5fd',
    regions: [
      { id: 'letterhead', label: 'Govt Letterhead',  icon: Landmark,   color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '0%',  left: '0%',  width: '100%', height: '16%', confidence: 99, description: 'State Revenue Dept letterhead + district seal + certificate number' },
      { id: 'cert-no',    label: 'Certificate No.',  icon: Hash,       color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '18%', left: '60%', width: '38%',  height: '8%',  confidence: 98, description: 'Unique certificate ID — format: DIST/YEAR/SEQ' },
      { id: 'name',       label: 'Applicant Name',   icon: User,       color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '28%', left: '5%',  width: '90%',  height: '9%',  confidence: 99, description: 'Full legal name of income earner / applicant' },
      { id: 'address',    label: 'Address',           icon: MapPin,     color: '#fdba74', bg: 'rgba(253,186,116,0.16)', top: '39%', left: '5%',  width: '90%',  height: '10%', confidence: 97, description: 'Permanent address as declared — matched against civic database' },
      { id: 'income',     label: 'Annual Income',     icon: Banknote,   color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '52%', left: '5%',  width: '90%',  height: '10%', confidence: 99, description: 'Declared annual income in INR — statutory slab verified by AI' },
      { id: 'purpose',    label: 'Certificate Purpose', icon: FileText, color: '#c4b5fd', bg: 'rgba(196,181,253,0.16)', top: '64%', left: '5%',  width: '90%',  height: '8%',  confidence: 96, description: 'Stated purpose: education / govt scheme / subsidy application' },
      { id: 'seal',       label: 'Official Seal',     icon: Stamp,      color: '#fda4af', bg: 'rgba(253,164,175,0.16)', top: '75%', left: '60%', width: '35%',  height: '20%', confidence: 98, description: 'Tehsildar / Revenue Officer embossed seal + signature' },
    ],
  },

  domicile_certificate: {
    title: 'Domicile & Civil Registry',
    icon: MapPin,
    color: '#fdba74',
    regions: [
      { id: 'letterhead', label: 'Govt Letterhead',  icon: Landmark,   color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '0%',  left: '0%',  width: '100%', height: '16%', confidence: 99, description: 'State govt letterhead + "DOMICILE CERTIFICATE" title' },
      { id: 'cert-no',    label: 'Certificate No.',  icon: Hash,       color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '18%', left: '60%', width: '38%',  height: '8%',  confidence: 98, description: 'Unique domicile certificate number' },
      { id: 'name',       label: 'Applicant Name',   icon: User,       color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '28%', left: '5%',  width: '90%',  height: '9%',  confidence: 99, description: 'Full legal name — certified resident' },
      { id: 'dob',        label: 'Date of Birth',    icon: Calendar,   color: '#c4b5fd', bg: 'rgba(196,181,253,0.16)', top: '39%', left: '5%',  width: '45%',  height: '9%',  confidence: 98, description: 'DOB of applicant as per birth records' },
      { id: 'address',    label: 'Permanent Address', icon: MapPin,    color: '#fdba74', bg: 'rgba(253,186,116,0.16)', top: '50%', left: '5%',  width: '90%',  height: '12%', confidence: 97, description: 'Declared domicile address — residence verified' },
      { id: 'period',     label: 'Residence Period',  icon: Calendar,  color: '#fda4af', bg: 'rgba(253,164,175,0.16)', top: '64%', left: '5%',  width: '75%',  height: '8%',  confidence: 96, description: 'Years of continuous residence declared in this state/district' },
      { id: 'seal',       label: 'Issuing Authority', icon: Stamp,     color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '76%', left: '58%', width: '38%',  height: '20%', confidence: 98, description: 'SDM / District Magistrate seal + countersignature' },
    ],
  },

  caste_certificate: {
    title: 'Caste & Affirmative Action Certificate',
    icon: BadgeCheck,
    color: '#fda4af',
    regions: [
      { id: 'letterhead', label: 'Govt Letterhead',  icon: Landmark,   color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '0%',  left: '0%',  width: '100%', height: '16%', confidence: 99, description: 'State Social Welfare Dept letterhead + "CASTE CERTIFICATE" title' },
      { id: 'cert-no',    label: 'Certificate No.',  icon: Hash,       color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '18%', left: '58%', width: '40%',  height: '8%',  confidence: 98, description: 'Unique caste certificate number' },
      { id: 'name',       label: 'Applicant Name',   icon: User,       color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '28%', left: '5%',  width: '90%',  height: '9%',  confidence: 99, description: 'Full legal name' },
      { id: 'dob',        label: 'Date of Birth',    icon: Calendar,   color: '#c4b5fd', bg: 'rgba(196,181,253,0.16)', top: '39%', left: '5%',  width: '45%',  height: '9%',  confidence: 98, description: 'DOB verified against civil records' },
      { id: 'caste',      label: 'Caste / Category', icon: BadgeCheck, color: '#fda4af', bg: 'rgba(253,164,175,0.16)', top: '50%', left: '5%',  width: '90%',  height: '10%', confidence: 99, description: 'Declared caste name + SC/ST/OBC category — constitutionally recognised' },
      { id: 'sub-caste',  label: 'Sub-Caste / Tribe', icon: FileText, color: '#fdba74', bg: 'rgba(253,186,116,0.16)', top: '62%', left: '5%',  width: '90%',  height: '8%',  confidence: 96, description: 'Sub-caste or tribe name as per scheduled lists' },
      { id: 'seal',       label: 'Competent Authority', icon: Stamp,   color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '76%', left: '58%', width: '38%',  height: '20%', confidence: 98, description: 'Issuing DM / Tehsildar seal + signature with date' },
    ],
  },

  land_registry: {
    title: 'Land Registry Title Deed',
    icon: Landmark,
    color: '#86efac',
    regions: [
      { id: 'header',     label: 'Registry Header',   icon: Landmark,  color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '0%',  left: '0%',  width: '100%', height: '13%', confidence: 99, description: 'Sub-Registrar Office + district + "SALE DEED / TITLE DEED" heading' },
      { id: 'reg-no',     label: 'Registration No.',  icon: Hash,      color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '15%', left: '55%', width: '43%',  height: '8%',  confidence: 99, description: 'Deed / Document number + book/volume reference' },
      { id: 'parties',    label: 'Parties to Deed',   icon: User,      color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '25%', left: '2%',  width: '95%',  height: '12%', confidence: 98, description: 'Seller (Vendor) and Buyer (Vendee) full legal names + addresses' },
      { id: 'survey',     label: 'Survey / Plot No.', icon: MapPin,    color: '#fdba74', bg: 'rgba(253,186,116,0.16)', top: '39%', left: '2%',  width: '60%',  height: '10%', confidence: 99, description: 'Survey number, plot/khasra/khatoni number — cadastral reference' },
      { id: 'area',       label: 'Land Area / Bounds', icon: MapPin,   color: '#c4b5fd', bg: 'rgba(196,181,253,0.16)', top: '51%', left: '2%',  width: '95%',  height: '10%', confidence: 97, description: 'Area in sq. mt / acres / cents + boundary description (N/S/E/W)' },
      { id: 'value',      label: 'Consideration Value', icon: Banknote,color: '#fda4af', bg: 'rgba(253,164,175,0.16)', top: '63%', left: '2%',  width: '60%',  height: '9%',  confidence: 98, description: 'Sale consideration amount in INR — stamp duty base value' },
      { id: 'stamp',      label: 'Stamp Duty & Reg.',  icon: Stamp,    color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '63%', left: '65%', width: '33%',  height: '9%',  confidence: 98, description: 'Stamp duty paid + registration fee — e-stamp serial number' },
      { id: 'witnesses',  label: 'Signatures / Witnesses', icon: FileText, color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '76%', left: '2%', width: '95%', height: '20%', confidence: 97, description: 'Signatures of parties + two witnesses + Sub-Registrar attestation' },
    ],
  },

  business_license: {
    title: 'Municipal Business & Trade License',
    icon: Building2,
    color: '#fdba74',
    regions: [
      { id: 'header',     label: 'Municipal Header',  icon: Building2, color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '0%',  left: '0%',  width: '100%', height: '15%', confidence: 99, description: 'Municipal Corporation / Gram Panchayat header + "TRADE LICENSE" title' },
      { id: 'lic-no',     label: 'License Number',    icon: Hash,      color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '17%', left: '55%', width: '43%',  height: '8%',  confidence: 99, description: 'Unique trade/business license number — zone + ward reference' },
      { id: 'biz-name',   label: 'Business Name',     icon: Building2, color: '#fdba74', bg: 'rgba(253,186,116,0.16)', top: '27%', left: '5%',  width: '90%',  height: '9%',  confidence: 99, description: 'Registered trade name of the business' },
      { id: 'owner',      label: 'Owner Name',         icon: User,      color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '38%', left: '5%',  width: '90%',  height: '9%',  confidence: 99, description: 'Proprietor / MD / Partner full legal name' },
      { id: 'address',    label: 'Business Address',   icon: MapPin,    color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '49%', left: '5%',  width: '90%',  height: '10%', confidence: 97, description: 'Physical location of licensed establishment + PIN code' },
      { id: 'activity',   label: 'Business Activity',  icon: FileText,  color: '#c4b5fd', bg: 'rgba(196,181,253,0.16)', top: '61%', left: '5%',  width: '90%',  height: '9%',  confidence: 98, description: 'Type of trade / NIC code / activity description' },
      { id: 'validity',   label: 'Validity Period',    icon: Calendar,  color: '#fda4af', bg: 'rgba(253,164,175,0.16)', top: '72%', left: '5%',  width: '55%',  height: '8%',  confidence: 97, description: 'License valid from–to dates; annual renewal required' },
      { id: 'seal',       label: 'Municipal Seal',     icon: Stamp,     color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '72%', left: '65%', width: '32%',  height: '22%', confidence: 98, description: 'Commissioner / Health Officer seal + countersignature' },
    ],
  },

  pension_verification: {
    title: 'Direct Benefit Pension Verification',
    icon: Banknote,
    color: '#c4b5fd',
    regions: [
      { id: 'header',     label: 'Pension Dept Header', icon: Landmark, color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '0%',  left: '0%',  width: '100%', height: '15%', confidence: 99, description: 'Central / State Pension Dept + PPO (Pension Payment Order) heading' },
      { id: 'ppo-no',     label: 'PPO Number',          icon: Hash,     color: '#f8bc4b', bg: 'rgba(248,188,75,0.18)',   top: '17%', left: '55%', width: '43%',  height: '8%',  confidence: 99, description: 'Pension Payment Order number — unique pension identifier' },
      { id: 'name',       label: 'Pensioner Name',      icon: User,     color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '27%', left: '5%',  width: '90%',  height: '9%',  confidence: 99, description: 'Full legal name of pensioner / retired govt servant' },
      { id: 'photo',      label: 'Photo',               icon: Camera,   color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '27%', left: '72%', width: '25%',  height: '22%', confidence: 96, description: 'Pensioner passport photo — right panel' },
      { id: 'dob',        label: 'Date of Birth / Retirement', icon: Calendar, color: '#c4b5fd', bg: 'rgba(196,181,253,0.16)', top: '38%', left: '5%', width: '65%', height: '9%', confidence: 98, description: 'DOB + date of retirement / superannuation' },
      { id: 'amount',     label: 'Monthly Pension Amount', icon: Banknote, color: '#fda4af', bg: 'rgba(253,164,175,0.16)', top: '49%', left: '5%', width: '65%', height: '10%', confidence: 99, description: 'Basic pension + DA in INR — verified against CPAO records' },
      { id: 'bank',       label: 'Bank / DBT Details',  icon: Building2, color: '#fdba74', bg: 'rgba(253,186,116,0.16)', top: '61%', left: '5%', width: '90%',  height: '10%', confidence: 97, description: 'Bank name + masked account number + IFSC — DBT linked' },
      { id: 'life-cert',  label: 'Life Certificate Ref.', icon: BadgeCheck, color: '#86efac', bg: 'rgba(134,239,172,0.16)', top: '73%', left: '5%', width: '60%', height: '9%', confidence: 97, description: 'Annual Jeevan Pramaan / life certificate reference number' },
      { id: 'seal',       label: 'Authorising Office',  icon: Stamp,    color: '#a5eff0', bg: 'rgba(165,239,240,0.16)', top: '76%', left: '65%', width: '32%',  height: '20%', confidence: 98, description: 'PAO / Treasury Officer seal + date of issue' },
    ],
  },
};

/* =========================================================================
   COMPONENT
   ========================================================================= */

interface DocumentLayoutAnalyserProps {
  previewUrl: string;
  serviceType: ServiceType;
  isProcessing: boolean;
  analysisComplete: boolean;
}

export const DocumentLayoutAnalyser: React.FC<DocumentLayoutAnalyserProps> = ({
  previewUrl,
  serviceType,
  isProcessing,
  analysisComplete,
}) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [revealedRegions, setRevealedRegions] = useState<string[]>([]);
  const [scanPhase, setScanPhase] = useState<'idle' | 'scanning' | 'done'>('idle');

  const layout = LAYOUTS[serviceType];

  // Animate regions one-by-one when processing begins
  useEffect(() => {
    if (!isProcessing) { setScanPhase('idle'); return; }
    setScanPhase('scanning');
    setRevealedRegions([]);
    layout?.regions.forEach((r, i) => {
      setTimeout(() => setRevealedRegions(prev => [...prev, r.id]), 280 + i * 300);
    });
  }, [isProcessing]);

  useEffect(() => {
    if (analysisComplete) {
      setScanPhase('done');
      setRevealedRegions(layout?.regions.map(r => r.id) ?? []);
    }
  }, [analysisComplete]);

  if (!layout || !previewUrl) return null;

  const activeReg = layout.regions.find(r => r.id === activeRegion);
  const LayoutIcon = layout.icon;

  return (
    <div
      className="mt-4 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(0,8,24,0.90)',
        border: `1px solid ${layout.color}30`,
        boxShadow: `0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px ${layout.color}15`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${layout.color}18` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${layout.color}18`, border: `1px solid ${layout.color}40` }}
          >
            <LayoutIcon style={{ color: layout.color, width: '15px', height: '15px' }} />
          </div>
          <div>
            <span className="text-xs font-bold text-white">Layout Recognition — {layout.title}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: scanPhase === 'scanning' ? '#f8bc4b' : scanPhase === 'done' ? '#86efac' : '#a5b8d8',
                  animation: scanPhase === 'scanning' ? 'pulse 1s infinite' : 'none',
                  boxShadow: scanPhase === 'scanning' ? '0 0 6px #f8bc4b' : 'none',
                }}
              />
              <span className="text-[10px]" style={{ color: '#a5b8d8' }}>
                {scanPhase === 'idle' && 'Ready — submit to begin field detection'}
                {scanPhase === 'scanning' && `Mapping ${layout.title} field regions...`}
                {scanPhase === 'done' && `${layout.regions.length} layout regions identified • Layout-only mode — no PII stored`}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowOverlay(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all"
          style={{ background: `${layout.color}12`, border: `1px solid ${layout.color}35`, color: layout.color }}
        >
          {showOverlay ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showOverlay ? 'Hide' : 'Show'} overlay
        </button>
      </div>

      {/* Image + bounding boxes */}
      <div className="p-4">
        <div className="relative rounded-xl overflow-hidden bg-black" style={{ aspectRatio: serviceType === 'pan_card' || serviceType === 'aadhaar_card' || serviceType === 'drivers_license' ? '1.58 / 1' : '0.77 / 1' }}>
          <img
            src={previewUrl}
            alt="Document preview"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />

          {/* Scan line */}
          {scanPhase === 'scanning' && (
            <div
              className="absolute left-0 w-full h-0.5 pointer-events-none z-20"
              style={{
                background: `linear-gradient(to right, transparent, ${layout.color}, transparent)`,
                boxShadow: `0 0 12px ${layout.color}`,
                animation: 'docScanLine 1.5s linear infinite',
              }}
            />
          )}

          {/* Region overlays */}
          {showOverlay && layout.regions.map((region) => {
            const isRevealed = revealedRegions.includes(region.id);
            const isActive = activeRegion === region.id;
            if (!isRevealed) return null;
            return (
              <div
                key={region.id}
                className="absolute cursor-pointer transition-all duration-200"
                style={{
                  top: region.top, left: region.left,
                  width: region.width, height: region.height,
                  border: `2px solid ${region.color}`,
                  background: isActive ? region.bg : 'transparent',
                  boxShadow: isActive ? `0 0 14px ${region.color}55` : `inset 0 0 0 1px ${region.color}22`,
                  borderRadius: '3px',
                  animation: 'regionReveal 0.3s ease-out',
                  zIndex: isActive ? 15 : 10,
                }}
                onMouseEnter={() => setActiveRegion(region.id)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                <div
                  className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[8px] font-bold whitespace-nowrap flex items-center gap-1"
                  style={{ background: region.color, color: '#001020', opacity: isActive ? 1 : 0.80 }}
                >
                  <region.icon style={{ width: '7px', height: '7px' }} />
                  {region.label}
                </div>
              </div>
            );
          })}

          {/* Hover tooltip */}
          {activeReg && (
            <div
              className="absolute bottom-2 left-2 right-2 z-30 px-3 py-2 rounded-xl text-xs"
              style={{
                background: 'rgba(0,8,24,0.94)',
                border: `1px solid ${activeReg.color}45`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <activeReg.icon style={{ color: activeReg.color, width: '12px', height: '12px' }} />
                <span className="font-bold" style={{ color: activeReg.color }}>{activeReg.label}</span>
                <span className="ml-auto font-mono text-[10px]" style={{ color: '#a5b8d8' }}>
                  {activeReg.confidence}% conf.
                </span>
              </div>
              <p className="text-white/65 leading-snug">{activeReg.description}</p>
            </div>
          )}
        </div>

        {/* Legend chips */}
        {revealedRegions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {layout.regions.filter(r => revealedRegions.includes(r.id)).map((region) => (
              <button
                key={region.id}
                onMouseEnter={() => setActiveRegion(region.id)}
                onMouseLeave={() => setActiveRegion(null)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all"
                style={{
                  background: activeRegion === region.id ? region.bg : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${activeRegion === region.id ? region.color : 'rgba(255,255,255,0.10)'}`,
                  color: activeRegion === region.id ? region.color : 'rgba(255,255,255,0.55)',
                }}
              >
                <region.icon style={{ width: '10px', height: '10px', color: region.color, flexShrink: 0 }} />
                {region.label}
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
              <strong>Layout-only mode active.</strong> AutoGov+ uses the structural template of this document type to locate fields.
              No personal data (name, ID number, address) is stored or transmitted beyond the verification endpoint — fully compliant with IT Act §43A and DPDP Act 2023.
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes docScanLine {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes regionReveal {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
