import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface GuestRouteProps {
  children?: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, mustChangePassword } = useAuth();

  if (isAuthenticated) {
    if (mustChangePassword) {
      return <Navigate to="/primeiro-acesso" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
