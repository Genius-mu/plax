import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { VerificationService } from '../services/verificationService.js';
import { getDefaultOrganizationId } from '../db/prisma.js';
import { z } from 'zod';

const createVerificationSchema = z.object({
  customerId: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  country: z.string().min(2),
  documentType: z.enum(['PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID', 'PROOF_OF_ADDRESS']),
  documentNumber: z.string().min(1),
  issueCountry: z.string().min(2),
  expiryDate: z.string().optional(),
  documentFrontUrl: z.string().default('docs/passport_front_mock.png'),
  selfieUrl: z.string().default('selfies/user_selfie_mock.png'),
  simulatedScenario: z.enum(['SUCCESS', 'EXPIRED_DOC', 'NAME_MISMATCH', 'LIVENESS_FAIL', 'HIGH_RISK_IP']).optional(),
});

const manualDecisionSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().optional(),
});

export async function createVerificationController(req: AuthenticatedRequest, res: Response) {
  try {
    const data = createVerificationSchema.parse(req.body);
    const orgId = await getDefaultOrganizationId(req.user?.organizationId);
    const result = await VerificationService.createAndProcessVerification(orgId, data as any);
    
    res.status(202).json({
      data: {
        id: result.id,
        status: result.status,
        message: 'Verification submitted successfully and queued for processing.',
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.errors } });
    }
    res.status(500).json({ error: { code: 'VERIFICATION_SUBMISSION_FAILED', message: err.message } });
  }
}

export async function listVerificationsController(req: AuthenticatedRequest, res: Response) {
  try {
    const orgId = await getDefaultOrganizationId(req.user?.organizationId);
    const query = {
      status: req.query.status as any,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };
    const result = await VerificationService.getVerifications(orgId, query);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: { code: 'FETCH_VERIFICATIONS_FAILED', message: err.message } });
  }
}

export async function getVerificationByIdController(req: AuthenticatedRequest, res: Response) {
  try {
    const orgId = await getDefaultOrganizationId(req.user?.organizationId);
    const verification = await VerificationService.getVerificationById(req.params.id, orgId);
    if (!verification) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Verification record not found.' } });
    }
    res.json({ data: verification });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'FETCH_VERIFICATION_FAILED', message: err.message } });
  }
}

export async function makeDecisionController(req: AuthenticatedRequest, res: Response) {
  try {
    const data = manualDecisionSchema.parse(req.body);
    const orgId = await getDefaultOrganizationId(req.user?.organizationId);
    const reviewerId = req.user?.userId || 'system-reviewer';
    
    const updated = await VerificationService.makeManualDecision(
      req.params.id,
      reviewerId,
      orgId,
      data.decision,
      data.reason
    );
    res.json({ data: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.errors } });
    }
    res.status(500).json({ error: { code: 'DECISION_FAILED', message: err.message } });
  }
}
