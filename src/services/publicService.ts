import { apiClient } from '../api/client';
import { Report } from '../types';

export interface RegisterPublicReportPayload {
  title: string;
  description: string;
  type: string;
  registrationType: string;
  categoryId: string;
  unitId: string;
  reporter?: {
    type: string;
    name?: string;
    email?: string;
    phone?: string;
    relationshipToHospital?: string;
  };
  attachments?: any[];
}

export interface RegisterPublicReportResponse {
  protocol: string;
  accessKey: string;
  report: Report;
}

export interface TrackPublicReportPayload {
  protocol: string;
  accessKey: string;
}

export interface PublicTimelineItem {
  id: string;
  title: string;
  description?: string;
  status?: string;
  date: string;
  type: 'STATUS_CHANGE' | 'MESSAGE' | 'SYSTEM' | 'REPORTER_REPLY';
}

export interface PublicMessageItem {
  id: string;
  reportId?: string;
  senderType: 'COMMITTEE' | 'REPORTER' | 'SYSTEM';
  senderName: string;
  content: string;
  isInformationRequest?: boolean;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url?: string;
  }>;
  createdAt: string;
}

export interface TrackPublicReportResponse {
  protocol: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  slaDueDate: string;
  categoryName: string;
  unitName: string;
  isClosed: boolean;
  publicMessages: PublicMessageItem[];
  timeline: PublicTimelineItem[];
}

export interface SendPublicReplyPayload {
  protocol: string;
  accessKey: string;
  message: string;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url?: string;
  }>;
}

export interface ClosePublicReportPayload {
  protocol: string;
  accessKey: string;
}

import { mockReports } from '../mocks/data';

export const publicService = {
  registerReport: async (payload: RegisterPublicReportPayload): Promise<RegisterPublicReportResponse> => {
    try {
      return await apiClient.post<RegisterPublicReportResponse>('/public/reports', payload);
    } catch (error) {
      console.warn('Registrando manifestação pública mockada:', error);
      const protocol = `GB-2025-${Math.floor(100 + Math.random() * 900)}`;
      const accessKey = `KEY-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReport: any = {
        id: `rep-${Date.now()}`,
        protocol,
        accessKey,
        title: payload.title,
        description: payload.description,
        type: payload.type,
        registrationType: payload.registrationType,
        status: 'RECEIVED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockReports.unshift(newReport);
      return { protocol, accessKey, report: newReport };
    }
  },
  trackReport: async (payload: TrackPublicReportPayload): Promise<TrackPublicReportResponse> => {
    try {
      return await apiClient.post<TrackPublicReportResponse>('/public/reports/track', payload);
    } catch (error) {
      console.warn('Acompanhando manifestação pública mockada:', error);
      const found = mockReports.find(
        (r) => r.protocol.toUpperCase() === payload.protocol.toUpperCase()
      ) || mockReports[0];

      return {
        protocol: found.protocol,
        title: found.title,
        type: found.type,
        status: found.status,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt,
        slaDueDate: found.slaDueDate,
        categoryName: found.categoryName,
        unitName: found.unitName,
        isClosed: found.status === 'RESOLVED' || found.status === 'COMPLETED',
        publicMessages: (found.publicMessages || []).map((m) => ({
          id: m.id,
          senderType: m.senderType as any,
          senderName: m.senderName,
          content: m.content,
          createdAt: m.createdAt,
        })),
        timeline: [
          {
            id: 'tl-1',
            title: 'Manifestação Registrada',
            description: 'Recebida e armazenada no sistema',
            status: found.status,
            date: found.createdAt,
            type: 'SYSTEM',
          },
        ],
      };
    }
  },
  sendReply: async (payload: SendPublicReplyPayload): Promise<TrackPublicReportResponse> => {
    try {
      return await apiClient.post<TrackPublicReportResponse>('/public/reports/reply', payload);
    } catch (error) {
      console.warn('Enviando resposta pública mockada:', error);
      return publicService.trackReport({ protocol: payload.protocol, accessKey: payload.accessKey });
    }
  },
  closeReport: async (payload: ClosePublicReportPayload): Promise<TrackPublicReportResponse> => {
    try {
      return await apiClient.post<TrackPublicReportResponse>('/public/reports/close', payload);
    } catch (error) {
      console.warn('Encerrando manifestação pública mockada:', error);
      return publicService.trackReport({ protocol: payload.protocol, accessKey: payload.accessKey });
    }
  },
};

