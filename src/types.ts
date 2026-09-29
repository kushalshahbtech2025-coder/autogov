export type ServiceType = 
  | 'income_certificate'
  | 'domicile_certificate'
  | 'caste_certificate'
  | 'land_registry'
  | 'business_license'
  | 'pension_verification'
  | 'pan_card'
  | 'drivers_license'
  | 'aadhaar_card';

export type ApplicationStatus = 
  | 'REVIEW_REQUIRED'
  | 'AUTO_CLEARED'
  | 'IN_PROGRESS'
  | 'APPROVED'
  | 'REJECTED';

export interface ExtractedEntity {
  id: string;
  field: string;
  value: string;
  status: 'valid' | 'mismatch' | 'warning';
  confidence: number;
  boundingBox?: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}

export interface FraudFinding {
  id: string;
  title: string;
  impactScore: number;
  severity: 'high' | 'medium' | 'low';
  icon: string;
  description: string;
}

export interface ShapFeature {
  name: string;
  label: string;
  value: number;
  formattedValue: string;
  color: 'error' | 'tertiary' | 'secondary';
}

export interface Application {
  id: string;
  trackingId: string;
  applicantName: string;
  serviceType: ServiceType;
  serviceLabel: string;
  submissionDate: string;
  status: ApplicationStatus;
  riskScore: number; // 0 - 100
  confidence: number; // 0 - 100
  documentUrl: string;
  documentType: string;
  documentPages?: number;
  isLiveScanned?: boolean;
  aiVerdict?: 'CORRECT' | 'WRONG';
  aiVerdictReason?: string;
  extractedEntities: ExtractedEntity[];
  findings: FraudFinding[];
  shapFeatures: ShapFeature[];
  recommendation: {
    action: 'manual_review' | 'auto_clear' | 'reject';
    summary: string;
  };
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  applicationId: string;
  officer: string;
  action: string;
  details: string;
  type: 'ai_decision' | 'officer_action' | 'system_event' | 'security_alert';
}

export type ViewMode = 
  | 'platform'
  | 'how-it-works'
  | 'tech-stack'
  | 'ai-engine'
  | 'impact'
  | 'security'
  | 'citizen'
  | 'officer_review'
  | 'officer_applications'
  | 'officer_overview'
  | 'officer_flagged'
  | 'officer_analytics'
  | 'officer_audit'
  | 'officer_settings';

export interface TechStackItem {
  id: string;
  tier: string;
  category: 'frontend' | 'backend' | 'ai-ml' | 'infra-sec';
  primaryTech: string;
  secondaryFallback: string;
  roleAndSla: string;
  status: 'ACTIVE' | 'SYNCING' | 'STANDBY';
  activeRecordsCount?: number;
  healthScore?: number;
  lastUpdated?: string;
}
