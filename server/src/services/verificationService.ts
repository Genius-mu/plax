import { prisma } from '../db/prisma.js';
import { MockVerificationProvider } from '../providers/mockProvider.js';
import { RiskEngine } from '../engine/riskEngine.js'; // fallback handling or direct
import { AuditService } from './auditService.js';
import { VerificationSubmissionPayload, VerificationStatus } from '../types/index.js';

const mockProvider = new MockVerificationProvider();

export class VerificationService {
  /**
   * Submit new verification and trigger async job processing
   */
  public static async createAndProcessVerification(organizationId: string, payload: VerificationSubmissionPayload) {
    // 1. Ensure Customer exists or create customer record
    let customer = await prisma.customer.findFirst({
      where: { email: payload.email, organizationId },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          organizationId,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          country: payload.country,
        },
      });
    }

    // 2. Create Verification record (State: SUBMITTED)
    const verification = await prisma.verification.create({
      data: {
        organizationId,
        customerId: customer.id,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        documents: {
          create: [
            {
              type: payload.documentType,
              documentNumber: payload.documentNumber,
              issueCountry: payload.issueCountry,
              storageKey: payload.documentFrontUrl || 'docs/passport_front_mock.png',
              expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : null,
            },
          ],
        },
      },
      include: {
        customer: true,
        documents: true,
      },
    });

    // 3. Log Audit event
    await AuditService.logEvent({
      organizationId,
      action: 'VERIFICATION_SUBMITTED',
      targetType: 'VERIFICATION',
      targetId: verification.id,
      payload: { customerEmail: payload.email, docType: payload.documentType },
    });

    // 4. Trigger Asynchronous Background Job Processing (Non-blocking)
    this.processVerificationJobAsync(verification.id, organizationId, payload).catch((err) => {
      console.error(`Async worker job failed for verification ${verification.id}:`, err);
    });

    return verification;
  }

  /**
   * Async Worker Pipeline Step
   */
  private static async processVerificationJobAsync(verificationId: string, organizationId: string, payload: VerificationSubmissionPayload) {
    // Set status to PROCESSING
    await prisma.verification.update({
      where: { id: verificationId },
      data: { status: 'PROCESSING' },
    });

    // Step A: Provider OCR & Biometric execution
    const providerResult = await mockProvider.processVerification(payload);

    // Step B: Calculate Risk Engine scores
    const evaluatedRisk = RiskEngine.evaluate(providerResult.rawSignals, providerResult.faceMatchScore, providerResult.livenessPassed);

    // Step C: Persist Documents OCR status & Risk Signals
    await prisma.verificationDocument.updateMany({
      where: { verificationId },
      data: { ocrVerified: providerResult.ocrSuccess },
    });

    if (providerResult.rawSignals.length > 0) {
      await prisma.riskSignal.createMany({
        data: providerResult.rawSignals.map((sig) => ({
          verificationId,
          code: sig.code,
          severity: sig.severity,
          description: sig.description,
        })),
      });
    }

    // Step D: Finalize State Machine Transition
    const finalVerification = await prisma.verification.update({
      where: { id: verificationId },
      data: {
        status: evaluatedRisk.recommendedStatus,
        riskScore: evaluatedRisk.riskScore,
        riskLevel: evaluatedRisk.riskLevel,
        completedAt: evaluatedRisk.recommendedStatus !== 'MANUAL_REVIEW' ? new Date() : null,
      },
    });

    // Log Audit Event
    await AuditService.logEvent({
      organizationId,
      action: `VERIFICATION_AUTO_${evaluatedRisk.recommendedStatus}`,
      targetType: 'VERIFICATION',
      targetId: verificationId,
      payload: { riskScore: evaluatedRisk.riskScore, riskLevel: evaluatedRisk.riskLevel, signals: providerResult.rawSignals },
    });

    return finalVerification;
  }

  /**
   * Manual Reviewer Decision Transaction (Approve / Reject)
   */
  public static async makeManualDecision(verificationId: string, reviewerId: string, organizationId: string, decision: 'APPROVED' | 'REJECTED', reason?: string) {
    // Transactionally update status & log audit event
    return prisma.$transaction(async (tx) => {
      const updated = await tx.verification.update({
        where: { id: verificationId, organizationId },
        data: {
          status: decision,
          reviewerId,
          rejectionReason: reason || null,
          completedAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          organizationId,
          actorId: reviewerId,
          action: `VERIFICATION_MANUAL_${decision}`,
          targetType: 'VERIFICATION',
          targetId: verificationId,
          payload: JSON.stringify({ reviewerId, decision, reason }),
          ipAddress: '127.0.0.1',
        },
      });

      return updated;
    });
  }

  /**
   * Get filtered verifications list with pagination
   */
  public static async getVerifications(organizationId: string, query: { status?: VerificationStatus; search?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { organizationId };
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { customer: { firstName: { contains: query.search } } },
        { customer: { lastName: { contains: query.search } } },
        { customer: { email: { contains: query.search } } },
        { id: { contains: query.search } },
      ];
    }

    const [total, data] = await Promise.all([
      prisma.verification.count({ where }),
      prisma.verification.findMany({
        where,
        include: {
          customer: true,
          reviewer: { select: { id: true, fullName: true, email: true } },
          documents: true,
          riskSignals: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get verification by ID
   */
  public static async getVerificationById(id: string, organizationId: string) {
    return prisma.verification.findFirst({
      where: { id, organizationId },
      include: {
        customer: true,
        reviewer: { select: { id: true, fullName: true, email: true } },
        documents: true,
        riskSignals: true,
      },
    });
  }
}
