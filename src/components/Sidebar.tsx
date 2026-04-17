import { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService, type NotificationCountResponse } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/auth.types';

interface SidebarItem {
  label: string;
  path?: string;
  badge?: 'invitaciones' | 'calendario' | 'reglamento';
  action?: 'logout';
}

const itemsByRole: Record<UserRole, SidebarItem[]> = {
  JUGADOR: [
    { label: 'Principal', path: '/jugador/home' },
    { label: 'Perfil Deportivo', path: '/jugador/perfil-deportivo' },
    { label: 'Invitaciones', path: '/jugador/invitaciones', badge: 'invitaciones' },
    { label: 'Calendario', path: '/organizador/calendario', badge: 'calendario' },
    { label: 'Torneo', path: '/jugador/torneo' },
    { label: 'Reglamento', path: '/jugador/reglamento', badge: 'reglamento' },
    { label: 'Tabla de Posiciones', path: '/jugador/tabla-posiciones' },
    { label: 'Llaves', path: '/jugador/llaves' },
    { label: 'Salir', action: 'logout' },
  ],
  CAPITAN: [
    { label: 'Principal', path: '/capitan/home' },
    { label: 'Mi Equipo', path: '/capitan/equipo' },
    { label: 'Invitar Jugadores', path: '/capitan/invitar-jugadores' },
    { label: 'Mis Partidos', path: '/capitan/mis-partidos' },
    { label: 'Torneo', path: '/capitan/torneo' },
    { label: 'Reglamento', path: '/jugador/reglamento' },
    { label: 'Salir', action: 'logout' },
  ],
  ADMINISTRADOR: [
    { label: 'Principal', path: '/admin/home' },
    { label: 'Gestion de Torneo', path: '/admin/torneo' },
    { label: 'Equipos', path: '/admin/equipos' },
    { label: 'Partidos', path: '/admin/partidos' },
    { label: 'Resultados', path: '/admin/resultados' },
    { label: 'Salir', action: 'logout' },
  ],
  ARBITRO: [
    { label: 'Principal', path: '/arbitro/home' },
    { label: 'Mis Partidos Asignados', path: '/arbitro/partido/pendiente' },
    { label: 'Registrar Resultado', path: '/arbitro/registrar-goles' },
    { label: 'Salir', action: 'logout' },
  ],
  ORGANIZADOR: [
    { label: 'Principal', path: '/organizador/home' },
    { label: 'Calendario de Partidos', path: '/organizador/calendario' },
    { label: 'Gestion de Partidos', path: '/organizador/partidos' },
    { label: 'Torneo', path: '/organizador/torneo' },
    { label: 'Salir', action: 'logout' },
  ],
};

const defaultCounts: NotificationCountResponse = {
  unreadInvitations: 0,
  pendingCalendar: 0,
  reglamentoPendiente: false,
};

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const [counts, setCounts] = useState<NotificationCountResponse>(defaultCounts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await authService.getNotificationsCount(userId);
        setCounts(data);
      } catch {
        setCounts(defaultCounts);
        setError('No se pudieron cargar notificaciones.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user?.id]);

  const items = useMemo(() => {
    if (!role) return [];
    return itemsByRole[role];
  }, [role]);

  const renderBadge = (badgeType: SidebarItem['badge']) => {
    if (!badgeType || loading) return null;

    if (badgeType === 'invitaciones' && counts.unreadInvitations > 0) {
      return <span className="text-xs bg-red-500 text-white rounded-full px-2">{counts.unreadInvitations}</span>;
    }
    if (badgeType === 'calendario' && counts.pendingCalendar > 0) {
      return <span className="text-xs bg-green-500 text-white rounded-full px-2">{counts.pendingCalendar}</span>;
    }
    if (badgeType === 'reglamento' && counts.reglamentoPendiente) {
      return <span className="text-xs bg-orange-500 text-white rounded-full px-2">!</span>;
    }
    return null;
  };

  return (
    <aside className="w-64 min-h-screen p-4" style={{ background: '#000F20', borderRight: '1px solid #1a2a3a' }}>
      <h2 className="text-white text-2xl uppercase mb-6" style={{ fontFamily: "'Anton SC', sans-serif" }}>
        TechCup
      </h2>

      {error && <p className="text-xs text-yellow-300 mb-3">{error}</p>}

      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          if (item.action === 'logout') {
            return (
              <button
                key={item.label}
                onClick={logout}
                className="text-left px-3 py-2 rounded text-white/80 hover:text-white"
              >
                {item.label}
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path || '/'}
              onClick={(event) => {
                if (!item.path) {
                  event.preventDefault();
                  navigate('/');
                }
              }}
              className={({ isActive }) =>
                `px-3 py-2 rounded flex items-center justify-between ${
                  isActive ? 'bg-blue-700 text-white' : 'text-white/80 hover:text-white'
                }`
              }
            >
              <span>{item.label}</span>
              {renderBadge(item.badge)}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

