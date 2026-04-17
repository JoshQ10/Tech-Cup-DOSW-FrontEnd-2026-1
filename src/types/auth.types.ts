export type UserRole =
  | 'JUGADOR'
  | 'CAPITAN'
  | 'ADMINISTRADOR'
  | 'ARBITRO'
  | 'ORGANIZADOR';

export type UserType = 'INTERNO' | 'EXTERNO';

export interface UserProfile {
  id: string;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  role: UserRole;
  tipo: UserType;
  profileComplete: boolean;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface MessageResponse {
  message: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  tipo: UserType;
  relationshipType?: 'FAMILIAR' | 'INVITADO';
  relationshipDescription?: string;
}

