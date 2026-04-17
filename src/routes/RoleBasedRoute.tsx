import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '../types/auth.types';
import { useAuthContext } from '../store/AuthContext';
import { getRoleDashboard } from './rolePaths';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

export default function RoleBasedRoute({ allowedRoles }: RoleBasedRouteProps) {
  const { role, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: '#000F20' }}>
        Cargando...
      </div>
    );
  }

  if (!role) {
    return <Navigate to="/select-role" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={getRoleDashboard(role)} replace />;
  }

  return <Outlet />;
}
