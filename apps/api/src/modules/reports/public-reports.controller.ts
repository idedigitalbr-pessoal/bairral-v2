import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportPublicDto } from './dto/create-report-public.dto';
import { TrackReportDto } from './dto/track-report.dto';

@ApiTags('Manifestações (Público)')
@Controller('public/reports')
export class PublicReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar uma nova manifestação (Público)' })
  @ApiResponse({ status: 201, description: 'Manifestação criada com sucesso' })
  async createReport(@Body() dto: CreateReportPublicDto) {
    return this.reportsService.createPublicReport(dto);
  }

  @Post('track')
  @ApiOperation({ summary: 'Acompanhar o andamento da manifestação com protocolo e senha' })
  @ApiResponse({ status: 200, description: 'Dados de acompanhamento da manifestação' })
  async trackReport(@Body() dto: TrackReportDto) {
    return this.reportsService.trackReport(dto);
  }

  @Get(':protocol')
  @ApiOperation({ summary: 'Consultar resumo da manifestação pelo protocolo' })
  async getPublicReport(@Param('protocol') protocol: string) {
    return this.reportsService.getPublicReportByProtocol(protocol);
  }
}
