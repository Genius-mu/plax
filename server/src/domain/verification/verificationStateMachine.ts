import { VerificationStatus, ALL_VERIFICATION_STATUSES } from './verificationStatus.js';

export class InvalidVerificationTransitionError extends Error {
  public readonly currentStatus: VerificationStatus;
  public readonly targetStatus: VerificationStatus;

  constructor(currentStatus: VerificationStatus, targetStatus: VerificationStatus) {
    super(`Invalid verification state transition: '${currentStatus}' -> '${targetStatus}' is not allowed.`);
    this.name = 'InvalidVerificationTransitionError';
    this.currentStatus = currentStatus;
    this.targetStatus = targetStatus;
  }
}

/**
 * Authoritative State Transition Graph for Plax ID Verification Lifecycle
 */
const VALID_TRANSITIONS: Record<VerificationStatus, VerificationStatus[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['PROCESSING'],
  PROCESSING: ['OCR_SCANNING', 'FAILED'],
  OCR_SCANNING: ['BIOMETRIC_MATCH', 'FAILED'],
  BIOMETRIC_MATCH: ['RISK_SCORING', 'FAILED'],
  RISK_SCORING: ['APPROVED', 'MANUAL_REVIEW', 'REJECTED', 'FAILED'],
  MANUAL_REVIEW: ['APPROVED', 'REJECTED'],
  FAILED: ['PROCESSING'], // Controlled worker retry transition path
  APPROVED: [],          // Immutable Terminal State
  REJECTED: [],          // Immutable Terminal State
};

export class VerificationStateMachine {
  /**
   * Returns true if transition from currentStatus to nextStatus is allowed by domain rules.
   */
  public static canTransition(currentStatus: VerificationStatus, nextStatus: VerificationStatus): boolean {
    if (!ALL_VERIFICATION_STATUSES.includes(currentStatus) || !ALL_VERIFICATION_STATUSES.includes(nextStatus)) {
      return false;
    }
    const allowedTargets = VALID_TRANSITIONS[currentStatus] || [];
    return allowedTargets.includes(nextStatus);
  }

  /**
   * Asserts that transition is valid. Throws InvalidVerificationTransitionError if forbidden.
   */
  public static assertValidTransition(currentStatus: VerificationStatus, nextStatus: VerificationStatus): void {
    if (!this.canTransition(currentStatus, nextStatus)) {
      throw new InvalidVerificationTransitionError(currentStatus, nextStatus);
    }
  }

  /**
   * Helper to get all valid target states from a current state
   */
  public static getValidNextStates(currentStatus: VerificationStatus): VerificationStatus[] {
    return VALID_TRANSITIONS[currentStatus] || [];
  }
}
