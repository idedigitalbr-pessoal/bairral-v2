import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check() {
    let dbStatus = 'disconnected';
    try {
      // Tenta ping básico no banco
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'standby';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'Bairral Canal de Ética - Backend API',
      version: '1.0.0',
      database: {
        status: dbStatus,
        provider: 'mysql',
      },
    };
  }
}
