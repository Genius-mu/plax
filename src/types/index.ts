export type Role = 'ADMIN' | 'REVIEWER' | 'CUSTOMER';
export type VerificationStatus = 'DRAFT' | 'SUBMITTED' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' | 'FAILED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DocumentType = 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID' | 'PROOF_OF_ADDRESS';
export type SignalSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  organizationId: string;
  organizationName?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  status: string;
  createdAt: string;
}

export interface VerificationDocument {
  id: string;
  verificationId: string;
  type: DocumentType;
  storageKey: string;
  issueCountry: string;
  documentNumber?: string;
  expiryDate?: string;
  ocrVerified: boolean;
  createdAt: string;
}

export interface RiskSignal {
  id: string;
  verificationId: string;
  code: string;
  severity: SignalSeverity;
  description: string;
  createdAt: string;
}

export interface Verification {
  id: string;
  organizationId: string;
  customerId: string;
  reviewerId?: string;
  status: VerificationStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  rejectionReason?: string;
  submittedAt?: string;
  completedAt?: string;
  createdAt: string;
  customer: Customer;
  reviewer?: { id: string; fullName: string; email: string };
  documents: VerificationDocument[];
  riskSignals: RiskSignal[];
}

export interface AuditLog {
  id: string;
  organizationId: string;
  actorId?: string;
  action: string;
  targetType: string;
  targetId: string;
  payload?: string;
  ipAddress?: string;
  createdAt: string;
  actor?: { id: string; fullName: string; email: string; role: Role };
}

export interface DashboardStats {
  total: number;
  approved: number;
  pending: number;
  failed: number;
  manualReview: number;
  totalCustomers: number;
  approvalRate: number;
}
