import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unitsService } from '../services/unitsService';
import { queryKeys } from '../api/query-keys';
import { Unit } from '../types';

export function useUnits() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.units.list(),
    queryFn: () => unitsService.getUnits(),
  });

  const createMutation = useMutation({
    mutationFn: (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>) => unitsService.createUnit(unit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Unit> }) =>
      unitsService.updateUnit(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => unitsService.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });

  return {
    ...query,
    units: query.data || [],
    createUnit: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateUnit: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteUnit: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
