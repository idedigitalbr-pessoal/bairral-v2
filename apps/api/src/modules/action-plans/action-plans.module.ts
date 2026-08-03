import { Module } from '@nestjs/common';
import { ActionPlansService } from './action-plans.service';
import { ActionPlansController } from './action-plans.controller';
import { LocalStorageProvider } from '../../common/storage/storage.provider';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [ActionPlansController],
  providers: [ActionPlansService, LocalStorageProvider],
  exports: [ActionPlansService],
})
export class ActionPlansModule {}
