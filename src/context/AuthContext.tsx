// NOTA DE ARQUITETURA:
// A autorização e validação real de senhas e tokens JWT serão processadas pelo Backend NestJS em produção.
// Este AuthContext e AuthProvider são responsáveis pelo gerenciamento simulado de sessão no frontend.

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, LoginCredentials } from '../services/authService';
import { AdminUser, AdminRole, AdminRoleEnum, ROLE_PERMISSIONS, ROLE_LABELS } from '../types/auth';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mustChangePassword: boolean;
  isSessionExpired: boolean;
  login: (credentials: LoginCredentials) => Promise<AdminUser>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
  firstAccess: (email: string, newPassword: string) => Promise<AdminUser>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<string>;
  triggerSessionExpired: () => void;
  clearSessionExpired: () => void;
  switchSimulatedUser: (role: AdminRole) => void;
}

const AUTH_STORAGE_KEY = '@GrupoBairral:auth_token_v1';
const USER_STORAGE_KEY = '@GrupoBairral:auth_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_STORAGE_KEY));
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const saveSession = useCallback((newToken: string, newUser: AdminUser) => {
    setToken(newToken);
    setUser(newUser);
    setIsSessionExpired(false);
    localStorage.setItem(AUTH_STORAGE_KEY, newToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AdminUser> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      saveSession(response.token, response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout().catch(() => {});
    } finally {
      clearSession();
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword({ email });
      return response.message;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (tokenStr: string, newPassword: string): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword({ token: tokenStr, newPassword });
      return response.message;
    } finally {
      setIsLoading(false);
    }
  };

  const firstAccess = async (email: string, newPassword: string): Promise<AdminUser> => {
    setIsLoading(true);
    try {
      const response = await authService.firstAccess({ email, newPassword });
      saveSession(response.token, response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await authService.changePassword({ currentPassword, newPassword });
      if (user) {
        const updatedUser: AdminUser = { ...user, mustChangePassword: false };
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      }
      return response.message;
    } finally {
      setIsLoading(false);
    }
  };

  const triggerSessionExpired = useCallback(() => {
    setIsSessionExpired(true);
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      setIsSessionExpired(true);
    };
    window.addEventListener('auth:session-expired', handleExpired);
    return () => window.removeEventListener('auth:session-expired', handleExpired);
  }, []);

  const clearSessionExpired = useCallback(() => {
    setIsSessionExpired(false);
  }, []);

  // Troca rápida de perfil simulado para facilidade de testes de homologação
  const switchSimulatedUser = useCallback((role: AdminRole) => {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    const roleName = ROLE_LABELS[role] || role;

    const mockEmailMap: Record<AdminRole, string> = {
      [AdminRoleEnum.SUPER_ADMIN]: 'superadmin@grupobairral.com.br',
      [AdminRoleEnum.ETHICS_MANAGER]: 'gestor.etica@grupobairral.com.br',
      [AdminRoleEnum.TRIAGE_ANALYST]: 'analista.triagem@grupobairral.com.br',
      [AdminRoleEnum.INVESTIGATOR]: 'investigador@grupobairral.com.br',
      [AdminRoleEnum.AREA_RESPONSIBLE]: 'responsavel.area@grupobairral.com.br',
      [AdminRoleEnum.AUDITOR]: 'auditor@grupobairral.com.br',
      [AdminRoleEnum.EXECUTIVE_VIEWER]: 'executivo@grupobairral.com.br',
    };

    const mockNameMap: Record<AdminRole, string> = {
      [AdminRoleEnum.SUPER_ADMIN]: 'Dra. Helena Souza',
      [AdminRoleEnum.ETHICS_MANAGER]: 'Dr. Carlos Silva',
      [AdminRoleEnum.TRIAGE_ANALYST]: 'Mariana Costa',
      [AdminRoleEnum.INVESTIGATOR]: 'Roberto Mendes',
      [AdminRoleEnum.AREA_RESPONSIBLE]: 'Fernanda Lima',
      [AdminRoleEnum.AUDITOR]: 'Paulo Ribeiro',
      [AdminRoleEnum.EXECUTIVE_VIEWER]: 'Beatriz Rocha',
    };

    const newUser: AdminUser = {
      id: `usr-${role.toLowerCase()}`,
      name: mockNameMap[role],
      email: mockEmailMap[role],
      role,
      roleName,
      unitId: 'unit-1',
      unitName: 'Instituto Bairral de Psiquiatria - Sede',
      departmentId: 'dept-1',
      departmentName: 'Comitê de Integridade',
      permissions: rolePermissions,
      mustChangePassword: false,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveSession(`mock-jwt-switch-${role.toLowerCase()}`, newUser);
  }, [saveSession]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    mustChangePassword: !!user?.mustChangePassword,
    isSessionExpired,
    login,
    logout,
    forgotPassword,
    resetPassword,
    firstAccess,
    changePassword,
    triggerSessionExpired,
    clearSessionExpired,
    switchSimulatedUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
