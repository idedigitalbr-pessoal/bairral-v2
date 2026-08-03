// NOTA DE ARQUITETURA:
// ProtectedRoute valida o estado de autenticação e permissões no cliente para navegação e UX.
// O backend NestJS fará a validação de token (JWT Strategy / Bearer Auth) e Roles/Permissions via Guard em cada requisição.

import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../context/PermissionContext';
import { AdminPermission, AdminRole } from '../../types/auth';
import { RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  requiredPermission?: AdminPermission | AdminPermission[];
  requiredRole?: AdminRole | AdminRole[];
  children?: React.ReactNode;
}

export function ProtectedRoute({
  requiredPermission,
  requiredRole,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, mustChangePassword } = useAuth();
  const { hasPermission, hasRole } = usePermission();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#171717] flex flex-col items-center justify-center p-6 text-white space-y-3">
        <RefreshCw className="w-8 h-8 text-[#FDC503] animate-spin" />
        <p className="text-xs text-[#A3A3A3]">Verificando credenciais e permissões corporativas...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (mustChangePassword && location.pathname !== '/primeiro-acesso') {
    return <Navigate to="/primeiro-acesso" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
