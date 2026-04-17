import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { authService } from '../services/auth.service';
import type { AuthState, LoginRequest, UserProfile, UserRole } from '../types/auth.types';

const TOKEN_KEY = 'techcup_token';
const REFRESH_TOKEN_KEY = 'techcup_refresh_token';
const USER_KEY = 'techcup_user';
const LEGACY_TOKEN_KEY = 'token';
const LEGACY_REFRESH_TOKEN_KEY = 'refreshToken';

interface AuthContextValue extends AuthState {
  role: UserRole | null;
  login: (credentials: LoginRequest) => Promise<UserProfile>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
  updateUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const parseJwtPayload = (token: string): { exp?: number } | null => {
  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;
    const normalized = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as { exp?: number };
  } catch {
    return null;
  }
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 > Date.now();
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
      const userRaw = localStorage.getItem(USER_KEY);

      if (!token || !isTokenValid(token)) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(LEGACY_TOKEN_KEY);
        localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Mantiene llaves nuevas sincronizadas con posibles sesiones legacy.
      localStorage.setItem(TOKEN_KEY, token);
      const legacyRefresh = localStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(LEGACY_REFRESH_TOKEN_KEY);
      if (legacyRefresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, legacyRefresh);
      }

      try {
        if (userRaw) {
          const user = JSON.parse(userRaw) as UserProfile;
          setState({
            user,
            accessToken: token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }

        const profile = await authService.getMyProfile();
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
        setState({
          user: profile,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        setState({
          user: null,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    };

    void bootstrapAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<UserProfile> => {
    const response = await authService.login(credentials);

    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    localStorage.setItem(LEGACY_TOKEN_KEY, response.accessToken);
    localStorage.setItem(LEGACY_REFRESH_TOKEN_KEY, response.refreshToken);

    setState({
      user: response.user,
      accessToken: response.accessToken,
      isAuthenticated: true,
      isLoading: false,
    });

    return response.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Best effort logout: always clear local session.
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);

    setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updatedUser: UserProfile = { ...prev.user, role };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  }, []);

  const updateUser = useCallback((user: UserProfile) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState((prev) => ({ ...prev, user }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      role: state.user?.role ?? null,
      login,
      logout,
      setRole,
      updateUser,
    }),
    [state, login, logout, setRole, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
}

