import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { FilterReportsQueryDto } from './dto/filter-reports-query.dto';
import { UpdateReportAdminDto } from './dto/update-report-admin.dto';
import { AssignReportDto } from './dto/assign-report.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Manifestações (Administrativo)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/reports')
export class AdminReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @RequirePermissions('VIEW_CASES')
  @ApiOperation({ summary: 'Listar manifestações com paginação, filtros e ordenação' })
  async findAll(@Query() query: FilterReportsQueryDto) {
    return this.reportsService.findAllAdmin(query);
  }

  @Get(':id')
  @RequirePermissions('VIEW_CASES')
  @ApiOperation({ summary: 'Obter detalhes completos da manifestação por ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    const permissions = user?.permissions || [];
    return this.reportsService.findOneAdmin(id, permissions);
  }

  @Patch(':id')
  @RequirePermissions('CHANGE_CLASSIFICATION')
  @ApiOperation({ summary: 'Atualizar classificação, risco, prioridade ou unidade da manifestação' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReportAdminDto,
    @CurrentUser('userId') currentUserId: string,
  ) {
    return this.reportsService.updateReportAdmin(id, dto, currentUserId || 'admin');
  }

  @Post(':id/assignments')
  @RequirePermissions('ASSIGN_CASES')
  @ApiOperation({ summary: 'Atribuir manifestação a um relator/investigador' })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignReportDto,
    @CurrentUser('userId') currentUserId: string,
  ) {
    return this.reportsService.assignReport(id, dto, currentUserId || 'admin');
  }

  @Post(':id/status')
  @RequirePermissions('CHANGE_STATUS')
  @ApiOperation({ summary: 'Alterar o status da manifestação com registro de histórico' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser('userId') currentUserId: string,
  ) {
    return this.reportsService.updateStatus(id, dto, currentUserId || 'admin');
  }
}
