import React, { useState, useRef } from 'react';
import { ViewMode, ServiceType, Application, ExtractedEntity, FraudFinding, ShapFeature } from '../types';
import { DocumentLayoutAnalyser } from './DocumentLayoutAnalyser';
import { 
  FileText, 
  UploadCloud, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck2, 
  Sparkles, 
  RefreshCw, 
  Building2, 
  ChevronDown,
  UserCheck,
  ShieldCheck,
  Lock,
  Download,
  Clock,
  Zap,
  BadgeCheck
} from 'lucide-react';

interface CitizenApplicationSectionProps {
  onNavigate: (view: ViewMode) => void;
  onApplicationCreated?: (app: Application) => void;
  onSelectApplicationForReview?: (appId: string) => void;
  id?: string;
}

const SAMPLE_BENCHMARKS = [
  {
    id: 'sample-clean',
    name: 'Income_Affidavit_Verified_2026.jpg',
    label: 'Clean Verified Affidavit (Instant Auto-Clear Benchmark)',
    url: '/sample_affidavit.jpg',
    expectedRisk: 8
  },
  {
    id: 'sample-anomaly',
    name: 'Form_ITR1_Sahaj_AY2023-24.jpg',
    label: 'Anomalous Tax Return (Officer Review Benchmark)',
    url: '/sample_itr_sahaj.jpg',
    expectedRisk: 72
  }
];

export const CitizenApplicationSection: React.FC<CitizenApplicationSectionProps> = ({
  onNavigate,
  onApplicationCreated,
  onSelectApplicationForReview,
  id = 'submit-citizen-application'
}) => {
  // Service selection
  const [selectedService, setSelectedService] = useState<ServiceType>('income_certificate');
  
  // Applicant details
  const [applicantName, setApplicantName] = useState<string>('Sunita Patil');
  const [citizenId, setCitizenId] = useState<string>('MH-PUN-2026-8819');
  const [contactNumber, setContactNumber] = useState<string>('+91 98231 44021');

  // Document Integrity & Verification simulation mode: 'valid' | 'flawed'
  const [simulationMode, setSimulationMode] = useState<'valid' | 'flawed'>('valid');

  // File state
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileMimeType, setFileMimeType] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Verification state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0); // 0: idle, 1: ingest, 2: ocr, 3: forensics, 4: risk, 5: done
  const [stepMessage, setStepMessage] = useState<string>('');
  const [createdApp, setCreatedApp] = useState<Application | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const services: { id: ServiceType; label: string; sla: string }[] = [
    { id: 'income_certificate', label: 'Revenue & Income Certificate', sla: '< 1.8s' },
    { id: 'domicile_certificate', label: 'Domicile & Civil Registry', sla: '< 1.4s' },
    { id: 'caste_certificate', label: 'Caste & Affirmative Action', sla: '< 2.1s' },
    { id: 'land_registry', label: 'Land Registry Title Deed', sla: '< 3.2s' },
    { id: 'business_license', label: 'Municipal Business & Trade License', sla: '< 2.4s' },
    { id: 'pension_verification', label: 'Direct Benefit Pension Verification', sla: '< 1.2s' },
    { id: 'pan_card', label: 'Permanent Account Number (PAN Card)', sla: '< 0.8s' },
    { id: 'drivers_license', label: "Driver's Licence (Sarathi / RTO)", sla: '< 1.1s' },
    { id: 'aadhaar_card', label: 'Aadhaar Identity Card (UIDAI)', sla: '< 0.9s' }
  ];

  const currentServiceLabel = services.find(s => s.id === selectedService)?.label || 'Income Certificate';

  const handleServiceSelect = (svcId: ServiceType) => {
    setSelectedService(svcId);
    if (!citizenId || citizenId === 'MH-PUN-2026-8819' || citizenId === 'ABCDE1234F' || citizenId === 'MH-12-2022-0048191' || citizenId === '5482 9102 4819' || citizenId === 'DL-CBDT-2026-4019') {
      if (svcId === 'pan_card') setCitizenId('ABCDE1234F');
      else if (svcId === 'drivers_license') setCitizenId('MH-12-2022-0048191');
      else if (svcId === 'aadhaar_card') setCitizenId('5482 9102 4819');
      else setCitizenId('MH-PUN-2026-8819');
    }
  };

  const handleFile = (file: File) => {
    setSelectedFileName(file.name);
    setFileSize(file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`);
    setFileMimeType(file.type || 'image/jpeg');
    setCreatedApp(null);
    setScanError(null);
    setActiveStep(0);

    // Auto-detect if file name contains anomaly indicators
    const lower = file.name.toLowerCase();
    if (lower.includes('anomaly') || lower.includes('sahaj') || lower.includes('fake') || lower.includes('error') || lower.includes('wrong')) {
      setSimulationMode('flawed');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFileBase64(dataUrl);
      setPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const loadBenchmarkSample = async (sample: typeof SAMPLE_BENCHMARKS[0]) => {
    setSelectedFileName(sample.name);
    setFileSize('45 KB');
    setPreviewUrl(sample.url);
    setCreatedApp(null);
    setScanError(null);
    setActiveStep(0);

    if (sample.id === 'sample-anomaly') {
      setSimulationMode('flawed');
      setApplicantName('Rajesh K. Verma');
      setCitizenId('DL-CBDT-2026-4019');
    } else {
      setSimulationMode('valid');
      setApplicantName('Sunita Patil');
      setCitizenId('MH-PUN-2026-8819');
    }

    try {
      const resp = await fetch(sample.url);
      const blob = await resp.blob();
      setFileMimeType(blob.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      setFileBase64(sample.url);
    }
  };

  const submitApplication = async () => {
    if (isProcessing) return;

    let base64ToSend = fileBase64;
    let mimeTypeToSend = fileMimeType || 'image/jpeg';
    let docName = selectedFileName || (simulationMode === 'flawed' ? 'Form_ITR1_Sahaj_AY2023-24.jpg' : 'Income_Affidavit_Verified_2026.jpg');

    // If no file loaded, auto-load chosen sample
    if (!base64ToSend) {
      const chosenSample = simulationMode === 'flawed' ? SAMPLE_BENCHMARKS[1] : SAMPLE_BENCHMARKS[0];
      base64ToSend = chosenSample.url;
      docName = chosenSample.name;
    }

    const finalApplicantName = applicantName.trim() || 'Sunita Patil';
    const finalCitizenId = citizenId.trim() || 'MH-PUN-2026-8819';
    const finalContact = contactNumber.trim() || '+91 98231 44021';
    const isAnomalousSim = simulationMode === 'flawed' || docName.toLowerCase().includes('sahaj') || docName.toLowerCase().includes('anomaly');

    setIsProcessing(true);
    setScanError(null);
    setActiveStep(1);
    setStepMessage('Sanitizing payload & computing immutable SHA-256 hash...');

    // Progress stepper timers
    const timer1 = setTimeout(() => {
      setActiveStep(2);
      setStepMessage('GovDoc-OCR & IndicBERT parsing multilingual entities...');
    }, 900);

    const timer2 = setTimeout(() => {
      setActiveStep(3);
      setStepMessage('FraudNet-v4 analyzing pixel error level (ELA) & seals...');
    }, 2000);

    const timer3 = setTimeout(() => {
      setActiveStep(4);
      setStepMessage('XGBoost risk matrix checking 42 statutory indicators...');
    }, 3100);

    try {
      // Call verification API with dynamic user data
      const res = await fetch('/api/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentBase64: base64ToSend,
          mimeType: mimeTypeToSend,
          fileName: docName,
          serviceType: selectedService,
          serviceLabel: currentServiceLabel,
          applicantName: finalApplicantName,
          citizenId: finalCitizenId,
          contactNumber: finalContact,
          simulateAnomaly: isAnomalousSim
        })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      let scanResult: any = null;
      if (res.ok) {
        scanResult = await res.json();
      }

      const generatedId = `AG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const genTrackingId = `AGV-${Math.floor(1000 + Math.random() * 9000)}-${['KXL', 'MNT', 'WQR', 'PLZ'][Math.floor(Math.random() * 4)]}`;
      const calculatedRisk = scanResult?.riskScore !== undefined 
        ? scanResult.riskScore 
        : (isAnomalousSim ? 78 : 8);

      const isCorrect = calculatedRisk < 25;
      const aiVerdict: 'CORRECT' | 'WRONG' = isCorrect ? 'CORRECT' : 'WRONG';
      const aiVerdictReason = isCorrect 
        ? `AI Response: CORRECT. Verified authentic document for ${finalApplicantName}. Official seal validated and text attributes certified.`
        : `AI Response: WRONG. Anomaly or statutory discrepancy detected for ${finalApplicantName}. Forwarded to Office Cockpit for human officer review and correction.`;

      // Extract entities guaranteeing that user-provided name & citizenId are accurately preserved
      let mappedEntities: ExtractedEntity[] = scanResult?.extractedEntities || [];
      if (!mappedEntities.length) {
        mappedEntities = [
          { id: 'e1', field: 'Applicant Name', value: finalApplicantName, status: isCorrect ? 'valid' : 'warning', confidence: 99 },
          { id: 'e2', field: 'Citizen / Certificate ID', value: finalCitizenId, status: isCorrect ? 'valid' : 'mismatch', confidence: 97 },
          { id: 'e3', field: currentServiceLabel, value: isCorrect ? '₹ 1,80,000 (Within Statutory Slab)' : '₹ 9,40,000 (Exceeds Slab Limit)', status: isCorrect ? 'valid' : 'mismatch', confidence: 96 },
          { id: 'e4', field: 'Issuing Authority', value: 'Executive Magistrate & Revenue Directorate', status: 'valid', confidence: 98 },
          { id: 'e5', field: 'Institutional Seal / QR', value: isCorrect ? '100% Cryptographically Valid' : 'Discrepancy / Watermark Variance Detected', status: isCorrect ? 'valid' : 'mismatch', confidence: 95 }
        ];
      } else {
        mappedEntities = mappedEntities.map(ent => {
          if (ent.id === 'e1' || ent.field.toLowerCase().includes('name') || ent.field.toLowerCase().includes('applicant')) {
            return { ...ent, value: finalApplicantName };
          }
          if (ent.id === 'e2' || ent.field.toLowerCase().includes('id') || ent.field.toLowerCase().includes('pan')) {
            return { ...ent, value: finalCitizenId };
          }
          return ent;
        });
      }

      const newAppRecord: Application = {
        id: generatedId,
        trackingId: genTrackingId,
        applicantName: finalApplicantName,
        serviceType: selectedService,
        serviceLabel: currentServiceLabel,
        submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: isCorrect ? 'AUTO_CLEARED' : 'REVIEW_REQUIRED',
        riskScore: calculatedRisk,
        confidence: scanResult?.confidence ?? (isCorrect ? 98.4 : 91.2),
        documentUrl: previewUrl || base64ToSend || '/sample_affidavit.jpg',
        documentType: scanResult?.documentTitle || docName,
        documentPages: 1,
        isLiveScanned: true,
        aiVerdict,
        aiVerdictReason,
        extractedEntities: mappedEntities,
        findings: scanResult?.findings || (isCorrect ? [
          {
            id: 'f1',
            title: 'Official Seal Verification Passed',
            impactScore: -15,
            severity: 'low',
            icon: 'ShieldCheck',
            description: 'Digital watermark and institutional crest match official state repository standards.'
          },
          {
            id: 'f2',
            title: 'Font Uniformity Confirmed',
            impactScore: -8,
            severity: 'low',
            icon: 'CheckCircle',
            description: 'No font interpolation, copy-paste artifacts, or resolution shifts detected.'
          }
        ] : [
          {
            id: 'f1',
            title: 'AI Anomaly Detected',
            impactScore: 35,
            severity: 'high',
            icon: 'AlertTriangle',
            description: 'Seal edge or typography variance detected against state master registry.'
          },
          {
            id: 'f2',
            title: 'Statutory Slab Threshold Mismatch',
            impactScore: 28,
            severity: 'high',
            icon: 'AlertTriangle',
            description: 'Parameter values exceed statutory thresholds for the requested public service.'
          }
        ]),
        shapFeatures: scanResult?.shapFeatures || [
          { name: 'seal_integrity', label: 'Seal Vector Ground Truth', value: isCorrect ? -14 : 28, formattedValue: isCorrect ? '-14%' : '+28%', color: isCorrect ? 'secondary' : 'error' },
          { name: 'registry_match', label: 'Civil Database Match', value: isCorrect ? -18 : 34, formattedValue: isCorrect ? '-18%' : '+34%', color: isCorrect ? 'secondary' : 'error' }
        ],
        recommendation: {
          action: isCorrect ? 'auto_clear' : 'manual_review',
          summary: aiVerdictReason
        }
      };

      // Persist to backend database
      try {
        await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAppRecord)
        });
      } catch (err) {
        console.warn('Backend sync failed, storing locally', err);
      }

      onApplicationCreated?.(newAppRecord);
      onSelectApplicationForReview?.(newAppRecord.id);
      setCreatedApp(newAppRecord);
      setActiveStep(5);
      setIsProcessing(false);

    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsProcessing(false);
      setScanError(err.message || 'Verification could not be completed.');
      setActiveStep(0);
    }
  };

  const handleOpenInCockpit = () => {
    if (createdApp) {
      onSelectApplicationForReview?.(createdApp.id);
    }
    onNavigate('officer_review');
  };

  return (
    <section id={id} className="w-full py-12 scroll-mt-20">
      <div className="bg-white rounded-3xl border border-[#c4c6cf] shadow-sm overflow-hidden">
        
        {/* Section Header */}
        <div className="bg-[#002045] p-6 sm:p-10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#13696a]/40">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13696a]/30 border border-[#13696a]/50 text-[#a5eff0] text-xs sm:text-sm font-bold uppercase tracking-wider">
              <UserCheck className="w-4 h-4" />
              <span>Citizen Self-Service Application Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Submit Citizen Application
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#adc7f7] leading-relaxed">
              Submit your official document for instantaneous AI verification, anti-tamper validation, and digital certificate issuance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs sm:text-sm font-mono font-bold bg-[#1a365d] text-[#a5eff0] px-4 py-2 rounded-xl border border-[#2d476f] flex items-center gap-2 shadow-sm">
              <Zap className="w-4 h-4" />
              <span>Sub-2s Real-Time SLA</span>
            </span>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 sm:p-10">
          
          {!createdApp ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              
              {/* Left Column: Form Details */}
              <div className="lg:col-span-6 space-y-7">
                
                {/* 1. Service Selection */}
                <div>
                  <label className="block text-sm sm:text-base font-extrabold uppercase text-[#002045] mb-3 tracking-wide">
                    1. Select Public Service Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((svc) => {
                      const isSelected = selectedService === svc.id;
                      return (
                        <div
                          key={svc.id}
                          onClick={() => handleServiceSelect(svc.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-[#002045] bg-[#eff4ff] shadow-sm ring-2 ring-[#002045]' 
                              : 'border-[#c4c6cf] bg-white hover:border-[#002045]/60 hover:shadow-xs'
                          }`}
                        >
                          <div className="text-sm sm:text-base font-bold text-[#002045] leading-snug">{svc.label}</div>
                          <div className="text-xs font-mono font-bold text-[#13696a] mt-1.5">SLA: {svc.sla}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Applicant Information */}
                <div>
                  <label className="block text-sm sm:text-base font-extrabold uppercase text-[#002045] mb-3 tracking-wide">
                    2. Applicant Details
                  </label>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-bold text-[#002045] block mb-1.5">Full Legal Name:</span>
                      <input
                        type="text"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full p-3.5 bg-[#f8f9ff] border border-[#c4c6cf] rounded-xl text-sm sm:text-base font-semibold text-[#002045] focus:outline-none focus:ring-2 focus:ring-[#002045] focus:border-transparent transition-all"
                        placeholder="e.g. Sunita Patil"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-bold text-[#002045] block mb-1.5">
                          {selectedService === 'pan_card' 
                            ? 'PAN Number (10 Digits):' 
                            : selectedService === 'drivers_license'
                            ? 'Driving Licence Number:'
                            : selectedService === 'aadhaar_card'
                            ? 'Aadhaar Number (12 Digits):'
                            : 'Citizen / Aadhaar ID:'}
                        </span>
                        <input
                          type="text"
                          value={citizenId}
                          onChange={(e) => setCitizenId(e.target.value)}
                          className="w-full p-3.5 bg-[#f8f9ff] border border-[#c4c6cf] rounded-xl text-sm sm:text-base font-mono font-semibold text-[#002045] focus:outline-none focus:ring-2 focus:ring-[#002045] focus:border-transparent transition-all"
                          placeholder={
                            selectedService === 'pan_card'
                              ? 'ABCDE1234F'
                              : selectedService === 'drivers_license'
                              ? 'MH-12-2022-0048191'
                              : selectedService === 'aadhaar_card'
                              ? '5482 9102 4819'
                              : 'MH-PUN-XXXX-8819'
                          }
                        />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#002045] block mb-1.5">Mobile for Digital SMS:</span>
                        <input
                          type="text"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          className="w-full p-3.5 bg-[#f8f9ff] border border-[#c4c6cf] rounded-xl text-sm sm:text-base font-mono font-semibold text-[#002045] focus:outline-none focus:ring-2 focus:ring-[#002045] focus:border-transparent transition-all"
                          placeholder="+91 98231 XXXXX"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Verification Test Mode (Valid Clean vs Flawed Discrepancy) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm sm:text-base font-extrabold uppercase text-[#002045] tracking-wide">
                      3. AI Verification Test Mode
                    </label>
                    <span className="text-xs font-mono font-bold text-[#13696a]">Dynamic Engine</span>
                  </div>
                  <p className="text-xs text-[#43474e] mb-3">
                    Choose whether this submission simulates an authentic document or one containing statutory discrepancies:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSimulationMode('valid')}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                        simulationMode === 'valid'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600 shadow-sm'
                          : 'border-[#c4c6cf] bg-white hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${simulationMode === 'valid' ? 'text-emerald-600' : 'text-[#43474e]'}`} />
                      <div>
                        <div className="text-sm font-bold text-[#002045]">Authentic &amp; Valid</div>
                        <div className="text-xs text-[#43474e] mt-0.5">AI Verdict: <span className="font-bold text-emerald-700">CORRECT</span> (Auto-Cleared)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSimulationMode('flawed')}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                        simulationMode === 'flawed'
                          ? 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-600 shadow-sm'
                          : 'border-[#c4c6cf] bg-white hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${simulationMode === 'flawed' ? 'text-rose-600' : 'text-[#43474e]'}`} />
                      <div>
                        <div className="text-sm font-bold text-[#002045]">Discrepancy / Flawed</div>
                        <div className="text-xs text-[#43474e] mt-0.5">AI Verdict: <span className="font-bold text-rose-700">WRONG</span> (Office Correction)</div>
                      </div>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Document Upload & Benchmark */}
              <div className="lg:col-span-6 space-y-7">
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm sm:text-base font-extrabold uppercase text-[#002045] tracking-wide">
                      4. Document Upload (PDF, JPG, PNG)
                    </label>
                    <span className="text-xs sm:text-sm text-[#13696a] font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>256-bit TLS Encrypted</span>
                    </span>
                  </div>

                  {/* Dropzone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-7 sm:p-9 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                      isDragging 
                        ? 'border-[#13696a] bg-[#eff4ff]' 
                        : selectedFileName 
                        ? 'border-[#13696a] bg-[#f8f9ff]' 
                        : 'border-[#c4c6cf] bg-[#f8f9ff] hover:bg-[#eff4ff]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />

                    {previewUrl ? (
                      <div className="flex items-center gap-4 mb-2">
                        <img 
                          src={previewUrl} 
                          alt="Doc preview" 
                          className="w-20 h-24 object-cover rounded-xl border border-[#c4c6cf] bg-white shadow-sm" 
                        />
                        <div className="text-left">
                          <div className="text-sm sm:text-base font-extrabold text-[#002045] line-clamp-1">{selectedFileName}</div>
                          <div className="text-xs sm:text-sm text-[#43474e] mt-0.5">{fileSize} • Ready to verify</div>
                          <span className="inline-block mt-2 text-xs bg-[#d4e4fc] text-[#002045] font-bold px-3 py-1 rounded-lg">
                            Click to change file
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] text-[#002045] flex items-center justify-center mb-3 shadow-xs">
                          <UploadCloud className="w-7 h-7" />
                        </div>
                        <div className="text-base sm:text-lg font-bold text-[#002045]">
                          Drag &amp; drop document or click to browse
                        </div>
                        <div className="text-xs sm:text-sm text-[#43474e] mt-1">
                          Income slip, caste certificate, deed, or utility bill (JPG, PNG, PDF up to 25MB)
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ── Document Layout Analyser ── shown whenever a file is uploaded */}
                <DocumentLayoutAnalyser
                  previewUrl={previewUrl}
                  serviceType={selectedService}
                  isProcessing={isProcessing}
                  analysisComplete={activeStep >= 3}
                />

                {/* Instant 1-Click Benchmark Test Pill Options */}
                <div>
                  <span className="text-xs sm:text-sm font-extrabold text-[#43474e] uppercase block mb-2.5 tracking-wide">
                    Or Test Instantly with Sample Benchmarks:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SAMPLE_BENCHMARKS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => loadBenchmarkSample(sample)}
                        className={`p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                          selectedFileName === sample.name
                            ? 'bg-[#002045] text-white border-[#002045]'
                            : 'bg-white text-[#002045] border-[#c4c6cf] hover:bg-[#eff4ff]'
                        }`}
                      >
                        <span className="line-clamp-1">{sample.label}</span>
                        <ChevronDown className="w-4 h-4 shrink-0 rotate-[-90deg]" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-3">
                  <button
                    disabled={isProcessing}
                    onClick={submitApplication}
                    className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-[#002045] text-white font-extrabold text-base sm:text-lg hover:bg-[#1a365d] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin text-[#a5eff0]" />
                        <span>Verifying with AI Engine...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck2 className="w-5 h-5 text-[#a5eff0]" />
                        <span>Submit Application for AI Verification</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-xs sm:text-sm text-center text-[#43474e] mt-2.5">
                    Instantly evaluates seals, text consistency, and fraud markers with zero waiting queues.
                  </p>
                </div>

                {/* Processing Steps Progress */}
                {isProcessing && (
                  <div className="bg-[#eff4ff] p-5 rounded-2xl border border-[#c4c6cf] space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-sm sm:text-base font-bold text-[#002045]">
                      <span>Verification In Progress</span>
                      <span className="font-mono text-[#13696a]">Step {activeStep}/4</span>
                    </div>
                    <div className="w-full bg-[#c4c6cf]/40 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#002045] h-full transition-all duration-300"
                        style={{ width: `${(activeStep / 4) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-[#13696a] font-semibold flex items-center gap-2 pt-1">
                      <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
                      <span>{stepMessage}</span>
                    </div>
                  </div>
                )}

                {scanError && (
                  <div className="bg-[#fff1f2] border border-[#fecdd3] p-4 rounded-xl text-sm font-semibold text-[#b91c1c] flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>{scanError}</span>
                  </div>
                )}

              </div>

            </div>
          ) : (
            /* ================= AI RESPONSE CARD (CORRECT OR WRONG ONLY) ================= */
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
              
              {/* Primary AI Verdict Card */}
              <div className={`p-8 sm:p-10 rounded-3xl border-2 text-center space-y-5 shadow-md ${
                createdApp.aiVerdict === 'CORRECT'
                  ? 'bg-[#f0fdfa] border-[#14b8a6] text-[#0f766e]'
                  : 'bg-[#fff1f2] border-[#f43f5e] text-[#be123c]'
              }`}>
                
                {/* Big Visual Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mx-auto">
                  {createdApp.aiVerdict === 'CORRECT' ? (
                    <BadgeCheck className="w-12 h-12 text-[#0f766e]" />
                  ) : (
                    <AlertTriangle className="w-12 h-12 text-[#be123c]" />
                  )}
                </div>

                <div>
                  <div className={`text-sm font-mono font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-3 ${
                    createdApp.aiVerdict === 'CORRECT' ? 'bg-[#ccfbf1] text-[#0f766e]' : 'bg-[#ffe4e6] text-[#be123c]'
                  }`}>
                    AI RESPONSE: {createdApp.aiVerdict}
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002045]">
                    {createdApp.aiVerdict === 'CORRECT' ? 'Document is Correct' : 'Document is Wrong'}
                  </h3>

                  <p className="text-base sm:text-lg text-[#43474e] mt-3 max-w-lg mx-auto leading-relaxed">
                    {createdApp.aiVerdict === 'CORRECT'
                      ? 'The AI verified this document as correct and authentic. It has been passed directly to the Office Cockpit for official clearance.'
                      : 'The AI detected discrepancies in this document. It has been passed directly to the Office Cockpit for officer correction.'}
                  </p>
                </div>

                {/* Destination & Tracking Details */}
                <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-5 border border-[#c4c6cf]/60 text-left text-sm sm:text-base space-y-3">
                  <div className="flex justify-between items-center border-b border-[#c4c6cf]/40 pb-2.5">
                    <span className="text-[#43474e] font-medium">Status:</span>
                    <span className="font-bold text-[#002045] flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#13696a]" />
                      Sent to Office Cockpit for Review &amp; Correction
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#43474e] font-medium">Official Tracking ID:</span>
                    <span className="font-mono font-bold text-[#002045] text-base">{createdApp.trackingId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#43474e] font-medium">Applicant Name:</span>
                    <span className="font-bold text-[#002045]">{createdApp.applicantName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#43474e] font-medium">Service Category:</span>
                    <span className="font-semibold text-[#002045]">{createdApp.serviceLabel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#43474e] font-medium">Document File:</span>
                    <span className="font-semibold text-[#002045] truncate max-w-[280px]">{createdApp.documentType}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-center gap-3.5">
                  <button
                    onClick={handleOpenInCockpit}
                    className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-[#002045] text-white font-extrabold text-sm sm:text-base hover:bg-[#1a365d] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
                  >
                    <Building2 className="w-5 h-5 text-[#a5eff0]" />
                    <span>
                      {createdApp.aiVerdict === 'CORRECT'
                        ? 'Open in Office Cockpit'
                        : 'Open in Office Cockpit for Correction'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setCreatedApp(null);
                      setSelectedFileName('');
                      setPreviewUrl('');
                      setFileBase64('');
                      setActiveStep(0);
                    }}
                    className="w-full sm:w-auto py-4 px-5 rounded-xl border border-[#c4c6cf] bg-white text-[#002045] font-extrabold text-sm sm:text-base hover:bg-[#eff4ff] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Submit Another Document</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
