// NOTA DE ARQUITETURA:
// A autorização e verificação de tokens JWT definitivas serão realizadas no backend NestJS em produção.
// As permissões e perfis abaixo são simulados no frontend/MSW para controle de interface.

export enum AdminRoleEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ETHICS_MANAGER = 'ETHICS_MANAGER',
  TRIAGE_ANALYST = 'TRIAGE_ANALYST',
  INVESTIGATOR = 'INVESTIGATOR',
  AREA_RESPONSIBLE = 'AREA_RESPONSIBLE',
  AUDITOR = 'AUDITOR',
  EXECUTIVE_VIEWER = 'EXECUTIVE_VIEWER',
}
export type AdminRole = `${AdminRoleEnum}`;

export enum AdminPermissionEnum {
  VIEW_CASES = 'VIEW_CASES',
  VIEW_REPORTS = 'VIEW_CASES',
  VIEW_SENSITIVE_REPORTS = 'VIEW_IDENTITY',
  VIEW_IDENTITY = 'VIEW_IDENTITY',
  CHANGE_CLASSIFICATION = 'CHANGE_CLASSIFICATION',
  CLASSIFY_REPORT = 'CHANGE_CLASSIFICATION',
  ASSIGN_CASES = 'ASSIGN_CASES',
  ASSIGN_RESPONSIBLE = 'ASSIGN_CASES',
  CHANGE_STATUS = 'CHANGE_STATUS',
  CHANGE_RISK_PRIORITY = 'CHANGE_CLASSIFICATION',
  ACCESS_ATTACHMENTS = 'ACCESS_ATTACHMENTS',
  SEND_MESSAGES = 'SEND_MESSAGES',
  REQUEST_INFO = 'SEND_MESSAGES',
  SEND_PUBLIC_MESSAGE = 'SEND_MESSAGES',
  ADD_INTERNAL_COMMENTS = 'ADD_INTERNAL_COMMENTS',
  ADD_INTERNAL_COMMENT = 'ADD_INTERNAL_COMMENTS',
  CREATE_ACTION_PLAN = 'CREATE_ACTION_PLAN',
  MANAGE_ACTION_PLANS = 'CREATE_ACTION_PLAN',
  CONCLUDE_CASE = 'CONCLUDE_CASE',
  REOPEN_CASE = 'REOPEN_CASE',
  RESTRICT_ACCESS = 'CONCLUDE_CASE',
  EXPORT_DATA = 'EXPORT_DATA',
  ACCESS_AUDIT = 'ACCESS_AUDIT',
  VIEW_AUDIT_LOGS = 'ACCESS_AUDIT',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ROLES = 'MANAGE_USERS',
  MANAGE_CATEGORIES = 'MANAGE_SETTINGS',
  MANAGE_UNITS = 'MANAGE_SETTINGS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
}
export type AdminPermission = `${AdminPermissionEnum}`;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleName: string;
  unitId?: string;
  unitName?: string;
  departmentId?: string;
  departmentName?: string;
  permissions: AdminPermission[];
  avatarUrl?: string;
  mustChangePassword?: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  [AdminRoleEnum.SUPER_ADMIN]: Object.values(AdminPermissionEnum),
  [AdminRoleEnum.ETHICS_MANAGER]: Object.values(AdminPermissionEnum),
  [AdminRoleEnum.TRIAGE_ANALYST]: [
    AdminPermissionEnum.VIEW_CASES,
    AdminPermissionEnum.CHANGE_CLASSIFICATION,
    AdminPermissionEnum.ASSIGN_CASES,
    AdminPermissionEnum.CHANGE_STATUS,
    AdminPermissionEnum.ACCESS_ATTACHMENTS,
    AdminPermissionEnum.SEND_MESSAGES,
    AdminPermissionEnum.ADD_INTERNAL_COMMENTS,
  ],
  [AdminRoleEnum.INVESTIGATOR]: [
    AdminPermissionEnum.VIEW_CASES,
    AdminPermissionEnum.ACCESS_ATTACHMENTS,
    AdminPermissionEnum.SEND_MESSAGES,
    AdminPermissionEnum.ADD_INTERNAL_COMMENTS,
    AdminPermissionEnum.CREATE_ACTION_PLAN,
    AdminPermissionEnum.CHANGE_STATUS,
  ],
  [AdminRoleEnum.AREA_RESPONSIBLE]: [
    AdminPermissionEnum.VIEW_CASES,
    AdminPermissionEnum.ACCESS_ATTACHMENTS,
    AdminPermissionEnum.ADD_INTERNAL_COMMENTS,
    AdminPermissionEnum.CREATE_ACTION_PLAN,
  ],
  [AdminRoleEnum.AUDITOR]: [
    AdminPermissionEnum.VIEW_CASES,
    AdminPermissionEnum.VIEW_IDENTITY,
    AdminPermissionEnum.ACCESS_ATTACHMENTS,
    AdminPermissionEnum.EXPORT_DATA,
    AdminPermissionEnum.ACCESS_AUDIT,
  ],
  [AdminRoleEnum.EXECUTIVE_VIEWER]: [
    AdminPermissionEnum.VIEW_CASES,
    AdminPermissionEnum.EXPORT_DATA,
  ],
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  [AdminRoleEnum.SUPER_ADMIN]: 'Superadministrador',
  [AdminRoleEnum.ETHICS_MANAGER]: 'Gestor de Ética',
  [AdminRoleEnum.TRIAGE_ANALYST]: 'Analista de Triagem',
  [AdminRoleEnum.INVESTIGATOR]: 'Investigador',
  [AdminRoleEnum.AREA_RESPONSIBLE]: 'Responsável por Área',
  [AdminRoleEnum.AUDITOR]: 'Auditor de Integridade',
  [AdminRoleEnum.EXECUTIVE_VIEWER]: 'Visualizador Executivo',
};
