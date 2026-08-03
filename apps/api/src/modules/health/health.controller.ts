import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Verifica o status operacional da API e banco de dados' })
  @ApiResponse({ status: 200, description: 'Serviço operacional' })
  async getHealth() {
    return this.healthService.check();
  }
}
