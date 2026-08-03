import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // 1. Mensagens Públicas - Manifestante (Com Protocolo e Senha)
  async sendPublicMessageFromReporter(
    protocol: string,
    trackingPassword: string,
    content: string,
  ) {
    if (!content || !content.trim()) {
      throw new BadRequestException('O conteúdo da mensagem é obrigatório');
    }

    const report = await this.prisma.report.findFirst({
      where: { protocol, deletedAt: null },
    });

    if (!report) {
      throw new NotFoundException('Manifestação não localizada');
    }

    const isMatch = await bcrypt.compare(
      trackingPassword,
      report.trackingPasswordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Senha de acompanhamento incorreta');
    }

    const message = await this.prisma.publicMessage.create({
      data: {
        reportId: report.id,
        senderType: 'REPORTER',
        content: content.trim(),
      },
    });

    await this.auditService.logAction({
      action: 'PUBLIC_MESSAGE_SENT',
      entity: 'PublicMessage',
      entityId: message.id,
      details: { protocol, senderType: 'REPORTER' },
    });

    return message;
  }

  async getPublicMessagesForReporter(protocol: string, trackingPassword: string) {
    const report = await this.prisma.report.findFirst({
      where: { protocol, deletedAt: null },
    });

    if (!report) {
      throw new NotFoundException('Manifestação não localizada');
    }

    const isMatch = await bcrypt.compare(
      trackingPassword,
      report.trackingPasswordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Senha de acompanhamento incorreta');
    }

    return this.prisma.publicMessage.findMany({
      where: { reportId: report.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        senderType: true,
        content: true,
        createdAt: true,
      },
    });
  }

  // 2. Mensagens Públicas - Administrador/Relator para o Manifestante
  async sendPublicMessageFromAdmin(
    reportId: string,
    adminUserId: string,
    content: string,
  ) {
    if (!content || !content.trim()) {
      throw new BadRequestException('O conteúdo da mensagem é obrigatório');
    }

    const report = await this.prisma.report.findFirst({
      where: { id: reportId, deletedAt: null },
    });

    if (!report) {
      throw new NotFoundException('Manifestação não localizada');
    }

    const message = await this.prisma.publicMessage.create({
      data: {
        reportId,
        senderType: 'ADMIN',
        senderUserId: adminUserId,
        content: content.trim(),
      },
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'PUBLIC_MESSAGE_SENT',
      entity: 'PublicMessage',
      entityId: message.id,
      details: { reportId, senderType: 'ADMIN' },
    });

    return message;
  }

  async getPublicMessagesForAdmin(reportId: string) {
    return this.prisma.publicMessage.findMany({
      where: { reportId },
      include: {
        senderUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  // 3. Comentários Internos Sigilosos da Apuração
  async createInternalComment(
    reportId: string,
    authorUserId: string,
    content: string,
    isConfidential = true,
  ) {
    if (!content || !content.trim()) {
      throw new BadRequestException('O conteúdo do comentário é obrigatório');
    }

    const report = await this.prisma.report.findFirst({
      where: { id: reportId, deletedAt: null },
    });

    if (!report) {
      throw new NotFoundException('Manifestação não localizada');
    }

    const comment = await this.prisma.internalComment.create({
      data: {
        reportId,
        authorUserId,
        content: content.trim(),
        isConfidential,
      },
    });

    await this.auditService.logAction({
      userId: authorUserId,
      action: 'INTERNAL_COMMENT_CREATED',
      entity: 'InternalComment',
      entityId: comment.id,
      details: { reportId, isConfidential },
    });

    return comment;
  }

  async getInternalComments(reportId: string) {
    return this.prisma.internalComment.findMany({
      where: { reportId },
      include: {
        authorUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 4. Templates de Resposta Rápida
  async getMessageTemplates() {
    try {
      const templates = await this.prisma.messageTemplate.findMany({
        where: { isActive: true },
        orderBy: { title: 'asc' },
      });
      if (templates.length > 0) return templates;
    } catch {
      // Fallback
    }

    return [
      {
        id: 'tmpl-1',
        title: 'Solicitação de Informações Complementares',
        subject: 'Complemento de informações necessário',
        content: 'Prezado(a) manifestante, para prosseguirmos com a análise da sua manifestação, solicitamos por gentileza que nos forneça mais detalhes sobre...',
        category: 'Triagem',
      },
      {
        id: 'tmpl-2',
        title: 'Notificação de Início de Apuração',
        subject: 'Sua manifestação foi admitida',
        content: 'Informamos que sua manifestação foi triada e encaminhada para a Comissão de Ética/Investigação Interna.',
        category: 'Tratativa',
      },
      {
        id: 'tmpl-3',
        title: 'Encerramento e Conclusão',
        subject: 'Manifestação Concluída',
        content: 'A apuração referente à sua manifestação foi concluída. Agradecemos a sua contribuição para o aprimoramento contínuo do Grupo Bairral.',
        category: 'Encerramento',
      },
    ];
  }
}
