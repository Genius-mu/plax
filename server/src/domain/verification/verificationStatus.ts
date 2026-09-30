export type VerificationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PROCESSING'
  | 'OCR_SCANNING'
  | 'BIOMETRIC_MATCH'
  | 'RISK_SCORING'
  | 'APPROVED'
  | 'MANUAL_REVIEW'
  | 'REJECTED'
  | 'FAILED';

export const ALL_VERIFICATION_STATUSES: VerificationStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'PROCESSING',
  'OCR_SCANNING',
  'BIOMETRIC_MATCH',
  'RISK_SCORING',
  'APPROVED',
  'MANUAL_REVIEW',
  'REJECTED',
  'FAILED',
];

export const TERMINAL_VERIFICATION_STATUSES: VerificationStatus[] = [
  'APPROVED',
  'REJECTED',
];

export function isTerminalStatus(status: VerificationStatus): boolean {
  return TERMINAL_VERIFICATION_STATUSES.includes(status);
}
