import type { UserRole } from '../types/auth.types';

export const getRoleDashboard = (role: UserRole): string => {
  switch (role) {
    case 'JUGADOR':
      return '/jugador/home';
    case 'CAPITAN':
      return '/capitan/home';
    case 'ADMINISTRADOR':
      return '/admin/home';
    case 'ARBITRO':
      return '/arbitro/home';
    case 'ORGANIZADOR':
      return '/organizador/home';
    default:
      return '/login';
  }
};

