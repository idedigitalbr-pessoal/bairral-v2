import { useMutation } from '@tanstack/react-query';
import { publicService, RegisterPublicReportPayload, TrackPublicReportPayload } from '../services/publicService';

export function useRegisterPublicReport() {
  return useMutation({
    mutationFn: (payload: RegisterPublicReportPayload) => publicService.registerReport(payload),
  });
}

export function useTrackPublicReport() {
  return useMutation({
    mutationFn: (payload: TrackPublicReportPayload) => publicService.trackReport(payload),
  });
}
