import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unitsService } from '../services/unitsService';
import { queryKeys } from '../api/query-keys';
import { Department } from '../types';

export function useDepartments(unitId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.departments.list(unitId),
    queryFn: () => unitsService.getDepartments(unitId),
  });

  const createMutation = useMutation({
    mutationFn: (dept: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => unitsService.createDepartment(dept),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Department> }) =>
      unitsService.updateDepartment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => unitsService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
    },
  });

  return {
    ...query,
    departments: query.data || [],
    createDepartment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateDepartment: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteDepartment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
