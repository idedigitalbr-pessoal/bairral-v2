import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '../services/reportsService';
import { queryKeys } from '../api/query-keys';
import { ReportFilters, PaginationParams, SortParams, Report, ActionPlan, RelatedPerson } from '../types';

export function useReports(filters?: ReportFilters, pagination?: PaginationParams, sort?: SortParams) {
  return useQuery({
    queryKey: queryKeys.reports.list(filters, pagination, sort),
    queryFn: () => reportsService.getReports(filters, pagination, sort),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: queryKeys.reports.detail(id),
    queryFn: () => reportsService.getReportById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Report> }) =>
      reportsService.updateReport(id, updates),
    onSuccess: (updatedReport) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
      queryClient.setQueryData(queryKeys.reports.detail(updatedReport.id), updatedReport);
    },
  });
}

export function useAddPublicMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content, senderType }: { id: string; content: string; senderType?: 'COMMITTEE' | 'REPORTER' }) =>
      reportsService.addPublicMessage(id, content, senderType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });
}

export function useAddInternalComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      reportsService.addInternalComment(id, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });
}

export function useAddActionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actionPlan }: { id: string; actionPlan: Omit<ActionPlan, 'id' | 'reportId' | 'createdAt' | 'updatedAt'> }) =>
      reportsService.addActionPlan(id, actionPlan),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });
}

export function useAddEvidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, evidence }: { id: string; evidence: { fileName: string; fileSize: number; mimeType: string; url?: string } }) =>
      reportsService.addEvidence(id, evidence),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });
}

export function useAddRelatedPerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, person }: { id: string; person: Omit<RelatedPerson, 'id'> }) =>
      reportsService.addRelatedPerson(id, person),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });
}

export function useDeclareConflict() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      reportsService.declareConflict(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });
}

export function useReportAuditLogs(reportId: string) {
  return useQuery({
    queryKey: ['report-audit-logs', reportId],
    queryFn: () => reportsService.getReportAuditLogs(reportId),
    enabled: Boolean(reportId),
  });
}
