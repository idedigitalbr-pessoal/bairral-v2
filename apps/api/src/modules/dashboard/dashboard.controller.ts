import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard e Indicadores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @RequirePermissions('VIEW_DASHBOARD')
  @ApiOperation({ summary: 'Obter indicadores, KPIs, SLA e estatísticas consolidadas do Canal de Denúncias' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data inicial YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data final YYYY-MM-DD' })
  @ApiQuery({ name: 'unitId', required: false, description: 'Filtro por unidade' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filtro por categoria' })
  async getMetrics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('unitId') unitId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.dashboardService.getMetrics({
      startDate,
      endDate,
      unitId,
      categoryId,
    });
  }
}
