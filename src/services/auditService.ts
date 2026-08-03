import { apiClient } from '../api/client';
import { AuditLog, AuditLogFilters, PaginationParams, PaginatedResponse } from '../types';
import { mockAuditLogs } from '../mocks/data';

export const auditService = {
  getAuditLogs: async (
    filters?: AuditLogFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<AuditLog>> => {
    try {
      return await apiClient.get<PaginatedResponse<AuditLog>>('/audit-logs', {
        params: {
          ...filters,
          page: pagination?.page,
          limit: pagination?.limit,
        },
      });
    } catch (error) {
      console.warn('Usando logs de auditoria mockados:', error);
      let list = [...mockAuditLogs];

      if (filters?.search) {
        const s = filters.search.toLowerCase();
        list = list.filter(
          (l) =>
            l.action.toLowerCase().includes(s) ||
            l.details.toLowerCase().includes(s) ||
            l.userName.toLowerCase().includes(s)
        );
      }

      if (filters?.userId) {
        list = list.filter((l) => l.userId === filters.userId);
      }

      if (filters?.resource) {
        list = list.filter((l) => l.resource === filters.resource);
      }

      if (filters?.ipAddress) {
        list = list.filter((l) => l.ipAddress?.includes(filters.ipAddress!));
      }

      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedData = list.slice(startIndex, startIndex + limit);

      return {
        data: paginatedData,
        meta: {
          page,
          limit,
          totalItems: total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    }
  },
};

