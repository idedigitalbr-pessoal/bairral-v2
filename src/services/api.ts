import { apiClient } from '../api/client';

export { apiClient };
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return apiClient.request<T>(endpoint, options);
}
