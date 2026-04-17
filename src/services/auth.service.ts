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

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
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

