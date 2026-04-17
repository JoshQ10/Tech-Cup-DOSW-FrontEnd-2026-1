import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../store/AuthContext';

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: '#000F20' }}>
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (
    user &&
    user.profileComplete === false &&
    location.pathname !== '/jugador/perfil-deportivo' &&
    location.pathname !== '/perfil-deportivo'
  ) {
    return <Navigate to="/jugador/perfil-deportivo" replace />;
  }

  return <Outlet />;
}

