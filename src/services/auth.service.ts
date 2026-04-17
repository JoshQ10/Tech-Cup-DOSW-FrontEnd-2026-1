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
  const role = (payload.role || payload.rol || 'JUGADOR') as UserRole;
  const tipo = (payload.tipo || payload.userType || 'INTERNO') as UserType;

  return {
    id: String(payload.id || payload.userId || payload.uuid || ''),
    nombre: String(payload.nombre || payload.firstName || payload.name || ''),
    apellido: String(payload.apellido || payload.lastName || ''),
    username: String(payload.username || payload.userName || ''),
    email: String(payload.email || ''),
    role,
    tipo,
    profileComplete: Boolean(payload.profileComplete ?? true),
  };
};

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse | Record<string, unknown>>('/api/auth/login', {
      emailOrUsername: payload.emailOrUsername,
      email: payload.emailOrUsername,
      username: payload.emailOrUsername,
      password: payload.password,
    });

    if ('accessToken' in data && 'user' in data) {
      return data as LoginResponse;
    }

    const raw = data as Record<string, unknown>;
    const accessToken = String(raw.accessToken || raw.token || '');
    const refreshToken = String(raw.refreshToken || raw.refresh_token || '');

    let user = raw.user as UserProfile | undefined;
    if (!user && accessToken) {
      const profile = await authService.getMyProfile();
      user = profile;
    }

    return {
      accessToken,
      refreshToken,
      user: user || normalizeUserProfile(raw),
    };
  },

  async register(payload: RegisterRequest): Promise<MessageResponse> {
    const { data } = await apiClient.post<MessageResponse>('/api/auth/register', payload);
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
    const { data } = await apiClient.put<MessageResponse>(`/api/users/${userId}/role`, { role });
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

