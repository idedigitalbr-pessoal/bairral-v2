import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { actionPlansService, CreateActionPlanDto, UpdateActionPlanDto } from '../services/actionPlansService';
import { queryKeys } from '../api/query-keys';

export function useActionPlans(filters?: Record<string, any>) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.actionPlans.list(filters),
    queryFn: () => actionPlansService.getActionPlans(filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateActionPlanDto) => actionPlansService.createActionPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actionPlans.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateActionPlanDto }) =>
      actionPlansService.updateActionPlan(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actionPlans.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.actionPlans.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });

  const validateMutation = useMutation({
    mutationFn: ({
      id,
      validation,
    }: {
      id: string;
      validation: { status: 'COMPLETED' | 'CANCELLED'; validationNotes: string };
    }) => actionPlansService.validateActionPlan(id, validation),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actionPlans.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.actionPlans.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });

  return {
    ...query,
    createActionPlan: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateActionPlan: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    validateActionPlan: validateMutation.mutateAsync,
    isValidating: validateMutation.isPending,
  };
}
