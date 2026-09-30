import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { prisma, getDefaultOrganizationId } from '../db/prisma.js';

export async function getDashboardStatsController(req: AuthenticatedRequest, res: Response) {
  try {
    const orgId = await getDefaultOrganizationId(req.user?.organizationId);

    const [total, approved, pending, failed, manualReview, totalCustomers] = await Promise.all([
      prisma.verification.count({ where: { organizationId: orgId } }),
      prisma.verification.count({ where: { organizationId: orgId, status: 'APPROVED' } }),
      prisma.verification.count({ where: { organizationId: orgId, status: { in: ['SUBMITTED', 'PROCESSING'] } } }),
      prisma.verification.count({ where: { organizationId: orgId, status: 'REJECTED' } }),
      prisma.verification.count({ where: { organizationId: orgId, status: 'MANUAL_REVIEW' } }),
      prisma.customer.count({ where: { organizationId: orgId } }),
    ]);

    const recentVerifications = await prisma.verification.findMany({
      where: { organizationId: orgId },
      include: {
        customer: true,
        riskSignals: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    res.json({
      data: {
        stats: {
          total,
          approved,
          pending,
          failed,
          manualReview,
          totalCustomers,
          approvalRate: total > 0 ? Math.round((approved / total) * 100) : 100,
        },
        recentVerifications,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'DASHBOARD_STATS_FAILED', message: err.message } });
  }
}
