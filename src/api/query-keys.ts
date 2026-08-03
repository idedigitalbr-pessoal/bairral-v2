import { ReportFilters, AuditLogFilters, PaginationParams, SortParams } from '../types';

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    metrics: () => [...queryKeys.dashboard.all, 'metrics'] as const,
  },
  reports: {
    all: ['reports'] as const,
    list: (filters?: ReportFilters, pagination?: PaginationParams, sort?: SortParams) =>
      [...queryKeys.reports.all, 'list', { filters, pagination, sort }] as const,
    detail: (id: string) => [...queryKeys.reports.all, 'detail', id] as const,
  },
  publicReports: {
    all: ['public-reports'] as const,
    track: (protocol: string) => [...queryKeys.publicReports.all, 'track', protocol] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.categories.all, 'detail', id] as const,
  },
  units: {
    all: ['units'] as const,
    list: () => [...queryKeys.units.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.units.all, 'detail', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: (search?: string) => [...queryKeys.users.all, 'list', { search }] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },
  roles: {
    all: ['roles'] as const,
    list: () => [...queryKeys.roles.all, 'list'] as const,
  },
  actionPlans: {
    all: ['action-plans'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.actionPlans.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.actionPlans.all, 'detail', id] as const,
  },
  departments: {
    all: ['departments'] as const,
    list: (unitId?: string) => [...queryKeys.departments.all, 'list', { unitId }] as const,
  },
  settings: {
    all: ['settings'] as const,
    get: () => [...queryKeys.settings.all, 'get'] as const,
  },
  auditLogs: {
    all: ['audit-logs'] as const,
    list: (filters?: AuditLogFilters, pagination?: PaginationParams) =>
      [...queryKeys.auditLogs.all, 'list', { filters, pagination }] as const,
  },
};
