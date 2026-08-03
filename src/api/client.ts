import { ApiError } from './errors';
import { ApiResponse } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | (string | number | boolean)[] | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    try {
      return localStorage.getItem('@GrupoBairral:auth_token_v1') || localStorage.getItem('gb_auth_token');
    } catch {
      return null;
    }
  }

  private buildUrl(endpoint: string, params?: RequestOptions['params']): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((val) => url.searchParams.append(key, String(val)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return url.pathname + url.search;
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, headers: customHeaders, ...customInit } = options;
    const url = this.buildUrl(endpoint, params);

    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(customHeaders as Record<string, string>),
    };

    const config: RequestInit = {
      ...customInit,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, config);

      let data: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        let errorMessage =
          typeof data === 'object' && data?.error?.message
            ? data.error.message
            : typeof data === 'object' && data?.message
            ? Array.isArray(data.message)
              ? data.message.join(', ')
              : data.message
            : response.statusText || 'Erro na requisição';

        // Tratamento amigável por código HTTP
        if (response.status === 401) {
          errorMessage = errorMessage || 'Sua sessão expirou ou o token é inválido. Faça login novamente.';
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        } else if (response.status === 403) {
          errorMessage = 'Acesso negado: Você não possui permissão para realizar esta ação.';
        } else if (response.status === 422) {
          errorMessage = errorMessage || 'Dados de requisição inválidos ou com inconsistências.';
        } else if (response.status === 429) {
          errorMessage = 'Limite de requisições excedido. Por favor, aguarde alguns instantes.';
        } else if (response.status >= 500) {
          errorMessage = 'Erro interno no servidor. Operação não concluída.';
        }

        const errorCode =
          typeof data === 'object' && data?.error?.code
            ? data.error.code
            : `HTTP_${response.status}`;

        const details = typeof data === 'object' && data?.error?.details ? data.error.details : undefined;

        throw new ApiError(errorMessage, response.status, errorCode, details);
      }

      // Se a resposta estiver encapsulada em { success: true, data: ... }
      if (typeof data === 'object' && data !== null && 'success' in data && 'data' in data) {
        return (data as ApiResponse<T>).data;
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Falha na conexão com o servidor',
        500,
        'NETWORK_ERROR'
      );
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
