import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth'; // ajuste o path se necessário

type Props = {
  children?: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
};

export const ProtectedRoute: React.FC<Props> = ({
  children,
  redirectTo = '/login',
  fallback = <div>Carregando...</div>,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return fallback;

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;