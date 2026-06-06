export type UserRole = 'inspector' | 'admin' | 'analyst';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Stall {
  id: string;
  name: string;
  location: string;
  ownerName: string;
  phone: string;
  category: string;
  createdAt: string;
}

export type FreshnessStatus = 'fresh' | 'normal' | 'rotten';

export interface RecognitionResult {
  category: string;
  categoryName: string;
  freshness: FreshnessStatus;
  confidence: number;
}

export interface InspectionRecord {
  id: string;
  stallId: string;
  stallName: string;
  inspectorId: string;
  inspectorName: string;
  inspectionTime: string;
  imageUrl: string;
  recognitionResult: RecognitionResult;
}

export type ViolationType = 'rotten' | 'underweight' | 'other';
export type ViolationStatus = 'pending' | 'processing' | 'resolved';

export interface ViolationRecord {
  id: string;
  inspectionId?: string;
  stallId: string;
  stallName: string;
  violationType: ViolationType;
  status: ViolationStatus;
  createdAt: string;
  handledAt?: string;
  remark?: string;
  imageUrl?: string;
}

export interface WeighingRecord {
  id: string;
  stallId: string;
  stallName: string;
  inspectorId: string;
  recognizedWeight: number;
  standardWeight: number;
  errorRate: number;
  isViolation: boolean;
  recordTime: string;
  imageUrl?: string;
}

export type WarningType = 'high_violation' | 'high_loss';
export type WarningLevel = 'low' | 'medium' | 'high';

export interface Warning {
  id: string;
  stallId: string;
  stallName: string;
  warningType: WarningType;
  warningLevel: WarningLevel;
  violationCount: number;
  createdAt: string;
  isAcknowledged: boolean;
}

export interface DashboardStats {
  totalInspections: number;
  totalViolations: number;
  pendingViolations: number;
  activeWarnings: number;
  inspectionTrend: { date: string; count: number }[];
  violationTypeDistribution: { type: string; count: number }[];
  topViolationStalls: { name: string; count: number }[];
}

export interface MonthlyReport {
  month: string;
  totalInspections: number;
  totalViolations: number;
  resolvedRate: number;
  categoryLoss: { category: string; lossCount: number }[];
  stallCompliance: { name: string; complianceRate: number }[];
}
