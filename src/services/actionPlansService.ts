import { apiClient } from '../api/client';
import { ActionPlan } from '../types';
import { mockActionPlans } from '../mocks/data';

export interface ActionPlanExtended extends ActionPlan {
  reportProtocol?: string;
  reportTitle?: string;
  unitName?: string;
  categoryName?: string;
  daysOverdue?: number;
  validationNotes?: string;
  evidences?: Array<{ id: string; name: string; url: string; uploadedAt: string }>;
}

export interface CreateActionPlanDto {
  reportId?: string;
  title: string;
  description: string;
  responsibleId: string;
  responsibleName: string;
  dueDate: string;
}

export interface UpdateActionPlanDto {
  title?: string;
  description?: string;
  responsibleId?: string;
  responsibleName?: string;
  dueDate?: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  progressPercentage?: number;
  validationNotes?: string;
  evidences?: Array<{ id: string; name: string; url: string; uploadedAt: string }>;
}

export const actionPlansService = {
  getActionPlans: async (params?: Record<string, any>): Promise<ActionPlanExtended[]> => {
    try {
      return await apiClient.get<ActionPlanExtended[]>('/action-plans', { params });
    } catch (error) {
      console.warn('Usando planos de ação mockados:', error);
      let list = [...(mockActionPlans as ActionPlanExtended[])];
      if (params?.status && params.status !== 'ALL') {
        if (params.status === 'OVERDUE') {
          list = list.filter((p) => p.daysOverdue && p.daysOverdue > 0 && p.status !== 'COMPLETED');
        } else {
          list = list.filter((p) => p.status === params.status);
        }
      }
      if (params?.search) {
        const s = params.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            p.description?.toLowerCase().includes(s) ||
            p.responsibleName?.toLowerCase().includes(s) ||
            p.reportProtocol?.toLowerCase().includes(s)
        );
      }
      return list;
    }
  },

  getActionPlanById: async (id: string): Promise<ActionPlanExtended> => {
    try {
      return await apiClient.get<ActionPlanExtended>(`/action-plans/${id}`);
    } catch (error) {
      const found = mockActionPlans.find((p: any) => p.id === id) || mockActionPlans[0];
      return found as ActionPlanExtended;
    }
  },

  createActionPlan: async (data: CreateActionPlanDto): Promise<ActionPlanExtended> => {
    try {
      return await apiClient.post<ActionPlanExtended>('/action-plans', data);
    } catch (error) {
      const newPlan: ActionPlanExtended = {
        id: `ap-${Date.now()}`,
        reportId: data.reportId || 'rep-1',
        reportProtocol: 'GB-2026-NEW',
        title: data.title,
        description: data.description,
        responsibleId: data.responsibleId,
        responsibleName: data.responsibleName,
        dueDate: data.dueDate,
        status: 'NOT_STARTED',
        progressPercentage: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockActionPlans.unshift(newPlan as any);
      return newPlan;
    }
  },

  updateActionPlan: async (id: string, data: UpdateActionPlanDto): Promise<ActionPlanExtended> => {
    try {
      return await apiClient.put<ActionPlanExtended>(`/action-plans/${id}`, data);
    } catch (error) {
      const existingIndex = mockActionPlans.findIndex((p: any) => p.id === id);
      if (existingIndex !== -1) {
        mockActionPlans[existingIndex] = { ...mockActionPlans[existingIndex], ...data } as any;
        return mockActionPlans[existingIndex] as any;
      }
      return { id, ...data } as any;
    }
  },

  validateActionPlan: async (
    id: string,
    validation: { status: 'COMPLETED' | 'CANCELLED'; validationNotes: string }
  ): Promise<ActionPlanExtended> => {
    try {
      return await apiClient.post<ActionPlanExtended>(`/action-plans/${id}/validate`, validation);
    } catch (error) {
      const existingIndex = mockActionPlans.findIndex((p: any) => p.id === id);
      if (existingIndex !== -1) {
        mockActionPlans[existingIndex] = {
          ...mockActionPlans[existingIndex],
          status: validation.status,
          progressPercentage: validation.status === 'COMPLETED' ? 100 : mockActionPlans[existingIndex].progressPercentage,
          validationNotes: validation.validationNotes,
        } as any;
        return mockActionPlans[existingIndex] as any;
      }
      return { id, status: validation.status } as any;
    }
  },

};

