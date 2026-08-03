export enum ReportTypeEnum {
  DENUNCIA = 'DENUNCIA',
  ELOGIO = 'ELOGIO',
  SUGESTAO = 'SUGESTAO',
  RECLAMACAO = 'RECLAMACAO',
  DUVIDA = 'DUVIDA',
}
export type ReportType = `${ReportTypeEnum}`;

export enum RegistrationTypeEnum {
  ANONYMOUS = 'ANONYMOUS',
  IDENTIFIED = 'IDENTIFIED',
}
export type RegistrationType = `${RegistrationTypeEnum}`;

export enum ReportStatusEnum {
  RECEIVED = 'RECEIVED',
  TRIAGE = 'TRIAGE',
  PENDING_INFO = 'PENDING_INFO',
  ANALYSIS = 'ANALYSIS',
  INVESTIGATION = 'INVESTIGATION',
  FORWARDED = 'FORWARDED',
  ACTION_PLAN = 'ACTION_PLAN',
  RESOLVED = 'RESOLVED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  REOPENED = 'REOPENED',
}
export type ReportStatus = `${ReportStatusEnum}`;

export enum RiskLevelEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}
export type RiskLevel = `${RiskLevelEnum}`;

export enum PriorityLevelEnum {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}
export type PriorityLevel = `${PriorityLevelEnum}`;

export enum MessageTypeEnum {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  SYSTEM = 'SYSTEM',
}
export type MessageType = `${MessageTypeEnum}`;

export enum PermissionEnum {
  READ_REPORTS = 'READ_REPORTS',
  WRITE_REPORTS = 'WRITE_REPORTS',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  MANAGE_CATEGORIES = 'MANAGE_CATEGORIES',
  MANAGE_UNITS = 'MANAGE_UNITS',
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  MANAGE_ACTION_PLANS = 'MANAGE_ACTION_PLANS',
}
export type Permission = `${PermissionEnum}`;
