import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LocalStorageProvider } from '../../common/storage/storage.provider';

export interface CreateActionPlanDto {
  title: string;
  description?: string;
  responsibleUserId?: string;
  responsibleName?: string;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface UpdateActionPlanDto {
  title?: string;
  description?: string;
  responsibleUserId?: string;
  responsibleName?: string;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completionNotes?: string;
}

@Injectable()
export class ActionPlansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly storageProvider: LocalStorageProvider,
  ) {}

  async createActionPlan(
    reportId: string,
    createdByUserId: string,
    dto: CreateActionPlanDto,
  ) {
    const report = await this.prisma.report.findFirst({
      where: { id: reportId, deletedAt: null },
    });

    if (!report) {
      throw new NotFoundException('Manifestação não localizada');
    }

    const plan = await this.prisma.actionPlan.create({
      data: {
        reportId,
        createdByUserId,
        title: dto.title,
        description: dto.description || null,
        responsibleUserId: dto.responsibleUserId || null,
        responsibleName: dto.responsibleName || null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        priority: (dto.priority as any) || 'MEDIUM',
        status: 'OPEN',
      },
    });

    // Se a manifestação estiver em apuração, atualizar status para ACTION_PLAN se aplicável
    if (report.status === 'UNDER_INVESTIGATION' || report.status === 'UNDER_TRIAGE') {
      await this.prisma.report.update({
        where: { id: reportId },
        data: { status: 'ACTION_PLAN' },
      });
    }

    await this.auditService.logAction({
      userId: createdByUserId,
      action: 'ACTION_PLAN_CREATED',
      entity: 'ActionPlan',
      entityId: plan.id,
      details: { reportId, title: plan.title },
    });

    return plan;
  }

  async findByReport(reportId: string) {
    return this.prisma.actionPlan.findMany({
      where: { reportId },
      include: {
        responsibleUser: { select: { id: true, name: true, email: true } },
        createdByUser: { select: { id: true, name: true, email: true } },
        evidences: {
          include: {
            uploadedByUser: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateActionPlan(
    id: string,
    userId: string,
    dto: UpdateActionPlanDto,
  ) {
    const plan = await this.prisma.actionPlan.findUnique({ where: { id } });

    if (!plan) {
      throw new NotFoundException('Plano de ação não localizado');
    }

    const isCompleting = dto.status === 'COMPLETED';

    const updated = await this.prisma.actionPlan.update({
      where: { id },
      data: {
        ...(dto.title ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.responsibleUserId !== undefined ? { responsibleUserId: dto.responsibleUserId } : {}),
        ...(dto.responsibleName !== undefined ? { responsibleName: dto.responsibleName } : {}),
        ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
        ...(dto.priority ? { priority: dto.priority as any } : {}),
        ...(dto.status ? { status: dto.status as any } : {}),
        ...(dto.completionNotes !== undefined ? { completionNotes: dto.completionNotes } : {}),
        ...(isCompleting ? { completedAt: new Date() } : {}),
      },
    });

    await this.auditService.logAction({
      userId,
      action: 'ACTION_PLAN_UPDATED',
      entity: 'ActionPlan',
      entityId: id,
      details: dto,
    });

    return updated;
  }

  async uploadEvidence(
    actionPlanId: string,
    userId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    const plan = await this.prisma.actionPlan.findUnique({
      where: { id: actionPlanId },
    });

    if (!plan) {
      throw new NotFoundException('Plano de ação não localizado');
    }

    const saved = await this.storageProvider.saveFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    const evidence = await this.prisma.actionPlanEvidence.create({
      data: {
        actionPlanId,
        fileName: saved.fileName,
        originalName: saved.originalName,
        mimeType: saved.mimeType,
        fileSize: saved.fileSize,
        storagePath: saved.storagePath,
        uploadedByUserId: userId,
      },
    });

    await this.auditService.logAction({
      userId,
      action: 'ACTION_PLAN_EVIDENCE_UPLOADED',
      entity: 'ActionPlanEvidence',
      entityId: evidence.id,
      details: { actionPlanId, originalName: saved.originalName },
    });

    return evidence;
  }
}
