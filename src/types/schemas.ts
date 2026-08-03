import { z } from 'zod';
import {
  ReportTypeEnum,
  RegistrationTypeEnum,
  ReportStatusEnum,
  RiskLevelEnum,
  PriorityLevelEnum,
  MessageTypeEnum,
  PermissionEnum,
} from './enums';

import { AdminPermissionEnum } from './auth';

// ==========================================
// 1. SCHEMAS DE ENTIDADES BÁSICAS
// ==========================================

export const permissionSchema = z.nativeEnum(AdminPermissionEnum);

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  permissions: z.array(permissionSchema),
  isSystemRole: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Role = z.infer<typeof roleSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  roleId: z.string(),
  roleName: z.string(),
  unitId: z.string().optional(),
  unitName: z.string().optional(),
  departmentId: z.string().optional(),
  departmentName: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  avatarUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const unitSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  address: z.string(),
  managerId: z.string().optional(),
  managerName: z.string().optional(),
  active: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Unit = z.infer<typeof unitSchema>;

export const departmentSchema = z.object({
  id: z.string(),
  unitId: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  managerId: z.string().optional(),
  active: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Department = z.infer<typeof departmentSchema>;

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().default('CAT'),
  description: z.string(),
  defaultRiskLevel: z.nativeEnum(RiskLevelEnum).default(RiskLevelEnum.MEDIUM),
  slaDays: z.number().int().positive().default(7),
  active: z.boolean().default(true),
  reportCount: z.number().int().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Category = z.infer<typeof categorySchema>;

// ==========================================
// 2. SCHEMAS DE ESTRUTURAS DE MANIFESTAÇÃO
// ==========================================

export const reporterIdentitySchema = z.object({
  type: z.nativeEnum(RegistrationTypeEnum),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  relationshipToHospital: z.enum([
    'EMPLOYEE',
    'PATIENT',
    'FAMILY_MEMBER',
    'SUPPLIER',
    'COMMUNITY',
    'OTHER',
  ]).optional(),
});
export type ReporterIdentity = z.infer<typeof reporterIdentitySchema>;

export const attachmentSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
  url: z.string(),
  uploadedAt: z.string(),
  uploadedBy: z.string().optional(),
});
export type Attachment = z.infer<typeof attachmentSchema>;

export const assignmentSchema = z.object({
  id: z.string(),
  reportId: z.string(),
  assigneeId: z.string(),
  assigneeName: z.string(),
  assignedById: z.string(),
  assignedByName: z.string(),
  assignedAt: z.string(),
  note: z.string().optional(),
});
export type Assignment = z.infer<typeof assignmentSchema>;

export const statusHistorySchema = z.object({
  id: z.string(),
  reportId: z.string(),
  previousStatus: z.nativeEnum(ReportStatusEnum).optional(),
  newStatus: z.nativeEnum(ReportStatusEnum),
  changedById: z.string(),
  changedByName: z.string(),
  reason: z.string().optional(),
  changedAt: z.string(),
});
export type StatusHistory = z.infer<typeof statusHistorySchema>;

export const publicMessageSchema = z.object({
  id: z.string(),
  reportId: z.string(),
  senderType: z.enum(['REPORTER', 'COMMITTEE', 'SYSTEM']),
  senderName: z.string(),
  content: z.string(),
  attachments: z.array(attachmentSchema).default([]),
  createdAt: z.string(),
});
export type PublicMessage = z.infer<typeof publicMessageSchema>;

export const internalCommentSchema = z.object({
  id: z.string(),
  reportId: z.string(),
  authorId: z.string(),
  authorName: z.string(),
  authorRole: z.string(),
  content: z.string(),
  attachments: z.array(attachmentSchema).default([]),
  isPrivate: z.boolean().default(true),
  createdAt: z.string(),
});
export type InternalComment = z.infer<typeof internalCommentSchema>;

export const actionPlanSchema = z.object({
  id: z.string(),
  reportId: z.string(),
  title: z.string(),
  description: z.string(),
  responsibleId: z.string(),
  responsibleName: z.string(),
  dueDate: z.string(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('NOT_STARTED'),
  progressPercentage: z.number().min(0).max(100).default(0),
  completedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ActionPlan = z.infer<typeof actionPlanSchema>;

export const relatedPersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  department: z.string().optional(),
  involvementType: z.enum(['DENOUNCED', 'VICTIM', 'WITNESS', 'INVOLVED']),
  status: z.enum(['PENDING_INTERVIEW', 'INTERVIEWED', 'DISMISSED']).default('PENDING_INTERVIEW'),
  notes: z.string().optional(),
});
export type RelatedPerson = z.infer<typeof relatedPersonSchema>;

export const reportSchema = z.object({
  id: z.string(),
  protocol: z.string(),
  accessKey: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.nativeEnum(ReportTypeEnum),
  registrationType: z.nativeEnum(RegistrationTypeEnum),
  status: z.nativeEnum(ReportStatusEnum),
  riskLevel: z.nativeEnum(RiskLevelEnum),
  priorityLevel: z.nativeEnum(PriorityLevelEnum),
  categoryId: z.string(),
  categoryName: z.string(),
  unitId: z.string(),
  unitName: z.string(),
  departmentId: z.string().optional(),
  departmentName: z.string().optional(),
  reporter: reporterIdentitySchema,
  attachments: z.array(attachmentSchema).default([]),
  assignments: z.array(assignmentSchema).default([]),
  statusHistory: z.array(statusHistorySchema).default([]),
  publicMessages: z.array(publicMessageSchema).default([]),
  internalComments: z.array(internalCommentSchema).default([]),
  actionPlans: z.array(actionPlanSchema).default([]),
  relatedPeople: z.array(relatedPersonSchema).default([]),
  isRestricted: z.boolean().default(false),
  conflictDeclared: z.boolean().default(false),
  conflictNote: z.string().optional(),
  slaDueDate: z.string(),
  resolvedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Report = z.infer<typeof reportSchema>;

// ==========================================
// 3. AUDITORIA E DASHBOARD METRICS
// ==========================================

export const auditLogSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  userId: z.string(),
  userName: z.string(),
  userRole: z.string(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  details: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});
export type AuditLog = z.infer<typeof auditLogSchema>;

export const dashboardMetricsSchema = z.object({
  totalReports: z.number(),
  newInPeriod: z.number(),
  openReports: z.number(),
  completedReports: z.number(),
  criticalReports: z.number(),
  delayedReports: z.number(),
  assignedToMe: z.number(),
  avgTriageDays: z.number(),
  avgResolutionDays: z.number(),
  slaAdherencePercentage: z.number(),
  resolutionRate: z.number(),
  monthlyComparisonPercentage: z.number(),

  periodVolume: z.array(
    z.object({
      date: z.string(),
      label: z.string(),
      count: z.number().optional(),
      resolved: z.number().optional(),
      abertos: z.number().optional(),
      recentes: z.number().optional(),
      concluidas: z.number().optional(),
    })
  ),
  reportsByStatus: z.record(z.nativeEnum(ReportStatusEnum), z.number()),
  reportsByRisk: z.record(z.nativeEnum(RiskLevelEnum), z.number()),
  reportsByCategory: z.array(
    z.object({
      categoryId: z.string(),
      categoryName: z.string(),
      count: z.number(),
    })
  ),
  reportsByUnit: z.array(
    z.object({
      unitId: z.string(),
      unitName: z.string(),
      count: z.number(),
    })
  ),
  slaTrend: z.array(
    z.object({
      month: z.string(),
      slaPercentage: z.number(),
    })
  ),
  resolutivityTrend: z.array(
    z.object({
      month: z.string(),
      rate: z.number(),
    })
  ),
  registrationTypeDistribution: z.object({
    anonymous: z.number(),
    identified: z.number(),
  }),

  recentCriticalReports: z.array(
    z.object({
      id: z.string(),
      protocol: z.string(),
      title: z.string(),
      unitName: z.string(),
      categoryName: z.string(),
      createdAt: z.string(),
      status: z.nativeEnum(ReportStatusEnum),
      riskLevel: z.nativeEnum(RiskLevelEnum),
    })
  ),
  nearDeadlineReports: z.array(
    z.object({
      id: z.string(),
      protocol: z.string(),
      title: z.string(),
      slaDueDate: z.string(),
      unitName: z.string(),
      categoryName: z.string(),
      status: z.nativeEnum(ReportStatusEnum),
      daysRemaining: z.number(),
    })
  ),
  recentActivities: z.array(
    z.object({
      id: z.string(),
      userName: z.string(),
      userRole: z.string(),
      action: z.string(),
      details: z.string(),
      timestamp: z.string(),
    })
  ),
  delayedActionPlans: z.array(
    z.object({
      id: z.string(),
      reportId: z.string(),
      reportProtocol: z.string(),
      title: z.string(),
      responsibleName: z.string(),
      dueDate: z.string(),
      daysOverdue: z.number(),
      progressPercentage: z.number(),
    })
  ),
});
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>;

export const dashboardFiltersSchema = z.object({
  period: z.string().optional(),
  unitId: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.nativeEnum(ReportTypeEnum).optional(),
  status: z.nativeEnum(ReportStatusEnum).optional(),
  riskLevel: z.nativeEnum(RiskLevelEnum).optional(),
});
export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>;

// ==========================================
// 4. CONTRATOS DE PAGINAÇÃO, FILTROS E ORDENAÇÃO
// ==========================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});
export type PaginationParams = z.infer<typeof paginationSchema>;

export const sortSchema = z.object({
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type SortParams = z.infer<typeof sortSchema>;

export const reportFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.union([z.nativeEnum(ReportStatusEnum), z.array(z.nativeEnum(ReportStatusEnum))]).optional(),
  riskLevel: z.union([z.nativeEnum(RiskLevelEnum), z.array(z.nativeEnum(RiskLevelEnum))]).optional(),
  priorityLevel: z.union([z.nativeEnum(PriorityLevelEnum), z.array(z.nativeEnum(PriorityLevelEnum))]).optional(),
  type: z.nativeEnum(ReportTypeEnum).optional(),
  registrationType: z.nativeEnum(RegistrationTypeEnum).optional(),
  categoryId: z.string().optional(),
  unitId: z.string().optional(),
  assignedToMe: z.boolean().optional(),
  delayedOnly: z.boolean().optional(),
  criticalOnly: z.boolean().optional(),
  openOnly: z.boolean().optional(),
  completedOnly: z.boolean().optional(),
  recentOnly: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});
export type ReportFilters = z.infer<typeof reportFiltersSchema>;

export const auditLogFiltersSchema = z.object({
  search: z.string().optional(),
  userId: z.string().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  protocol: z.string().optional(),
  ipAddress: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});
export type AuditLogFilters = z.infer<typeof auditLogFiltersSchema>;

// ==========================================
// 5. SCHEMAS DE RESPOSTA E ERRO DA API
// ==========================================

export interface PaginatedMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});
export type ValidationErrorItem = z.infer<typeof validationErrorSchema>;

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    statusCode: z.number(),
    details: z.array(validationErrorSchema).optional(),
  }),
  timestamp: z.string(),
});
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
