import { useQuery } from '@tanstack/react-query';
import { auditService } from '../services/auditService';
import { queryKeys } from '../api/query-keys';
import { AuditLogFilters, PaginationParams } from '../types';

export function useAuditLogs(filters?: AuditLogFilters, pagination?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.auditLogs.list(filters, pagination),
    queryFn: () => auditService.getAuditLogs(filters, pagination),
  });
}
