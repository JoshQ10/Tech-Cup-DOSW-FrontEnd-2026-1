import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../store/AuthContext';
import { getRoleDashboard } from '../routes/rolePaths';
import type { LoginRequest, UserRole } from '../types/auth.types';

export function useAuth() {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, isLoading, login: loginContext, logout: logoutContext } =
    useAuthContext();

  const login = async (credentials: LoginRequest): Promise<void> => {
    const loggedUser = await loginContext(credentials);
    const nextRole = (loggedUser?.role as UserRole | undefined) ?? null;

    if (!nextRole) {
      navigate('/select-role', { replace: true });
      return;
    }

    navigate(getRoleDashboard(nextRole), { replace: true });
  };

  const logout = (): void => {
    void logoutContext();
    navigate('/', { replace: true });
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!role) return false;
    return roles.includes(role);
  };

  return { user, role, isAuthenticated, isLoading, login, logout, hasRole };
}
