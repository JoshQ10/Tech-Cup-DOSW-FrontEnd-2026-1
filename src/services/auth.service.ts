import { apiClient } from './apiClient';
import type {
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RegisterRequest,
  UserProfile,
  UserRole,
  UserType,
} from '../types/auth.types';
import { fromBackendRole, fromBackendUserType, toBackendRole, toBackendUserType } from '../types/auth.types';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface NotificationCountResponse {
  unreadInvitations: number;
  pendingCalendar: number;
  reglamentoPendiente: boolean;
}

const normalizeUserProfile = (payload: Record<string, unknown>): UserProfile => {
  const rawRole = String(payload.role || payload.rol || 'PLAYER');
  const rawType = String(payload.tipo || payload.userType || 'INTERNAL');

  return {
    id: String(payload.id || payload.userId || payload.uuid || ''),
    nombre: String(payload.firstName || payload.nombre || payload.name || ''),
    apellido: String(payload.lastName || payload.apellido || ''),
    username: String(payload.username || payload.userName || ''),
    email: String(payload.email || ''),
    role: fromBackendRole(rawRole),
    tipo: fromBackendUserType(rawType),
    profileComplete: Boolean(payload.profileComplete ?? true),
  };
};

// Token mock con exp año 2030 — solo para usuarios de prueba locales
const MOCK_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  btoa(JSON.stringify({ sub: 'mock', exp: 1893456000 })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_') +
  '.mock-signature';

const MOCK_USERS: Record<string, LoginResponse> = {
  'admin@test.com': {
    accessToken: MOCK_TOKEN,
    refreshToken: MOCK_TOKEN,
    user: { id: 'mock-1', nombre: 'Admin', apellido: 'Test', username: 'admin_test', email: 'admin@test.com', role: 'ADMINISTRADOR', tipo: 'INTERNO', profileComplete: true },
  },
  'organizador@test.com': {
    accessToken: MOCK_TOKEN,
    refreshToken: MOCK_TOKEN,
    user: { id: 'mock-2', nombre: 'Organizador', apellido: 'Test', username: 'org_test', email: 'organizador@test.com', role: 'ORGANIZADOR', tipo: 'INTERNO', profileComplete: true },
  },
  'arbitro@test.com': {
    accessToken: MOCK_TOKEN,
    refreshToken: MOCK_TOKEN,
    user: { id: 'mock-3', nombre: 'Arbitro', apellido: 'Test', username: 'arbitro_test', email: 'arbitro@test.com', role: 'ARBITRO', tipo: 'INTERNO', profileComplete: true },
  },
  'capitan@test.com': {
    accessToken: MOCK_TOKEN,
    refreshToken: MOCK_TOKEN,
    user: { id: 'mock-4', nombre: 'Capitan', apellido: 'Test', username: 'capitan_test', email: 'capitan@test.com', role: 'CAPITAN', tipo: 'INTERNO', profileComplete: true },
  },
  'jugador@test.com': {
    accessToken: MOCK_TOKEN,
    refreshToken: MOCK_TOKEN,
    user: { id: 'mock-5', nombre: 'Jugador', apellido: 'Test', username: 'jugador_test', email: 'jugador@test.com', role: 'JUGADOR', tipo: 'INTERNO', profileComplete: true },
  },
};

const MOCK_PASSWORD = 'test1234';

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const mockUser = MOCK_USERS[payload.emailOrUsername.toLowerCase()];
    if (mockUser && payload.password === MOCK_PASSWORD) {
      return mockUser;
    }

    const { data } = await apiClient.post<Record<string, unknown>>('/api/auth/login', {
      emailOrUsername: payload.emailOrUsername,
      email: payload.emailOrUsername,
      username: payload.emailOrUsername,
      password: payload.password,
    });

    const raw = data as Record<string, unknown>;
    const accessToken = String(raw.accessToken || raw.token || '');
    const refreshToken = String(raw.refreshToken || raw.refresh_token || '');

    let user: UserProfile;
    if (raw.user && typeof raw.user === 'object') {
      user = normalizeUserProfile(raw.user as Record<string, unknown>);
    } else if (accessToken) {
      try {
        user = await authService.getMyProfile();
      } catch {
        user = normalizeUserProfile(raw);
      }
    } else {
      user = normalizeUserProfile(raw);
    }

    return { accessToken, refreshToken, user };
  },

  async register(payload: RegisterRequest): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/api/auth/register', {
      firstName: payload.nombre,
      lastName: payload.apellido,
      username: payload.username,
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
      role: toBackendRole(payload.role),
      userType: toBackendUserType(payload.tipo),
      relationshipType: payload.relationshipType,
      relationshipDescription: payload.relationshipDescription,
    });
    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },

  async forgotPassword(email: string): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/api/auth/forgot-password', { email });
    return data;
  },

  async verifyEmail(token: string): Promise<MessageResponse> {
    const { data } = await apiClient.get<MessageResponse>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
    return data;
  },

  async refreshToken(payload: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const { data } = await apiClient.post<RefreshTokenResponse>('/api/auth/refresh-token', payload);
    return data;
  },

  async setUserRole(userId: string, role: UserRole): Promise<MessageResponse> {
    const { data } = await apiClient.put<MessageResponse>(`/api/users/${userId}/role`, { role: toBackendRole(role) });
    return data;
  },

  async getNotificationsCount(userId: string): Promise<NotificationCountResponse> {
    const { data } = await apiClient.get<NotificationCountResponse>(
      `/api/users/${userId}/notifications/count`
    );
    return data;
  },

  async getMyProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get<Record<string, unknown>>('/api/profile');
    return normalizeUserProfile(data);
  },
};

