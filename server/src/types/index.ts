export type Role = 'ADMIN' | 'REVIEWER' | 'CUSTOMER';
export type VerificationStatus = 'DRAFT' | 'SUBMITTED' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' | 'FAILED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DocumentType = 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID' | 'PROOF_OF_ADDRESS';
export type SignalSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface UserSession {
  userId: string;
  email: string;
  role: Role;
  organizationId: string;
  fullName: string;
}

export interface VerificationProviderResult {
  ocrSuccess: boolean;
  documentNumber?: string;
  extractedFirstName?: string;
  extractedLastName?: string;
  extractedExpiryDate?: string;
  livenessPassed: boolean;
  faceMatchScore: number; // 0 to 100
  rawSignals: Array<{
    code: string;
    severity: SignalSeverity;
    description: string;
  }>;
}

export interface VerificationSubmissionPayload {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  documentType: DocumentType;
  documentNumber: string;
  issueCountry: string;
  expiryDate?: string;
  documentFrontUrl: string;
  selfieUrl: string;
  simulatedScenario?: 'SUCCESS' | 'EXPIRED_DOC' | 'NAME_MISMATCH' | 'LIVENESS_FAIL' | 'HIGH_RISK_IP';
}
