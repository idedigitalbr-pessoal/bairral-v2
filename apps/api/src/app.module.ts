import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';

// Modules
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ReportsModule } from './modules/reports/reports.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UnitsModule } from './modules/units/units.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { ActionPlansModule } from './modules/action-plans/action-plans.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuditModule } from './modules/audit/audit.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ReportsModule,
    CategoriesModule,
    UnitsModule,
    DepartmentsModule,
    AttachmentsModule,
    MessagesModule,
    AssignmentsModule,
    ActionPlansModule,
    NotificationsModule,
    DashboardModule,
    AuditModule,
    SettingsModule,
  ],
})
export class AppModule {}
