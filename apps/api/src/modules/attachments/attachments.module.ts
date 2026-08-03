import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { LocalStorageProvider } from '../../common/storage/storage.provider';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, LocalStorageProvider],
  exports: [AttachmentsService, LocalStorageProvider],
})
export class AttachmentsModule {}
