import { prisma } from '../db/prisma.js';

export class AuditService {
  public static async logEvent(params: {
    organizationId: string;
    actorId?: string;
    action: string;
    targetType: string;
    targetId: string;
    payload?: Record<string, any>;
    ipAddress?: string;
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          organizationId: params.organizationId,
          actorId: params.actorId || null,
          action: params.action,
          targetType: params.targetType,
          targetId: params.targetId,
          payload: params.payload ? JSON.stringify(params.payload) : null,
          ipAddress: params.ipAddress || '127.0.0.1',
        },
      });
    } catch (err) {
      console.error('Failed to log audit event:', err);
    }
  }

  public static async getLogs(organizationId: string, limit = 50) {
    return prisma.auditLog.findMany({
      where: { organizationId },
      include: {
        actor: {
          select: { id: true, fullName: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
