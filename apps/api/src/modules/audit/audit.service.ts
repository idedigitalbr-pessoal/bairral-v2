import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logAction(params: {
    userId?: string;
    userEmail?: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          userId: params.userId || null,
          userEmail: params.userEmail || null,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId || null,
          details: params.details || {},
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
        },
      });
    } catch (error) {
      this.logger.error(`Falha ao registrar log de auditoria: ${(error as Error).message}`);
    }
  }

  async findAll(query?: { userId?: string; action?: string; limit?: number }) {
    const limit = query?.limit || 50;
    try {
      return await this.prisma.auditLog.findMany({
        where: {
          ...(query?.userId ? { userId: query.userId } : {}),
          ...(query?.action ? { action: { contains: query.action } } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch {
      return [];
    }
  }
}
