import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AttachmentsService } from './attachments.service';

@ApiTags('Anexos e Evidências')
@Controller()
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('public/reports/:protocol/attachments')
  @ApiOperation({ summary: 'Enviar anexo/evidência pública para manifestação' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPublicAttachment(
    @Param('protocol') protocol: string,
    @Body('trackingPassword') trackingPassword: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }
    if (!trackingPassword) {
      throw new BadRequestException('Senha de acompanhamento é obrigatória');
    }
    return this.attachmentsService.uploadPublicAttachment(
      protocol,
      trackingPassword,
      file,
    );
  }

  @Post('admin/reports/:id/attachments')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('ACCESS_ATTACHMENTS')
  @ApiOperation({ summary: 'Upload de anexo administrativo/sigiloso pelo investigador' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAdminAttachment(
    @Param('id') reportId: string,
    @Body('isPublic') isPublic: string,
    @UploadedFile() file: any,
    @CurrentUser('userId') currentUserId: string,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }
    const isPublicBool = isPublic === 'true' || isPublic === '1';
    return this.attachmentsService.uploadAdminAttachment(
      reportId,
      currentUserId || 'admin',
      file,
      isPublicBool,
    );
  }

  @Get('admin/reports/:id/attachments')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('ACCESS_ATTACHMENTS')
  @ApiOperation({ summary: 'Listar anexos da manifestação' })
  async getReportAttachments(@Param('id') reportId: string) {
    return this.attachmentsService.findByReport(reportId);
  }

  @Get('admin/attachments/:id/download')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('ACCESS_ATTACHMENTS')
  @ApiOperation({ summary: 'Download seguro de anexo com auditoria' })
  async downloadAttachment(
    @Param('id') id: string,
    @CurrentUser('userId') currentUserId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { filePath, originalName, mimeType } =
      await this.attachmentsService.getDownloadPath(
        id,
        currentUserId,
        req.ip,
        req.headers['user-agent'],
      );

    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(originalName)}"`,
    );
    res.sendFile(filePath);
  }
}
