import { apiClient } from '../api/client';
import { DashboardMetrics, DashboardFilters } from '../types';
import { mockDashboardMetrics } from '../mocks/data';

export const dashboardService = {
  getMetrics: async (filters?: DashboardFilters): Promise<DashboardMetrics> => {
    try {
      return await apiClient.get<DashboardMetrics>('/dashboard/metrics', {
        params: filters as Record<string, string | number | boolean | undefined>,
      });
    } catch (error) {
      console.warn('Usando dados mockados para o Dashboard devido a falha de rede/API:', error);
      return mockDashboardMetrics;
    }
  },
};

