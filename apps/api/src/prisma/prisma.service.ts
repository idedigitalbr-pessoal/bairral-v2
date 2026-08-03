import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      // Graceful fallback for initial foundation state without live MySQL server connection
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
