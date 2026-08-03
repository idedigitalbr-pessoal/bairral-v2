import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { PublicReportsController } from './public-reports.controller';
import { AdminReportsController } from './admin-reports.controller';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [PublicReportsController, AdminReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
