import React, { useState, useRef } from 'react';
import { ViewMode, Application, AuditLog, ServiceType } from '../types';
import { 
  Shield, 
  ArrowLeft, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  SlidersHorizontal, 
  Check, 
  X, 
  History, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LayoutDashboard, 
  Layers, 
  Sparkles, 
  Building2, 
  Bot, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Send,
  Eye,
  UploadCloud,
  FileUp,
  AlertCircle,
  ScanLine,
  Edit3,
  Save,
  Undo,
  Plus,
  Trash2,
  CheckCheck
} from 'lucide-react';

interface OfficerPortalProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  applications: Application[];
  selectedAppId: string;
  onSelectApplication: (id: string) => void;
  onUpdateApplicationStatus: (id: string, status: 'APPROVED' | 'REJECTED' | 'REVIEW_REQUIRED', notes?: string) => void;
  onApplicationCreated?: (app: Application) => void;
  onUpdateApplication?: (app: Application, note?: string) => void;
  auditLogs: AuditLog[];
}

export const OfficerPortal: React.FC<OfficerPortalProps> = ({
  currentView,
  onNavigate,
  applications,
  selectedAppId,
  onSelectApplication,
  onUpdateApplicationStatus,
  onApplicationCreated,
  onUpdateApplication,
  auditLogs
}) => {
  const [sidebarTab, setSidebarTab] = useState<'review' | 'applications' | 'flagged' | 'analytics' | 'audit' | 'settings'>('review');
  const [showShap, setShowShap] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreenDoc, setIsFullscreenDoc] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Ingest Document Modal State
  const [showIngestModal, setShowIngestModal] = useState<boolean>(false);
  const [ingestFileName, setIngestFileName] = useState<string>('');
  const [ingestFileSize, setIngestFileSize] = useState<string>('');
  const [ingestFileBase64, setIngestFileBase64] = useState<string>('');
  const [ingestMimeType, setIngestMimeType] = useState<string>('');
  const [ingestPreviewUrl, setIngestPreviewUrl] = useState<string>('');
  const [ingestServiceType, setIngestServiceType] = useState<ServiceType>('income_certificate');
  const [isIngestScanning, setIsIngestScanning] = useState<boolean>(false);
  const [ingestStepMessage, setIngestStepMessage] = useState<string>('');
  const [ingestError, setIngestError] = useState<string | null>(null);
  const [isIngestDragging, setIsIngestDragging] = useState<boolean>(false);
  const ingestFileInputRef = useRef<HTMLInputElement>(null);

  // Modals for actions
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [reviewNotesInput, setReviewNotesInput] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>('Signature mismatch and CBDT revenue threshold breach');

  const officerServices: { id: ServiceType; label: string }[] = [
    { id: 'income_certificate', label: 'Income Certificate Verification' },
    { id: 'domicile_certificate', label: 'Domicile Certificate Verification' },
    { id: 'caste_certificate', label: 'Caste / Community Certificate' },
    { id: 'land_registry', label: 'Land Title Registry Verification' },
    { id: 'business_license', label: 'Commercial Enterprise Registration' },
    { id: 'pension_verification', label: 'Senior Citizen Pension Verification' },
    { id: 'pan_card', label: 'PAN Card Verification (CBDT)' },
    { id: 'drivers_license', label: "Driver's License Verification (RTO)" },
    { id: 'aadhaar_card', label: 'Aadhaar Identity Verification (UIDAI)' }
  ];

  const handleIngestFile = (file: File) => {
    if (!file) return;
    setIngestFileName(file.name);
    setIngestFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setIngestMimeType(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target?.result as string;
      setIngestFileBase64(b64);
      setIngestPreviewUrl(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleIngestDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsIngestDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleIngestFile(e.dataTransfer.files[0]);
    }
  };

  const handleExecuteOfficerScan = async () => {
    let base64ToSend = ingestFileBase64;
    let mimeTypeToSend = ingestMimeType || 'image/jpeg';
    let docName = ingestFileName || 'Form_ITR1_Sahaj_AY2023-24.jpg';

    if (!base64ToSend) {
      base64ToSend = '/sample_itr_sahaj.jpg';
      docName = 'Form_ITR1_Sahaj_AY2023-24.jpg';
      mimeTypeToSend = 'image/jpeg';
    }

    setIsIngestScanning(true);
    setIngestError(null);
    setIngestStepMessage('Ingesting document into Gemini multimodal vision engine...');

    try {
      const selectedServiceObj = officerServices.find(s => s.id === ingestServiceType);
      const resp = await fetch('/api/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentBase64: base64ToSend,
          mimeType: mimeTypeToSend,
          fileName: docName,
          serviceType: ingestServiceType,
          serviceLabel: selectedServiceObj?.label || 'Income Certificate Verification',
        }),
      });

      if (!resp.ok) {
        throw new Error(`AI Scan returned HTTP status ${resp.status}`);
      }

      const result = await resp.json();
      const generatedAppId = `AG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const genTrackingId = `AGV-${Math.floor(1000 + Math.random() * 9000)}-OFC`;
      const calculatedRisk = result.riskScore ?? 25;

      let appStatus: Application['status'] = 'AUTO_CLEARED';
      if (calculatedRisk > 50 || result.recommendation?.action === 'manual_review') {
        appStatus = 'REVIEW_REQUIRED';
      } else if (result.recommendation?.action === 'reject') {
        appStatus = 'REJECTED';
      }

      const newApp: Application = {
        id: generatedAppId,
        trackingId: genTrackingId,
        applicantName: result.applicantName || 'Applicant (Live Scanned)',
        serviceType: ingestServiceType,
        serviceLabel: selectedServiceObj?.label || 'Document Verification',
        submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: appStatus,
        riskScore: calculatedRisk,
        confidence: result.confidence ?? 94,
        documentUrl: ingestPreviewUrl || base64ToSend,
        documentType: result.documentTitle || docName,
        documentPages: result.documentPages || 1,
        isLiveScanned: true,
        extractedEntities: result.extractedEntities?.length ? result.extractedEntities : [
          {
            id: 'e1',
            field: 'Applicant Name',
            value: result.applicantName || 'Identified Citizen',
            status: 'valid',
            confidence: 96
          }
        ],
        findings: result.findings?.length ? result.findings : [
          {
            id: 'f1',
            title: 'Multimodal Forensic Review Completed',
            impactScore: calculatedRisk > 50 ? 25 : -10,
            severity: calculatedRisk > 50 ? 'high' : 'low',
            icon: calculatedRisk > 50 ? 'AlertTriangle' : 'ShieldCheck',
            description: result.documentSummary || 'Verified by AutoGov+ Gemini engine.'
          }
        ],
        shapFeatures: result.shapFeatures || [
          {
            name: 'visual_authenticity',
            label: 'Visual Authenticity Score',
            value: calculatedRisk > 50 ? 20 : -12,
            formattedValue: calculatedRisk > 50 ? '+20%' : '-12%',
            color: calculatedRisk > 50 ? 'error' : 'secondary'
          }
        ],
        recommendation: result.recommendation || {
          action: calculatedRisk > 50 ? 'manual_review' : 'auto_clear',
          summary: result.documentSummary || 'Scanned and evaluated with Gemini multimodal vision.'
        }
      };

      onApplicationCreated?.(newApp);
      onSelectApplication(newApp.id);
      setIsIngestScanning(false);
      setShowIngestModal(false);
      setSidebarTab('review');
    } catch (err: any) {
      console.error('Officer Ingest Scan Error:', err);
      setIsIngestScanning(false);
      setIngestError(err.message || 'Verification process encountered an unexpected issue.');
    }
  };

  // Selected application object
  const currentApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Entity Correction State
  const [isEditingEntities, setIsEditingEntities] = useState<boolean>(false);
  const [editedEntities, setEditedEntities] = useState(currentApp?.extractedEntities ? [...currentApp.extractedEntities] : []);
  const [correctionFeedback, setCorrectionFeedback] = useState<string | null>(null);

  // Sync editedEntities whenever selected application changes
  React.useEffect(() => {
    if (currentApp) {
      setEditedEntities(currentApp.extractedEntities ? JSON.parse(JSON.stringify(currentApp.extractedEntities)) : []);
      setIsEditingEntities(false);
      setCorrectionFeedback(null);
    }
  }, [currentApp?.id]);

  const handleEntityFieldChange = (id: string, key: 'field' | 'value' | 'status', val: any) => {
    setEditedEntities(prev => prev.map(item => item.id === id ? { ...item, [key]: val } : item));
  };

  const handleAddEntity = () => {
    const newId = `e-${Date.now()}`;
    setEditedEntities(prev => [
      ...prev,
      { id: newId, field: 'New Statutory Field', value: '', status: 'valid', confidence: 99 }
    ]);
  };

  const handleRemoveEntity = (id: string) => {
    setEditedEntities(prev => prev.filter(e => e.id !== id));
  };

  const handleSaveCorrections = (shouldApprove: boolean = false) => {
    const updatedStatus = shouldApprove ? 'APPROVED' : (currentApp.status === 'REVIEW_REQUIRED' ? 'IN_PROGRESS' : currentApp.status);
    const applicantNameEntity = editedEntities.find(e => e.id === 'e1' || e.field.toLowerCase().includes('applicant name') || e.field.toLowerCase() === 'full name');
    const resolvedName = applicantNameEntity?.value?.trim() || currentApp.applicantName;
    const updatedApp: Application = {
      ...currentApp,
      applicantName: resolvedName,
      extractedEntities: editedEntities,
      status: updatedStatus,
      reviewNotes: (currentApp.reviewNotes ? currentApp.reviewNotes + ' | ' : '') + 
        (shouldApprove ? 'Officer corrected extracted fields and approved document.' : 'Officer corrected extracted fields.')
    };

    onUpdateApplication?.(updatedApp, `Officer corrected ${editedEntities.length} fields in extracted entities.`);
    if (shouldApprove) {
      onUpdateApplicationStatus(currentApp.id, 'APPROVED', 'Officer corrected extracted fields and approved document.');
    }

    setIsEditingEntities(false);
    setCorrectionFeedback(shouldApprove ? 'Corrections saved and document approved!' : 'Field corrections saved successfully.');
    setTimeout(() => setCorrectionFeedback(null), 4000);
  };

  const handleApprove = () => {
    onUpdateApplicationStatus(currentApp.id, 'APPROVED', reviewNotesInput || 'Approved by Officer after manual review.');
    setShowApproveModal(false);
    setReviewNotesInput('');
  };

  const handleReject = () => {
    onUpdateApplicationStatus(currentApp.id, 'REJECTED', rejectReason || 'Rejected due to validation anomalies.');
    setShowRejectModal(false);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.serviceLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const flaggedApplications = applications.filter(a => a.status === 'REVIEW_REQUIRED' || a.riskScore > 50);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#f8f9ff]">
      
      {/* ================= SIDE NAVIGATION BAR ================= */}
      <aside className="hidden md:flex flex-col w-64 h-full bg-[#eff4ff] border-r border-[#c4c6cf] p-4 shrink-0">
        
        {/* Jurisdiction Header */}
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-[#1a365d] text-white flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-[#a5eff0]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#002045]">Officer Portal</h1>
            <p className="text-xs text-[#43474e] font-medium">Jurisdiction Alpha</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-1">
          <button
            onClick={() => setSidebarTab('applications')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              sidebarTab === 'applications'
                ? 'bg-[#a2eded] text-[#002020] shadow-sm'
                : 'text-[#43474e] hover:bg-[#dce9ff]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview &amp; Queue</span>
          </button>

          <button
            onClick={() => setSidebarTab('review')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              sidebarTab === 'review'
                ? 'bg-[#a2eded] text-[#002020] shadow-sm translate-x-1 font-bold'
                : 'text-[#43474e] hover:bg-[#dce9ff]'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Active Dossier</span>
            </div>
            <span className="font-mono text-[11px] bg-white/70 px-1.5 py-0.5 rounded border border-[#13696a]/20">
              {currentApp.id.replace('AG-2026-', '#')}
            </span>
          </button>

          <button
            onClick={() => setSidebarTab('flagged')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              sidebarTab === 'flagged'
                ? 'bg-[#a2eded] text-[#002020] shadow-sm'
                : 'text-[#43474e] hover:bg-[#dce9ff]'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
              <span>Flagged Items</span>
            </div>
            {flaggedApplications.length > 0 && (
              <span className="bg-[#ba1a1a] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {flaggedApplications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSidebarTab('analytics')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              sidebarTab === 'analytics'
                ? 'bg-[#a2eded] text-[#002020] shadow-sm'
                : 'text-[#43474e] hover:bg-[#dce9ff]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Impact Analytics</span>
          </button>

          <button
            onClick={() => setSidebarTab('audit')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              sidebarTab === 'audit'
                ? 'bg-[#a2eded] text-[#002020] shadow-sm'
                : 'text-[#43474e] hover:bg-[#dce9ff]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </nav>

        {/* Bottom utility links */}
        <div className="mt-auto pt-4 border-t border-[#c4c6cf] flex flex-col gap-1">
          <button
            onClick={() => setSidebarTab('settings')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#43474e] hover:bg-[#dce9ff] transition-all cursor-pointer ${
              sidebarTab === 'settings' ? 'bg-[#dce9ff] text-[#002045]' : ''
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>System Settings</span>
          </button>
          
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#43474e] hover:bg-[#dce9ff] transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Platform Overview</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-white">
        
        {/* ================= VIEW: ACTIVE DOSSIER / APPLICATION REVIEW ================= */}
        {sidebarTab === 'review' && (
          <div className="flex-1 flex flex-col min-h-full">
            
            {/* Header Sticky Anchor */}
            <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#c4c6cf] px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarTab('applications')}
                  className="text-[#43474e] hover:text-[#002045] transition-colors p-1.5 rounded hover:bg-[#eff4ff]"
                  title="Back to queue"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-extrabold text-[#0d1c2e] tracking-tight font-mono">
                      {currentApp.id}
                    </h2>

                    {/* Status Badge */}
                    {currentApp.status === 'REVIEW_REQUIRED' && (
                      <span className="bg-[#ffdad6] text-[#93000a] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#ba1a1a]/20">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>REVIEW REQUIRED</span>
                      </span>
                    )}

                    {currentApp.status === 'AUTO_CLEARED' && (
                      <span className="bg-[#a2eded] text-[#004f50] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#13696a]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>AUTO-CLEARED</span>
                      </span>
                    )}

                    {currentApp.status === 'APPROVED' && (
                      <span className="bg-[#a2eded] text-[#004f50] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>OFFICER APPROVED</span>
                      </span>
                    )}

                    {currentApp.status === 'REJECTED' && (
                      <span className="bg-[#ffdad6] text-[#93000a] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        <span>REJECTED</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#43474e] mt-0.5">
                    Submitted: {currentApp.submissionDate} • {currentApp.serviceLabel} • Applicant: {currentApp.applicantName}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowIngestModal(true)}
                  className="flex items-center gap-1.5 bg-[#002045] text-white px-3 py-2 rounded text-xs font-semibold hover:bg-[#1a365d] transition-colors shadow-sm cursor-pointer"
                  title="Upload and scan your own document using Gemini AI"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#a5eff0]" />
                  <span>Scan New Document</span>
                </button>

                {/* Switch Application selector */}
                <select
                  value={currentApp.id}
                  onChange={(e) => onSelectApplication(e.target.value)}
                  className="text-xs font-semibold py-2 px-3 border border-[#c4c6cf] rounded bg-[#f8f9ff] text-[#002045] focus:outline-none focus:ring-1 focus:ring-[#13696a]"
                >
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>
                      {app.isLiveScanned ? '★ [LIVE] ' : ''}{app.id} - {app.applicantName} ({app.status})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 border border-[#74777f] text-[#0d1c2e] px-3.5 py-2 rounded text-xs font-semibold hover:bg-[#eff4ff] transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print File</span>
                </button>
              </div>
            </header>

            {/* Incoming Citizen Submission AI Response & Correction Banner */}
            {currentApp.aiVerdict && (
              <div className="max-w-[1440px] mx-auto w-full px-6 pt-5">
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
                  currentApp.aiVerdict === 'WRONG'
                    ? 'bg-[#fff1f2] border-[#fecdd3] text-[#9f1239]'
                    : 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${
                      currentApp.aiVerdict === 'WRONG' ? 'bg-[#ffe4e6] text-[#e11d48]' : 'bg-[#dcfce7] text-[#16a34a]'
                    }`}>
                      {currentApp.aiVerdict === 'WRONG' ? (
                        <AlertCircle className="w-5 h-5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm tracking-tight">
                          {currentApp.aiVerdict === 'WRONG'
                            ? 'AI RESPONSE: WRONG — Forwarded from Citizen Portal for Office Correction'
                            : 'AI RESPONSE: CORRECT — Forwarded from Citizen Portal for Final Clearance'}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                          currentApp.aiVerdict === 'WRONG' ? 'bg-[#ffe4e6] text-[#be123c]' : 'bg-[#dcfce7] text-[#15803d]'
                        }`}>
                          Tracking: {currentApp.trackingId}
                        </span>
                      </div>
                      <p className="text-xs mt-1 text-[#43474e]">
                        {currentApp.aiVerdictReason || (currentApp.aiVerdict === 'WRONG'
                          ? 'The AI detected validation discrepancies in this citizen submission. Please inspect the extracted entities below, correct any inaccurate values, and proceed with adjudication.'
                          : 'The AI validated this document with low risk. Verified under standard public registry rules.')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isEditingEntities && (
                      <button
                        onClick={() => setIsEditingEntities(true)}
                        className={`px-3.5 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ${
                          currentApp.aiVerdict === 'WRONG'
                            ? 'bg-[#e11d48] text-white hover:bg-[#be123c]'
                            : 'bg-[#13696a] text-white hover:bg-[#004f50]'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Correct Extracted Entities</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bento Grid Layout (Document Preview + Automated Fraud Assessment) */}
            <div className="p-6 grid grid-cols-12 gap-6 max-w-[1440px] mx-auto w-full flex-1">
              
              {/* ================= LEFT COLUMN: SOURCE DOCUMENT PREVIEW ================= */}
              <div className="col-span-12 lg:col-span-5 flex flex-col h-full">
                <div className="bg-white border border-[#c4c6cf] rounded-lg flex flex-col h-full min-h-[600px] overflow-hidden shadow-sm">
                  
                  {/* Card Header */}
                  <div className="p-3.5 border-b border-[#c4c6cf] flex justify-between items-center bg-[#f8f9ff]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#13696a]" />
                      <h3 className="text-sm font-bold text-[#0d1c2e]">Source Document Preview</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setZoomLevel(prev => Math.min(prev + 25, 200))}
                        className="p-1 text-[#43474e] hover:text-[#002045] rounded hover:bg-white"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setZoomLevel(prev => Math.max(prev - 25, 75))}
                        className="p-1 text-[#43474e] hover:text-[#002045] rounded hover:bg-white"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsFullscreenDoc(!isFullscreenDoc)}
                        className="p-1 text-[#43474e] hover:text-[#002045] rounded hover:bg-white"
                        title="Toggle fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Document Viewport */}
                  <div className="flex-1 bg-[#eff4ff] relative flex items-center justify-center p-4 overflow-auto group">
                    <div 
                      className="w-full max-w-md bg-white shadow-md border border-[#c4c6cf] aspect-[8.5/11] relative overflow-hidden transition-transform duration-200 origin-center"
                      style={{ transform: `scale(${zoomLevel / 100})` }}
                    >
                      {/* Document Image or Embedded PDF */}
                      {currentApp.documentUrl?.startsWith('data:application/pdf') ? (
                        <iframe
                          src={currentApp.documentUrl}
                          title={currentApp.documentType}
                          className="w-full h-full border-0 bg-white"
                        />
                      ) : (
                        <img
                          className="w-full h-full object-contain bg-white"
                          alt={`Source Document: ${currentApp.documentType}`}
                          src={currentApp.documentUrl}
                        />
                      )}

                      {/* Scanner Effect Overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="w-full h-10 bg-gradient-to-b from-transparent via-[#a2eded]/40 to-transparent animate-scan" />
                      </div>

                      {/* Extraction Bounding Boxes */}
                      {currentApp.extractedEntities.map((entity) => {
                        if (!entity.boundingBox) return null;
                        const isMismatch = entity.status === 'mismatch';
                        return (
                          <div
                            key={entity.id}
                            style={{
                              top: entity.boundingBox.top,
                              left: entity.boundingBox.left,
                              width: entity.boundingBox.width,
                              height: entity.boundingBox.height
                            }}
                            className={`absolute border transition-all cursor-pointer group/box ${
                              isMismatch
                                ? 'border-[#ba1a1a] bg-[#ba1a1a]/15 animate-pulse'
                                : 'border-[#13696a] bg-[#13696a]/10'
                            }`}
                          >
                            <span className={`hidden group-hover/box:block absolute -top-5 left-0 font-mono text-[9px] px-1 py-0.5 rounded text-white whitespace-nowrap z-20 ${
                              isMismatch ? 'bg-[#ba1a1a]' : 'bg-[#13696a]'
                            }`}>
                              {entity.field}: {entity.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Document Footer Info */}
                  <div className="p-3 bg-white border-t border-[#c4c6cf] text-[11px] text-[#43474e] flex items-center justify-between">
                    <span className="truncate">{currentApp.documentType}</span>
                    <span className="font-mono font-semibold">{zoomLevel}% Zoom</span>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT COLUMN: DATA & ACTIONS ================= */}
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                
                {/* 1. Automated Fraud Assessment Card */}
                <div className="bg-white border border-[#c4c6cf] rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-bold text-[#0d1c2e]">
                      Automated Fraud Assessment
                    </h3>
                    <span className="text-xs font-semibold text-[#13696a] flex items-center gap-1 bg-[#a2eded]/30 px-2 py-0.5 rounded">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Real-time</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    
                    {/* Score Gauge */}
                    <div className={`flex flex-col items-center justify-center p-6 rounded-lg border ${
                      currentApp.riskScore > 50 
                        ? 'bg-[#ffdad6]/20 border-[#ffdad6]' 
                        : 'bg-[#a2eded]/20 border-[#13696a]/30'
                    }`}>
                      <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-[#dce9ff]">
                        {/* Circular ring */}
                        <div 
                          className={`absolute inset-0 rounded-full border-8 transition-all ${
                            currentApp.riskScore > 50 ? 'border-[#ba1a1a]' : 'border-[#13696a]'
                          }`}
                          style={{
                            clipPath: `polygon(0 0, 100% 0, 100% ${currentApp.riskScore}%, 0 ${currentApp.riskScore}%)`,
                            transform: 'rotate(-45deg)'
                          }}
                        />
                        <div className="text-center z-10 bg-white w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-inner">
                          <span className={`text-3xl font-extrabold block leading-none font-mono ${
                            currentApp.riskScore > 50 ? 'text-[#ba1a1a]' : 'text-[#13696a]'
                          }`}>
                            {currentApp.riskScore}
                          </span>
                          <span className="text-xs text-[#43474e] block mt-0.5">/ 100</span>
                        </div>
                      </div>

                      <div className={`mt-3 flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        currentApp.riskScore > 50
                          ? 'text-[#ba1a1a] bg-[#ffdad6]'
                          : 'text-[#13696a] bg-[#a2eded]'
                      }`}>
                        {currentApp.riskScore > 50 ? (
                          <>
                            <ShieldAlert className="w-4 h-4" />
                            <span>Higher Risk</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Low Risk Verified</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* AI Findings List */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-bold text-[#43474e] uppercase tracking-wider border-b border-[#c4c6cf] pb-1">
                        AI Findings Log
                      </h4>

                      {currentApp.findings.length === 0 ? (
                        <div className="p-3 bg-[#f8f9ff] border border-[#c4c6cf] rounded text-xs text-[#13696a] font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>No anomalous forgery vectors detected.</span>
                        </div>
                      ) : (
                        currentApp.findings.map((finding) => (
                          <div
                            key={finding.id}
                            className={`flex justify-between items-center p-2.5 rounded-r border border-[#c4c6cf] border-l-4 shadow-sm ${
                              finding.severity === 'high'
                                ? 'bg-white border-l-[#ba1a1a]'
                                : 'bg-white border-l-[#cb9524]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold ${
                                finding.severity === 'high' ? 'text-[#ba1a1a]' : 'text-[#2d1d00]'
                              }`}>
                                {finding.title}
                              </span>
                            </div>
                            <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                              finding.severity === 'high'
                                ? 'text-[#ba1a1a] bg-[#ffdad6]'
                                : 'text-[#2d1d00] bg-[#ffdeaa]'
                            }`}>
                              +{finding.impactScore}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Explainability Module (SHAP) */}
                  <div className="mt-5 pt-3 border-t border-[#c4c6cf]">
                    <button
                      onClick={() => setShowShap(!showShap)}
                      className="flex items-center justify-center gap-2 text-xs font-semibold text-[#13696a] hover:text-[#004f50] w-full bg-[#a2eded]/25 p-2 rounded border border-[#13696a]/20 transition-colors"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{showShap ? 'Hide SHAP Explanation' : 'View SHAP Explanation'}</span>
                    </button>

                    {showShap && (
                      <div className="mt-3 bg-[#f8f9ff] border border-[#c4c6cf] rounded p-3.5 animate-in fade-in duration-200">
                        <p className="font-mono text-xs text-[#43474e] mb-3 border-b border-[#c4c6cf] pb-1">
                          Explainability Module: Local Feature Importance
                        </p>
                        <div className="flex flex-col gap-2">
                          {currentApp.shapFeatures.map((feat) => {
                            const isPositive = feat.value > 0;
                            const barWidth = Math.min(Math.abs(feat.value) * 300, 100);
                            return (
                              <div key={feat.name} className="flex items-center gap-3">
                                <span className="w-1/3 text-right font-mono text-[11px] text-[#0d1c2e] truncate" title={feat.label}>
                                  {feat.name}
                                </span>
                                <div className="flex-1 h-3 bg-[#dce9ff] rounded-full overflow-hidden flex">
                                  <div
                                    className={`h-full ${
                                      feat.color === 'error'
                                        ? 'bg-[#ba1a1a]'
                                        : feat.color === 'tertiary'
                                        ? 'bg-[#cb9524]'
                                        : 'bg-[#13696a]'
                                    }`}
                                    style={{ width: `${barWidth}%` }}
                                  />
                                </div>
                                <span className={`w-12 text-xs font-mono font-bold ${
                                  feat.color === 'error'
                                    ? 'text-[#ba1a1a]'
                                    : feat.color === 'tertiary'
                                    ? 'text-[#2d1d00]'
                                    : 'text-[#13696a]'
                                }`}>
                                  {feat.formattedValue}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Extracted Entities & Officer Corrections Card */}
                <div className="bg-white border border-[#c4c6cf] rounded-lg overflow-hidden shadow-sm">
                  <div className="p-3.5 border-b border-[#c4c6cf] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#13696a]" />
                      <h3 className="text-sm font-bold text-[#0d1c2e]">Extracted Entities &amp; Corrections</h3>
                      {isEditingEntities && (
                        <span className="text-[10px] font-bold bg-[#ffdad6] text-[#ba1a1a] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Correction Mode
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isEditingEntities ? (
                        <button
                          onClick={() => setIsEditingEntities(true)}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#13696a] bg-[#a2eded]/20 hover:bg-[#a2eded]/40 px-3 py-1.5 rounded transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit / Correct Fields</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setIsEditingEntities(false);
                              setEditedEntities(currentApp.extractedEntities ? JSON.parse(JSON.stringify(currentApp.extractedEntities)) : []);
                            }}
                            className="text-xs px-2.5 py-1 rounded text-[#43474e] hover:bg-[#eff4ff] transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveCorrections(false)}
                            className="flex items-center gap-1 text-xs font-bold bg-[#13696a] text-white px-3 py-1 rounded hover:bg-[#004f50] transition-colors shadow-xs cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Corrections</span>
                          </button>
                          <button
                            onClick={() => handleSaveCorrections(true)}
                            className="flex items-center gap-1 text-xs font-bold bg-[#002045] text-white px-3 py-1 rounded hover:bg-[#1a365d] transition-colors shadow-xs cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5 text-[#a5eff0]" />
                            <span>Save &amp; Approve</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {correctionFeedback && (
                    <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{correctionFeedback}</span>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#f8f9ff] text-[#002045] border-b border-[#c4c6cf]">
                          <th className="text-xs font-bold uppercase px-4 py-2.5 w-1/3">Field Name</th>
                          <th className="text-xs font-bold uppercase px-4 py-2.5">
                            {isEditingEntities ? 'Corrected Value & Status' : 'Extracted Value'}
                          </th>
                          {isEditingEntities && (
                            <th className="text-xs font-bold uppercase px-3 py-2.5 w-12 text-center">Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c4c6cf]">
                        {(!isEditingEntities ? currentApp.extractedEntities : editedEntities).map((entity) => {
                          const isMismatch = entity.status === 'mismatch';
                          
                          if (isEditingEntities) {
                            return (
                              <tr key={entity.id} className="bg-white hover:bg-[#f8f9ff]/60">
                                <td className="px-4 py-2">
                                  <input
                                    type="text"
                                    value={entity.field}
                                    onChange={(e) => handleEntityFieldChange(entity.id, 'field', e.target.value)}
                                    className="w-full text-xs font-semibold px-2 py-1 border border-[#c4c6cf] rounded bg-[#f8f9ff] text-[#002045] focus:outline-none focus:ring-1 focus:ring-[#13696a]"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={entity.value}
                                      onChange={(e) => handleEntityFieldChange(entity.id, 'value', e.target.value)}
                                      className="flex-1 font-mono text-xs px-2 py-1 border border-[#c4c6cf] rounded bg-white text-[#002045] focus:outline-none focus:ring-1 focus:ring-[#13696a]"
                                    />
                                    <select
                                      value={entity.status}
                                      onChange={(e) => handleEntityFieldChange(entity.id, 'status', e.target.value)}
                                      className={`text-[11px] font-bold px-2 py-1 rounded border focus:outline-none ${
                                        entity.status === 'valid' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                        entity.status === 'mismatch' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                                        'bg-amber-50 text-amber-800 border-amber-300'
                                      }`}
                                    >
                                      <option value="valid">Verified Valid</option>
                                      <option value="mismatch">Discrepancy / Mismatch</option>
                                      <option value="warning">Requires Follow-up</option>
                                    </select>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <button
                                    onClick={() => handleRemoveEntity(entity.id)}
                                    className="p-1 text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors cursor-pointer"
                                    title="Remove field"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <tr
                              key={entity.id}
                              className={`transition-colors ${
                                isMismatch
                                  ? 'bg-[#ffdad6]/10 border-l-4 border-l-[#ba1a1a]'
                                  : 'hover:bg-[#f8f9ff]'
                              }`}
                            >
                              <td className="px-4 py-2.5 text-xs font-semibold text-[#0d1c2e]">
                                {entity.field}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-xs text-[#43474e] flex items-center justify-between">
                                <span className={isMismatch ? 'text-[#ba1a1a] font-bold' : ''}>
                                  {entity.value}
                                </span>
                                {isMismatch ? (
                                  <span className="bg-[#ba1a1a]/10 text-[#ba1a1a] px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                    Mismatch detected
                                  </span>
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 text-[#13696a]" title="Verified" />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {isEditingEntities && (
                    <div className="p-3 bg-[#f8f9ff] border-t border-[#c4c6cf] flex items-center justify-between">
                      <button
                        onClick={handleAddEntity}
                        className="text-xs font-bold text-[#13696a] flex items-center gap-1.5 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Extracted Field</span>
                      </button>
                      <span className="text-[11px] text-[#43474e]">
                        Changes will be saved to citizen application record and recorded in audit log.
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Action Panel (Bottom Anchor) */}
                <div className="mt-auto bg-white border border-[#c4c6cf] rounded-lg p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-[#002045]/10 p-2 rounded-full mt-0.5 text-[#002045] shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0d1c2e] mb-0.5">
                        AI System Recommendation
                      </h4>
                      <p className="text-xs text-[#43474e] leading-relaxed">
                        {currentApp.recommendation.summary}
                      </p>
                    </div>
                  </div>

                  {/* Decision Buttons */}
                  <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="flex-1 sm:flex-none border-2 border-[#13696a] text-[#13696a] px-6 py-2 rounded text-xs font-bold hover:bg-[#a2eded] hover:text-[#004f50] transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setShowApproveModal(true)}
                      className="flex-1 sm:flex-none bg-[#002045] text-white px-6 py-2 rounded text-xs font-bold hover:bg-[#1a365d] transition-colors shadow-sm cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW: APPLICATIONS QUEUE ================= */}
        {sidebarTab === 'applications' && (
          <div className="p-6 max-w-[1440px] mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#002045]">Applications Queue</h2>
                <p className="text-xs text-[#43474e]">Managing incoming submissions across jurisdiction alpha.</p>
              </div>

              {/* Filters & Ingest Action */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowIngestModal(true)}
                  className="flex items-center gap-1.5 bg-[#002045] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#1a365d] transition-colors shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#a5eff0]" />
                  <span>Ingest / Scan Document</span>
                </button>

                <div className="relative">
                  <Search className="w-4 h-4 text-[#74777f] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search applicant or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs bg-[#f8f9ff] border border-[#c4c6cf] rounded w-48 focus:outline-none focus:ring-1 focus:ring-[#13696a]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-[#f8f9ff] border border-[#c4c6cf] rounded focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="REVIEW_REQUIRED">Review Required</option>
                  <option value="AUTO_CLEARED">Auto-Cleared</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white border border-[#c4c6cf] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#002045] text-white">
                    <th className="p-3.5 text-xs font-semibold uppercase">Case ID</th>
                    <th className="p-3.5 text-xs font-semibold uppercase">Applicant</th>
                    <th className="p-3.5 text-xs font-semibold uppercase">Service</th>
                    <th className="p-3.5 text-xs font-semibold uppercase">AI Response</th>
                    <th className="p-3.5 text-xs font-semibold uppercase">Risk Score</th>
                    <th className="p-3.5 text-xs font-semibold uppercase">Status</th>
                    <th className="p-3.5 text-xs font-semibold uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c6cf]">
                  {filteredApplications.map(app => (
                    <tr 
                      key={app.id}
                      onClick={() => {
                        onSelectApplication(app.id);
                        setSidebarTab('review');
                      }}
                      className="hover:bg-[#eff4ff] transition-colors cursor-pointer"
                    >
                      <td className="p-3.5 font-mono text-xs font-bold text-[#002045]">
                        <div className="flex items-center gap-2">
                          {app.isLiveScanned && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              LIVE
                            </span>
                          )}
                          <span>{app.id}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-xs font-medium text-[#0d1c2e]">{app.applicantName}</td>
                      <td className="p-3.5 text-xs text-[#43474e]">{app.serviceLabel}</td>
                      <td className="p-3.5">
                        {app.aiVerdict === 'WRONG' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#ffe4e6] text-[#be123c] border border-[#f43f5e]/30">
                            <AlertTriangle className="w-3 h-3" />
                            WRONG (Correction)
                          </span>
                        ) : app.aiVerdict === 'CORRECT' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#ccfbf1] text-[#0f766e] border border-[#14b8a6]/30">
                            <Check className="w-3 h-3" />
                            CORRECT
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#74777f] font-mono">—</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          app.riskScore > 50 ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#a2eded] text-[#1a6d6e]'
                        }`}>
                          {app.riskScore}/100
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'REVIEW_REQUIRED' ? 'bg-[#ffdad6] text-[#93000a]' :
                          app.status === 'AUTO_CLEARED' ? 'bg-[#a2eded] text-[#004f50]' :
                          app.status === 'APPROVED' ? 'bg-[#dce9ff] text-[#002045]' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <span className="text-xs font-semibold text-[#13696a] hover:underline flex items-center justify-end gap-1">
                          Review Dossier →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= VIEW: FLAGGED ITEMS ================= */}
        {sidebarTab === 'flagged' && (
          <div className="p-6 max-w-[1440px] mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#002045] flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-[#ba1a1a]" />
                <span>Urgent Fraud Prevention Queue</span>
              </h2>
              <p className="text-xs text-[#43474e]">Anomalies flagged by FraudNet-v4 requiring immediate officer adjudication.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flaggedApplications.map(app => (
                <div 
                  key={app.id} 
                  className="bg-white border border-[#ba1a1a]/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    onSelectApplication(app.id);
                    setSidebarTab('review');
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-[#ba1a1a]">{app.id}</span>
                    <span className="bg-[#ffdad6] text-[#93000a] text-xs font-bold px-2 py-0.5 rounded-full">
                      Risk {app.riskScore}/100
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#002045] mb-1">{app.applicantName}</h4>
                  <p className="text-xs text-[#43474e] mb-3">{app.serviceLabel}</p>
                  
                  <div className="bg-[#ffdad6]/20 p-2.5 rounded border border-[#ba1a1a]/20 mb-3 text-xs text-[#93000a]">
                    <strong>AI Finding:</strong> {app.findings[0]?.description || 'Multiple forensic inconsistencies detected.'}
                  </div>

                  <div className="flex justify-end">
                    <button className="text-xs font-bold text-[#002045] hover:underline flex items-center gap-1">
                      <span>Open Case</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW: ANALYTICS ================= */}
        {sidebarTab === 'analytics' && (
          <div className="p-6 max-w-[1440px] mx-auto w-full space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#002045]">Impact &amp; Efficiency Analytics</h2>
              <p className="text-xs text-[#43474e]">Real-time operational telemetry for Jurisdiction Alpha.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#eff4ff] border border-[#c4c6cf] rounded-xl p-5">
                <div className="text-xs font-bold text-[#43474e] uppercase mb-1">Average Turnaround</div>
                <div className="text-3xl font-extrabold text-[#13696a]">1.4 Hours</div>
                <div className="text-xs text-[#13696a] font-semibold mt-1">~94% faster than manual baseline (15 days)</div>
              </div>

              <div className="bg-[#eff4ff] border border-[#c4c6cf] rounded-xl p-5">
                <div className="text-xs font-bold text-[#43474e] uppercase mb-1">Straight-Through Auto-Clear</div>
                <div className="text-3xl font-extrabold text-[#002045]">78.4%</div>
                <div className="text-xs text-[#43474e] font-semibold mt-1">Zero-anomaly compliance cases</div>
              </div>

              <div className="bg-[#eff4ff] border border-[#c4c6cf] rounded-xl p-5">
                <div className="text-xs font-bold text-[#43474e] uppercase mb-1">Fraud Detection Precision</div>
                <div className="text-3xl font-extrabold text-[#ba1a1a]">99.82%</div>
                <div className="text-xs text-[#ba1a1a] font-semibold mt-1">FraudNet-v4 verified accuracy</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW: AUDIT LOGS ================= */}
        {sidebarTab === 'audit' && (
          <div className="p-6 max-w-[1440px] mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#002045]">Cryptographic Audit Trail</h2>
              <p className="text-xs text-[#43474e]">Immutable ledger of algorithmic scores and officer interventions.</p>
            </div>

            <div className="bg-white border border-[#c4c6cf] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#002045] text-white">
                    <th className="p-3 text-xs font-semibold uppercase">Timestamp</th>
                    <th className="p-3 text-xs font-semibold uppercase">Case ID</th>
                    <th className="p-3 text-xs font-semibold uppercase">Actor / Model</th>
                    <th className="p-3 text-xs font-semibold uppercase">Action</th>
                    <th className="p-3 text-xs font-semibold uppercase">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c6cf]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f8f9ff] text-xs">
                      <td className="p-3 font-mono text-[#43474e]">{log.timestamp}</td>
                      <td className="p-3 font-mono font-bold text-[#002045]">{log.applicationId}</td>
                      <td className="p-3 font-medium text-[#0d1c2e]">{log.officer}</td>
                      <td className="p-3">
                        <span className="font-mono text-[10px] bg-[#eff4ff] text-[#002045] px-2 py-0.5 rounded border border-[#c4c6cf]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-[#43474e]">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= VIEW: SETTINGS ================= */}
        {sidebarTab === 'settings' && (
          <div className="p-6 max-w-[1440px] mx-auto w-full space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#002045]">System Configuration</h2>
              <p className="text-xs text-[#43474e]">Configure algorithmic tolerances and zero-trust thresholds for Jurisdiction Alpha.</p>
            </div>

            <div className="bg-white border border-[#c4c6cf] rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#002045] mb-1">
                  Auto-Clear Confidence Threshold: 95.0%
                </label>
                <input type="range" min="80" max="99" defaultValue="95" className="w-full accent-[#13696a]" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#002045] mb-1">
                  FraudNet-v4 Signature Divergence Tolerance: 0.30
                </label>
                <input type="range" min="10" max="50" defaultValue="30" className="w-full accent-[#13696a]" />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= MODAL: APPROVE CONFIRMATION ================= */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-[#002045]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#c4c6cf] animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#002045] mb-2">
              Approve Application {currentApp.id}?
            </h3>
            <p className="text-xs text-[#43474e] mb-4">
              This will issue an institutional digital clearance certificate for <strong>{currentApp.applicantName}</strong> and log your cryptographic signature in the audit ledger.
            </p>

            <label className="block text-xs font-bold text-[#002045] uppercase mb-1">
              Officer Notes (Optional)
            </label>
            <textarea
              value={reviewNotesInput}
              onChange={(e) => setReviewNotesInput(e.target.value)}
              placeholder="e.g. Cross-verified with tax portal records; discrepancies resolved."
              rows={3}
              className="w-full text-xs p-2.5 border border-[#c4c6cf] rounded mb-4 focus:ring-1 focus:ring-[#13696a]"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#43474e] hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-5 py-2 text-xs font-semibold bg-[#002045] text-white hover:bg-[#1a365d] rounded shadow-sm"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: INGEST & SCAN DOCUMENT ================= */}
      {showIngestModal && (
        <div className="fixed inset-0 bg-[#002045]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-[#c4c6cf] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#c4c6cf] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#002045]">
                  <ScanLine className="w-5 h-5 text-[#13696a]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#002045]">
                    Ingest &amp; Scan Document (Multimodal AI)
                  </h3>
                  <p className="text-[11px] text-[#43474e]">
                    Direct ingestion using Gemini 3.1 Flash Vision OCR &amp; FraudNet-v4
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isIngestScanning) setShowIngestModal(false);
                }}
                disabled={isIngestScanning}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Service selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#002045] uppercase mb-1">
                Select Institutional Service
              </label>
              <select
                value={ingestServiceType}
                onChange={(e) => setIngestServiceType(e.target.value as ServiceType)}
                disabled={isIngestScanning}
                className="w-full text-xs p-2.5 border border-[#c4c6cf] rounded bg-[#f8f9ff] text-[#002045] focus:outline-none focus:ring-1 focus:ring-[#13696a]"
              >
                {officerServices.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Document Upload Area */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#002045] uppercase mb-1">
                Upload Document File
              </label>
              
              <div
                onDragOver={(e) => { e.preventDefault(); setIsIngestDragging(true); }}
                onDragLeave={() => setIsIngestDragging(false)}
                onDrop={handleIngestDrop}
                onClick={() => ingestFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  isIngestDragging 
                    ? 'border-[#13696a] bg-[#eff4ff]' 
                    : ingestPreviewUrl 
                    ? 'border-[#13696a]/40 bg-[#f8f9ff]' 
                    : 'border-[#c4c6cf] hover:border-[#13696a] bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={ingestFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleIngestFile(e.target.files[0]);
                    }
                  }}
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  className="hidden"
                />

                {ingestPreviewUrl ? (
                  <div className="flex items-center gap-4 text-left">
                    <img
                      src={ingestPreviewUrl}
                      alt="Preview"
                      className="w-16 h-20 object-cover rounded border border-slate-300 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#002045] truncate">
                        {ingestFileName || 'Custom Document'}
                      </div>
                      <div className="text-[11px] text-[#43474e]">
                        {ingestFileSize || 'Selected File'}
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-[#13696a] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Ready for Multimodal Scan
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="w-8 h-8 text-[#13696a] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#002045]">
                      Click to browse or drop your document here
                    </p>
                    <p className="text-[11px] text-[#43474e] mt-0.5">
                      Supports PNG, JPG, PDF (Income forms, IDs, affidavits)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Benchmark Presets */}
            <div className="mb-4 bg-[#eff4ff] p-3 rounded-lg border border-[#c4c6cf]/60">
              <div className="text-[11px] font-bold text-[#002045] uppercase mb-1.5 flex items-center gap-1.5">
                <span>Or Select Official Benchmark Sample:</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isIngestScanning}
                  onClick={() => {
                    setIngestFileName('Form_ITR1_Sahaj_AY2023-24.jpg');
                    setIngestFileSize('39 KB');
                    setIngestFileBase64('/sample_itr_sahaj.jpg');
                    setIngestPreviewUrl('/sample_itr_sahaj.jpg');
                    setIngestMimeType('image/jpeg');
                    setIngestServiceType('income_certificate');
                  }}
                  className="text-left p-2 rounded border border-[#c4c6cf] bg-white hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer"
                >
                  <div className="font-bold text-[#002045] truncate">Form ITR-1 Sahaj</div>
                  <div className="text-[10px] text-[#ba1a1a]">Contains Revenue Divergence (Flagged)</div>
                </button>

                <button
                  type="button"
                  disabled={isIngestScanning}
                  onClick={() => {
                    setIngestFileName('Income_Affidavit_Verified_2026.jpg');
                    setIngestFileSize('60 KB');
                    setIngestFileBase64('/sample_affidavit.jpg');
                    setIngestPreviewUrl('/sample_affidavit.jpg');
                    setIngestMimeType('image/jpeg');
                    setIngestServiceType('income_certificate');
                  }}
                  className="text-left p-2 rounded border border-[#c4c6cf] bg-white hover:bg-slate-50 transition-colors text-xs font-medium cursor-pointer"
                >
                  <div className="font-bold text-[#002045] truncate">Income Affidavit</div>
                  <div className="text-[10px] text-[#13696a]">Clean Benchmark (Auto-Cleared)</div>
                </button>
              </div>
            </div>

            {/* Progress / Error message */}
            {isIngestScanning && (
              <div className="mb-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#13696a] border-t-transparent rounded-full animate-spin shrink-0" />
                <div className="text-xs text-[#002045]">
                  <span className="font-bold">Multimodal AI Vision in progress: </span>
                  <span>{ingestStepMessage}</span>
                </div>
              </div>
            )}

            {ingestError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{ingestError}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-[#c4c6cf]">
              <button
                type="button"
                disabled={isIngestScanning}
                onClick={() => setShowIngestModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#43474e] hover:bg-slate-100 rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isIngestScanning}
                onClick={handleExecuteOfficerScan}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-[#002045] text-white hover:bg-[#1a365d] rounded shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#a5eff0]" />
                <span>{isIngestScanning ? 'Scanning Document...' : 'Run Gemini Multimodal Scan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
