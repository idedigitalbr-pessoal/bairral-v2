import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, SystemSettings } from '../services/settingsService';
import { queryKeys } from '../api/query-keys';

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.settings.get(),
    queryFn: () => settingsService.getSettings(),
  });

  const updateMutation = useMutation({
    mutationFn: (newSettings: Partial<SystemSettings>) => settingsService.updateSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs.all });
    },
  });

  return {
    ...query,
    settings: query.data,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
