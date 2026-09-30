import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { AuditService } from '../services/auditService.js';

export async function getAuditLogsController(req: AuthenticatedRequest, res: Response) {
  try {
    const orgId = req.user?.organizationId || 'plax-default-org';
    const logs = await AuditService.getLogs(orgId, 50);
    res.json({ data: logs });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'FETCH_AUDIT_LOGS_FAILED', message: err.message } });
  }
}
