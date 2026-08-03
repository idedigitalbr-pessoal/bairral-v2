// NOTA DE ARQUITETURA:
// O PermissionGate oculta ou desabilita elementos da interface para usuários sem a permissão necessária.
// A autorização definitiva e bloqueio de chamadas de API ocorrerão nos Guards do NestJS.

import React from 'react';
import { usePermission } from '../../context/PermissionContext';
import { AdminPermission, AdminRole } from '../../types/auth';

interface PermissionGateProps {
  permission?: AdminPermission | AdminPermission[];
  anyPermission?: AdminPermission[];
  role?: AdminRole | AdminRole[];
  fallback?: React.ReactNode;
  mode?: 'hide' | 'disable';
  children: React.ReactNode;
}

export function PermissionGate({
  permission,
  anyPermission,
  role,
  fallback = null,
  mode = 'hide',
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasRole } = usePermission();

  let isAllowed = true;

  if (permission) {
    isAllowed = isAllowed && hasPermission(permission);
  }

  if (anyPermission) {
    isAllowed = isAllowed && hasAnyPermission(anyPermission);
  }

  if (role) {
    isAllowed = isAllowed && hasRole(role);
  }

  if (!isAllowed) {
    if (mode === 'disable') {
      return (
        <div
          className="opacity-50 pointer-events-none cursor-not-allowed select-none relative group"
          title="Sua função não tem permissão para esta ação."
        >
          {children}
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
