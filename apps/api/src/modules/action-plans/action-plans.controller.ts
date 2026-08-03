import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty, ApiPropertyOptional, ApiConsumes } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ActionPlansService } from './action-plans.service';

export enum ActionPlanPriorityDtoEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ActionPlanStatusDtoEnum {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateActionPlanDtoReq {
  @ApiProperty({ example: 'Implementar novo protocolo de checagem na recepção' })
  @IsString()
  @IsNotEmpty({ message: 'Título do plano de ação é obrigatório' })
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  responsibleUserId?: string;

  @ApiPropertyOptional({ example: 'Carlos Eduardo - Gerente' })
  @IsString()
  @IsOptional()
  responsibleName?: string;

  @ApiPropertyOptional({ example: '2026-09-15T00:00:00.000Z' })
  @IsString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ enum: ActionPlanPriorityDtoEnum })
  @IsEnum(ActionPlanPriorityDtoEnum)
  @IsOptional()
  priority?: ActionPlanPriorityDtoEnum;
}

export class UpdateActionPlanDtoReq {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  responsibleUserId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  responsibleName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ enum: ActionPlanPriorityDtoEnum })
  @IsEnum(ActionPlanPriorityDtoEnum)
  @IsOptional()
  priority?: ActionPlanPriorityDtoEnum;

  @ApiPropertyOptional({ enum: ActionPlanStatusDtoEnum })
  @IsEnum(ActionPlanStatusDtoEnum)
  @IsOptional()
  status?: ActionPlanStatusDtoEnum;

  @ApiPropertyOptional({ example: 'Treinamento ministrado para toda a equipe em 20/08.' })
  @IsString()
  @IsOptional()
  completionNotes?: string;
}

@ApiTags('Planos de Ação')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin')
export class ActionPlansController {
  constructor(private readonly actionPlansService: ActionPlansService) {}

  @Post('reports/:id/action-plans')
  @RequirePermissions('CREATE_ACTION_PLAN')
  @ApiOperation({ summary: 'Criar plano de ação para a manifestação' })
  async createActionPlan(
    @Param('id') reportId: string,
    @Body() dto: CreateActionPlanDtoReq,
    @CurrentUser('userId') currentUserId: string,
  ) {
    return this.actionPlansService.createActionPlan(
      reportId,
      currentUserId || 'admin',
      dto,
    );
  }

  @Get('reports/:id/action-plans')
  @RequirePermissions('VIEW_CASES')
  @ApiOperation({ summary: 'Listar planos de ação de uma manifestação' })
  async getReportActionPlans(@Param('id') reportId: string) {
    return this.actionPlansService.findByReport(reportId);
  }

  @Patch('action-plans/:id')
  @RequirePermissions('CREATE_ACTION_PLAN')
  @ApiOperation({ summary: 'Atualizar plano de ação (status, prazo, responsável, conclusão)' })
  async updateActionPlan(
    @Param('id') id: string,
    @Body() dto: UpdateActionPlanDtoReq,
    @CurrentUser('userId') currentUserId: string,
  ) {
    return this.actionPlansService.updateActionPlan(
      id,
      currentUserId || 'admin',
      dto,
    );
  }

  @Post('action-plans/:id/evidences')
  @RequirePermissions('CREATE_ACTION_PLAN')
  @ApiOperation({ summary: 'Upload de evidência de conclusão do plano de ação' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEvidence(
    @Param('id') actionPlanId: string,
    @UploadedFile() file: any,
    @CurrentUser('userId') currentUserId: string,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo de evidência é obrigatório');
    }
    return this.actionPlansService.uploadEvidence(
      actionPlanId,
      currentUserId || 'admin',
      file,
    );
  }
}
