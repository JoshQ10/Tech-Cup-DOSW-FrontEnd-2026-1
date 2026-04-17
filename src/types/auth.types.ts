export type UserRole =
  | 'JUGADOR'
  | 'CAPITAN'
  | 'ADMINISTRADOR'
  | 'ARBITRO'
  | 'ORGANIZADOR';

export type UserType = 'INTERNO' | 'EXTERNO';

// Backend uses English role/type names — these helpers convert between frontend (ES) and backend (EN)
export type BackendRole = 'PLAYER' | 'CAPTAIN' | 'ADMINISTRATOR' | 'REFEREE' | 'ORGANIZER';
export type BackendUserType = 'INTERNAL' | 'EXTERNAL' | 'STUDENT' | 'GRADUATE' | 'PROFESSOR' | 'ADMINISTRATIVE' | 'FAMILY';

const ROLE_TO_BACKEND: Record<UserRole, BackendRole> = {
  JUGADOR: 'PLAYER',
  CAPITAN: 'CAPTAIN',
  ADMINISTRADOR: 'ADMINISTRATOR',
  ARBITRO: 'REFEREE',
  ORGANIZADOR: 'ORGANIZER',
};

const ROLE_FROM_BACKEND: Record<BackendRole, UserRole> = {
  PLAYER: 'JUGADOR',
  CAPTAIN: 'CAPITAN',
  ADMINISTRATOR: 'ADMINISTRADOR',
  REFEREE: 'ARBITRO',
  ORGANIZER: 'ORGANIZADOR',
};

const TYPE_TO_BACKEND: Record<UserType, BackendUserType> = {
  INTERNO: 'INTERNAL',
  EXTERNO: 'EXTERNAL',
};

const TYPE_FROM_BACKEND: Record<string, UserType> = {
  INTERNAL: 'INTERNO',
  EXTERNAL: 'EXTERNO',
  STUDENT: 'INTERNO',
  GRADUATE: 'INTERNO',
  PROFESSOR: 'INTERNO',
  ADMINISTRATIVE: 'INTERNO',
  FAMILY: 'EXTERNO',
};

export const toBackendRole = (role: UserRole): BackendRole => ROLE_TO_BACKEND[role];
export const fromBackendRole = (role: string): UserRole =>
  ROLE_FROM_BACKEND[role as BackendRole] ?? 'JUGADOR';
export const toBackendUserType = (tipo: UserType): BackendUserType => TYPE_TO_BACKEND[tipo];
export const fromBackendUserType = (tipo: string): UserType =>
  TYPE_FROM_BACKEND[tipo] ?? 'INTERNO';

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
  role: UserRole;
  tipo: UserType;
  relationshipType?: string;
  relationshipDescription?: string;
}

