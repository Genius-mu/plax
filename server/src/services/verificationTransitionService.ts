import { prisma } from '../db/prisma.js';
import { VerificationStatus } from '../domain/verification/verificationStatus.js';
import { VerificationStateMachine, InvalidVerificationTransitionError } from '../domain/verification/verificationStateMachine.js';

export interface TransitionOptions {
  actorId?: string;
  rejectionReason?: string;
  lastError?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export class VerificationTransitionService {
  /**
   * Centralized Domain Service to execute state transitions for Verifications.
   * Guarantees State Machine enforcement, organization ownership boundary, and atomic audit logging.
   */
  public static async transitionVerificationStatus(
    verificationId: string,
    organizationId: string,
    nextStatus: VerificationStatus,
    options: TransitionOptions = {}
  ) {
    const verification = await prisma.verification.findFirst({
      where: { id: verificationId, organizationId },
    });

    if (!verification) {
      throw new Error(`Verification with ID '${verificationId}' not found for tenant organization '${organizationId}'.`);
    }

    const currentStatus = verification.status as VerificationStatus;

    // 1. Assert State Machine Transition Rule
    VerificationStateMachine.assertValidTransition(currentStatus, nextStatus);

    const isTerminal = nextStatus === 'APPROVED' || nextStatus === 'REJECTED';

    // 2. Perform Atomic Database Transaction (Verification Status Update + Audit Log Event)
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.verification.update({
        where: { id: verificationId },
        data: {
          status: nextStatus,
          rejectionReason: options.rejectionReason || verification.rejectionReason,
          lastError: options.lastError !== undefined ? options.lastError : verification.lastError,
          completedAt: isTerminal ? new Date() : verification.completedAt,
          reviewerId: options.actorId || verification.reviewerId,
        },
        include: {
          customer: true,
          documents: true,
          riskSignals: true,
        },
      });

      await tx.auditLog.create({
        data: {
          organizationId,
          actorId: options.actorId || null,
          action: `VERIFICATION_TRANSITION_${nextStatus}`,
          targetType: 'VERIFICATION',
          targetId: verificationId,
          payload: JSON.stringify({
            previousStatus: currentStatus,
            newStatus: nextStatus,
            rejectionReason: options.rejectionReason || null,
            lastError: options.lastError || null,
            metadata: options.metadata || {},
          }),
          ipAddress: options.ipAddress || '127.0.0.1',
        },
      });

      return updated;
    });

    return result;
  }
}
