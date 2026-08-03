import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LocalStorageProvider } from '../../common/storage/storage.provider';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageProvider: LocalStorageProvider,
    private readonly auditService: AuditService,
  ) {}

  async uploadPublicAttachment(
    protocol: string,
    trackingPassword: string,
    file: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    const report = await this.prisma.report.findFirst({
      where: { protocol, deletedAt: null },
      include: { attachments: true },
    });

    if (!report) {
      throw new NotFoundException('Manifestação não encontrada');
    }

    const isMatch = await bcrypt.compare(
      trackingPassword,
      report.trackingPasswordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Senha de acompanhamento incorreta');
    }

    if (report.attachments.length >= 10) {
      throw new BadRequestException('Limite máximo de 10 anexos por manifestação atingido');
    }

    const saved = await this.storageProvider.saveFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    const attachment = await this.prisma.attachment.create({
      data: {
        reportId: report.id,
        fileName: saved.fileName,
        originalName: saved.originalName,
        mimeType: saved.mimeType,
        fileSize: saved.fileSize,
        storagePath: saved.storagePath,
        isPublic: true,
      },
    });

    await this.auditService.logAction({
      action: 'PUBLIC_ATTACHMENT_UPLOADED',
      entity: 'Attachment',
      entityId: attachment.id,
      details: { reportProtocol: protocol, fileName: saved.originalName },
    });

    return {
      id: attachment.id,
      originalName: attachment.originalName,
      fileSize: attachment.fileSize,
      mimeType: attachment.mimeType,
      createdAt: attachment.createdAt,
    };
  }

  async uploadAdminAttachment(
    reportId: string,
    userId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string },
    isPublic: boolean = false,
  ) {
    const report = await this.prisma.report.findFirst({
      where: { id: reportId, deletedAt: null },
      include: { attachments: true },
    });

    if (!report) {
      throw new NotFoundException('Manifestação não encontrada');
    }

    if (report.attachments.length >= 10) {
      throw new BadRequestException('Limite máximo de 10 anexos por manifestação atingido');
    }

    const saved = await this.storageProvider.saveFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    const attachment = await this.prisma.attachment.create({
      data: {
        reportId: report.id,
        fileName: saved.fileName,
        originalName: saved.originalName,
        mimeType: saved.mimeType,
        fileSize: saved.fileSize,
        storagePath: saved.storagePath,
        uploadedByUserId: userId,
        isPublic,
      },
    });

    await this.auditService.logAction({
      userId,
      action: 'ADMIN_ATTACHMENT_UPLOADED',
      entity: 'Attachment',
      entityId: attachment.id,
      details: { reportId, fileName: saved.originalName, isPublic },
    });

    return attachment;
  }

  async findByReport(reportId: string) {
    return this.prisma.attachment.findMany({
      where: { reportId },
      include: {
        uploadedByUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDownloadPath(attachmentId: string, userId?: string, ipAddress?: string, userAgent?: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      throw new NotFoundException('Anexo não localizado');
    }

    const filePath = await this.storageProvider.getFilePath(attachment.storagePath);

    await this.auditService.logAction({
      userId,
      action: 'DOWNLOAD_ATTACHMENT',
      entity: 'Attachment',
      entityId: attachmentId,
      details: { originalName: attachment.originalName, reportId: attachment.reportId },
      ipAddress,
      userAgent,
    });

    return {
      filePath,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
    };
  }
}
