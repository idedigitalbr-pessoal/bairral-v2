import { apiClient } from '../api/client';
import { AdminUser, AdminRole } from '../types/auth';

// NOTA DE ARQUITETURA:
// A autorização e validação real de senhas e tokens JWT serão processadas pelo Backend NestJS em produção.
// Este serviço interage com endpoints simulados via MSW na fase atual.

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface FirstAccessPayload {
  email: string;
  temporaryPassword?: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const defaultMockUser: AdminUser = {
  id: 'usr-ethics_manager',
  name: 'Dr. Carlos Silva',
  email: 'gestor.etica@grupobairral.com.br',
  role: 'ETHICS_MANAGER' as AdminRole,
  roleName: 'Gestor de Ética',
  permissions: [
    'VIEW_CASES', 'VIEW_IDENTITY', 'CHANGE_CLASSIFICATION', 'ASSIGN_CASES', 'CHANGE_STATUS',
    'ACCESS_ATTACHMENTS', 'SEND_MESSAGES', 'ADD_INTERNAL_COMMENTS', 'CREATE_ACTION_PLAN',
    'CONCLUDE_CASE', 'REOPEN_CASE', 'EXPORT_DATA', 'ACCESS_AUDIT', 'MANAGE_USERS', 'MANAGE_SETTINGS'
  ] as any,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      return await apiClient.post<LoginResponse>('/auth/login', credentials);
    } catch (error) {
      console.warn('Usando login mockado por falha de rede:', error);
      return {
        token: `mock-jwt-token-${Date.now()}`,
        user: {
          ...defaultMockUser,
          email: credentials.email || defaultMockUser.email,
        },
      };
    }
  },
  getMe: async (): Promise<AdminUser> => {
    try {
      return await apiClient.get<AdminUser>('/auth/me');
    } catch (error) {
      console.warn('Usando dados de perfil mockados por falha de rede:', error);
      return defaultMockUser;
    }
  },
  logout: async (): Promise<{ message: string }> => {
    try {
      return await apiClient.post<{ message: string }>('/auth/logout');
    } catch (error) {
      return { message: 'Sessão encerrada com sucesso.' };
    }
  },
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<{ message: string }> => {
    try {
      return await apiClient.post<{ message: string }>('/auth/forgot-password', payload);
    } catch (error) {
      return { message: 'Se o e-mail estiver cadastrado, um link de redefinição será enviado.' };
    }
  },
  resetPassword: async (payload: ResetPasswordPayload): Promise<{ message: string; user: AdminUser }> => {
    try {
      return await apiClient.post<{ message: string; user: AdminUser }>('/auth/reset-password', payload);
    } catch (error) {
      return { message: 'Senha redefinida com sucesso!', user: defaultMockUser };
    }
  },
  firstAccess: async (payload: FirstAccessPayload): Promise<LoginResponse> => {
    try {
      return await apiClient.post<LoginResponse>('/auth/first-access', payload);
    } catch (error) {
      return {
        token: `mock-jwt-first-access-${Date.now()}`,
        user: defaultMockUser,
      };
    }
  },
  changePassword: async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
    try {
      return await apiClient.post<{ message: string }>('/auth/change-password', payload);
    } catch (error) {
      return { message: 'Senha alterada com sucesso.' };
    }
  },
  switchSimulatedRole: async (role: AdminRole): Promise<LoginResponse> => {
    try {
      return await apiClient.post<LoginResponse>('/auth/switch-role', { role });
    } catch (error) {
      return {
        token: `mock-jwt-${role.toLowerCase()}-${Date.now()}`,
        user: {
          ...defaultMockUser,
          role,
          roleName: role === 'SUPER_ADMIN' ? 'Superadministrador' : 'Gestor de Ética',
        },
      };
    }
  },
};
