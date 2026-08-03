import { apiClient } from '../api/client';
import { mockReports } from '../mocks/data';
import {
  Report,
  ReportFilters,
  PaginationParams,
  SortParams,
  PaginatedResponse,
  PublicMessage,
  InternalComment,
  ActionPlan,
  Attachment,
  RelatedPerson,
  AuditLog,
  RiskLevelEnum,
  ReportStatusEnum,
} from '../types';

export const reportsService = {
  getReports: async (
    filters?: ReportFilters,
    pagination?: PaginationParams,
    sort?: SortParams
  ): Promise<PaginatedResponse<Report>> => {
    try {
      return await apiClient.get<PaginatedResponse<Report>>('/reports', {
        params: {
          ...filters,
          page: pagination?.page,
          limit: pagination?.limit,
          sortBy: sort?.sortBy,
          sortOrder: sort?.sortOrder,
        },
      });
    } catch (error) {
      console.warn('Usando manifestações mockadas devido a falha de API/rede:', error);
      let list = [...mockReports];

      if (filters?.search) {
        const s = filters.search.toLowerCase();
        list = list.filter(
          (r) =>
            r.protocol.toLowerCase().includes(s) ||
            r.title.toLowerCase().includes(s) ||
            r.description.toLowerCase().includes(s)
        );
      }

      if (filters?.assignedToMe) {
        list = list.filter((r) => r.assignments.some((a) => a.assigneeId === 'user-1'));
      }

      if (filters?.criticalOnly) {
        list = list.filter((r) => r.riskLevel === RiskLevelEnum.CRITICAL || r.riskLevel === RiskLevelEnum.HIGH);
      }

      if (filters?.delayedOnly) {
        list = list.filter(
          (r) =>
            new Date(r.slaDueDate) < new Date() &&
            r.status !== ReportStatusEnum.RESOLVED &&
            r.status !== ReportStatusEnum.COMPLETED
        );
      }

      if (filters?.openOnly) {
        list = list.filter(
          (r) =>
            r.status !== ReportStatusEnum.RESOLVED &&
            r.status !== ReportStatusEnum.COMPLETED &&
            r.status !== ReportStatusEnum.ARCHIVED
        );
      }

      if (filters?.completedOnly) {
        list = list.filter(
          (r) =>
            r.status === ReportStatusEnum.RESOLVED ||
            r.status === ReportStatusEnum.COMPLETED
        );
      }

      if (filters?.recentOnly) {
        list = list.filter(
          (r) =>
            r.status === ReportStatusEnum.RECEIVED ||
            r.status === ReportStatusEnum.TRIAGE
        );
      }

      if (filters?.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        list = list.filter((r) => new Date(r.createdAt) >= fromDate);
      }

      if (filters?.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        list = list.filter((r) => new Date(r.createdAt) <= toDate);
      }

      if (filters?.status && filters.status.length > 0) {
        list = list.filter((r) => filters.status!.includes(r.status));
      }

      if (filters?.riskLevel && filters.riskLevel.length > 0) {
        list = list.filter((r) => filters.riskLevel!.includes(r.riskLevel));
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

  getReportById: async (id: string): Promise<Report> => {
    try {
      return await apiClient.get<Report>(`/reports/${id}`);
    } catch (error) {
      console.warn('Usando manifestação mockada por ID:', error);
      const found = mockReports.find((r) => r.id === id || r.protocol === id) || mockReports[0];
      return found;
    }
  },

  updateReport: async (id: string, updates: Partial<Report>): Promise<Report> => {
    try {
      return await apiClient.patch<Report>(`/reports/${id}`, updates);
    } catch (error) {
      console.warn('Atualizando manifestação mockada:', error);
      const idx = mockReports.findIndex((r) => r.id === id || r.protocol === id);
      if (idx !== -1) {
        mockReports[idx] = { ...mockReports[idx], ...updates, updatedAt: new Date().toISOString() };
        return mockReports[idx];
      }
      return { id, ...updates } as Report;
    }
  },

  addPublicMessage: async (id: string, content: string, senderType: 'COMMITTEE' | 'REPORTER' = 'COMMITTEE'): Promise<PublicMessage> => {
    try {
      return await apiClient.post<PublicMessage>(`/reports/${id}/messages`, { content, senderType });
    } catch (error) {
      console.warn('Adicionando mensagem pública mockada:', error);
      const newMsg: PublicMessage = {
        id: `msg-${Date.now()}`,
        reportId: id,
        senderType,
        senderName: senderType === 'REPORTER' ? 'Manifestante' : 'Ouvidoria / Comitê de Ética',
        content,
        attachments: [],
        createdAt: new Date().toISOString(),
      };
      const rep = mockReports.find((r) => r.id === id || r.protocol === id);
      if (rep) {
        if (!rep.publicMessages) rep.publicMessages = [];
        rep.publicMessages.push(newMsg);
      }
      return newMsg;
    }
  },

  addInternalComment: async (id: string, content: string): Promise<InternalComment> => {
    try {
      return await apiClient.post<InternalComment>(`/reports/${id}/comments`, { content });
    } catch (error) {
      console.warn('Adicionando comentário interno mockado:', error);
      const newComment: InternalComment = {
        id: `cmt-${Date.now()}`,
        reportId: id,
        authorId: 'user-1',
        authorName: 'Dr. Carlos Silva',
        authorRole: 'Gestor de Ética',
        content,
        attachments: [],
        isPrivate: true,
        createdAt: new Date().toISOString(),
      };
      const rep = mockReports.find((r) => r.id === id || r.protocol === id);
      if (rep) {
        if (!rep.internalComments) rep.internalComments = [];
        rep.internalComments.push(newComment);
      }
      return newComment;
    }
  },

  addActionPlan: async (
    id: string,
    actionPlan: Omit<ActionPlan, 'id' | 'reportId' | 'createdAt' | 'updatedAt'>
  ): Promise<ActionPlan> => {
    try {
      return await apiClient.post<ActionPlan>(`/reports/${id}/action-plans`, actionPlan);
    } catch (error) {
      console.warn('Adicionando plano de ação mockado:', error);
      const newPlan: ActionPlan = {
        id: `acp-${Date.now()}`,
        reportId: id,
        ...actionPlan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const rep = mockReports.find((r) => r.id === id || r.protocol === id);
      if (rep) {
        if (!rep.actionPlans) rep.actionPlans = [];
        rep.actionPlans.push(newPlan);
      }
      return newPlan;
    }
  },

  addEvidence: async (
    id: string,
    evidence: { fileName: string; fileSize: number; mimeType: string; url?: string }
  ): Promise<Attachment> => {
    try {
      return await apiClient.post<Attachment>(`/reports/${id}/evidences`, evidence);
    } catch (error) {
      console.warn('Anexando evidência mockada:', error);
      const newAtt: Attachment = {
        id: `att-${Date.now()}`,
        fileName: evidence.fileName,
        fileSize: evidence.fileSize,
        mimeType: evidence.mimeType,
        url: evidence.url || '#',
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Dr. Carlos Silva',
      };
      const rep = mockReports.find((r) => r.id === id || r.protocol === id);
      if (rep) {
        if (!rep.attachments) rep.attachments = [];
        rep.attachments.push(newAtt);
      }
      return newAtt;
    }
  },

  addRelatedPerson: async (
    id: string,
    person: Omit<RelatedPerson, 'id'>
  ): Promise<RelatedPerson> => {
    try {
      return await apiClient.post<RelatedPerson>(`/reports/${id}/related-people`, person);
    } catch (error) {
      console.warn('Adicionando pessoa relacionada mockada:', error);
      const newPerson: RelatedPerson = {
        id: `person-${Date.now()}`,
        ...person,
      };
      const rep = mockReports.find((r) => r.id === id || r.protocol === id);
      if (rep) {
        if (!rep.relatedPeople) rep.relatedPeople = [];
        rep.relatedPeople.push(newPerson);
      }
      return newPerson;
    }
  },

  declareConflict: async (
    id: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      return await apiClient.post<{ success: boolean; message: string }>(`/reports/${id}/conflict-of-interest`, { reason });
    } catch (error) {
      console.warn('Declarando conflito de interesse mockado:', error);
      const rep = mockReports.find((r) => r.id === id || r.protocol === id);
      if (rep) {
        rep.conflictDeclared = true;
        rep.conflictNote = reason;
      }
      return { success: true, message: 'Conflito de interesse registrado com sucesso.' };
    }
  },

  getReportAuditLogs: async (id: string): Promise<AuditLog[]> => {
    try {
      return await apiClient.get<AuditLog[]>(`/reports/${id}/audit-logs`);
    } catch (error) {
      console.warn('Obtendo logs de auditoria mockados do caso:', error);
      return [];
    }
  },
};
