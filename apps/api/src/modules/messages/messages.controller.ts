import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MessagesService } from './messages.service';

export class SendPublicMessageDto {
  @ApiProperty({ example: 'SenhaForte@123', description: 'Senha do manifestante (se rota pública)' })
  @IsString()
  @IsOptional()
  trackingPassword?: string;

  @ApiProperty({ example: 'Tenho uma informação adicional sobre a data...' })
  @IsString()
  @IsNotEmpty({ message: 'Conteúdo da mensagem é obrigatório' })
  content!: string;
}

export class CreateInternalCommentDto {
  @ApiProperty({ example: 'Reunião do comitê de ética agendada para análise de evidências.' })
  @IsString()
  @IsNotEmpty({ message: 'Conteúdo do comentário é obrigatório' })
  content!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isConfidential?: boolean;
}

@ApiTags('Mensagens e Comunicação')
@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // --- ROTAS PÚBLICAS DO MANIFESTANTE ---

  @Post('public/reports/:protocol/messages')
  @ApiOperation({ summary: 'Enviar mensagem para a comissão via protocolo e senha' })
  async sendReporterMessage(
    @Param('protocol') protocol: string,
    @Body() dto: SendPublicMessageDto,
  ) {
    if (!dto.trackingPassword) {
      throw new BadRequestException('Senha de acompanhamento é obrigatória');
    }
    return this.messagesService.sendPublicMessageFromReporter(
      protocol,
      dto.trackingPassword,
      dto.content,
    );
  }

  @Post('public/reports/:protocol/messages/list')
  @ApiOperation({ summary: 'Listar mensagens públicas da manifestação via senha' })
  async getReporterMessages(
    @Param('protocol') protocol: string,
    @Body('trackingPassword') trackingPassword: string,
  ) {
    if (!trackingPassword) {
      throw new BadRequestException('Senha de acompanhamento é obrigatória');
    }
    return this.messagesService.getPublicMessagesForReporter(
      protocol,
      trackingPassword,
    );
  }

  // --- ROTAS ADMINISTRATIVAS ---

  @Post('admin/reports/:id/messages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('SEND_MESSAGES')
  @ApiOperation({ summary: 'Enviar mensagem pública para o manifestante' })
  async sendAdminMessage(
    @Param('id') reportId: string,
    @Body() dto: SendPublicMessageDto,
    @CurrentUser('userId') currentUserId: string,
  ) {
    return this.messagesService.sendPublicMessageFromAdmin(
      reportId,
      currentUserId || 'admin',
      dto.content,
    );
  }

  @Get('admin/reports/:id/messages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('VIEW_CASES')
  @ApiOperation({ summary: 'Obter histórico de mensagens públicas do caso' })
  async getAdminMessages(@Param('id') reportId: string) {
    return this.messagesService.getPublicMessagesForAdmin(reportId);
  }

  @Post('admin/reports/:id/comments')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('ADD_INTERNAL_COMMENTS')
  @ApiOperation({ summary: 'Adicionar comentário interno sigiloso para a apuração' })
  async createInternalComment(
    @Param('id') reportId: string,
    @Body() dto: CreateInternalCommentDto,
    @CurrentUser('userId') currentUserId: string,
  ) {
    return this.messagesService.createInternalComment(
      reportId,
      currentUserId || 'admin',
      dto.content,
      dto.isConfidential ?? true,
    );
  }

  @Get('admin/reports/:id/comments')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('VIEW_CASES')
  @ApiOperation({ summary: 'Listar comentários internos do caso' })
  async getInternalComments(@Param('id') reportId: string) {
    return this.messagesService.getInternalComments(reportId);
  }

  @Get('admin/message-templates')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar modelos de mensagem predefinidos (Templates)' })
  async getTemplates() {
    return this.messagesService.getMessageTemplates();
  }
}
