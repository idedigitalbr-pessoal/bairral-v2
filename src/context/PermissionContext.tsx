// NOTA DE ARQUITETURA:
// As verificações de permissão abaixo ajustam a interface do usuário (ocultando ou desabilitando ações).
// A autorização imutável e aplicação de regras de segurança definitivas serão impostas pelas Guards no backend NestJS.

import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { AdminPermission, AdminRole } from '../types/auth';

interface PermissionContextType {
  hasPermission: (permission: AdminPermission | AdminPermission[]) => boolean;
  hasAnyPermission: (permissions: AdminPermission[]) => boolean;
  hasRole: (role: AdminRole | AdminRole[]) => boolean;
  userPermissions: AdminPermission[];
  userRole: AdminRole | null;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    return user?.permissions || [];
  }, [user]);

  const userRole = useMemo(() => {
    return user?.role || null;
  }, [user]);

  const hasPermission = (permission: AdminPermission | AdminPermission[]): boolean => {
    if (!user) return false;
    // Superadmin e Gestor de Ética têm permissão irrestrita simulada
    if (user.role === 'SUPER_ADMIN' || user.role === 'ETHICS_MANAGER') {
      return true;
    }
    if (Array.isArray(permission)) {
      return permission.every((p) => userPermissions.includes(p));
    }
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: AdminPermission[]): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN' || user.role === 'ETHICS_MANAGER') {
      return true;
    }
    return permissions.some((p) => userPermissions.includes(p));
  };

  const hasRole = (role: AdminRole | AdminRole[]): boolean => {
    if (!user || !userRole) return false;
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  };

  const value = {
    hasPermission,
    hasAnyPermission,
    hasRole,
    userPermissions,
    userRole,
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermission(): PermissionContextType {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission deve ser utilizado dentro de um PermissionProvider');
  }
  return context;
}
