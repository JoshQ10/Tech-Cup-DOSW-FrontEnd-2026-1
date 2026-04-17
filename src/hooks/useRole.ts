import { useMemo } from 'react';
import { useAuthContext } from '../store/AuthContext';
import type { UserRole } from '../types/auth.types';

export function useRole() {
  const { role } = useAuthContext();

  const is = (target: UserRole): boolean => role === target;

  return useMemo(
    () => ({
      role,
      isJugador: is('JUGADOR'),
      isCapitan: is('CAPITAN'),
      isAdministrador: is('ADMINISTRADOR'),
      isArbitro: is('ARBITRO'),
      isOrganizador: is('ORGANIZADOR'),
    }),
    [role]
  );
}

