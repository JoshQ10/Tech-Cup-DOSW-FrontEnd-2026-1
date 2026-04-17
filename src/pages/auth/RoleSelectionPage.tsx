import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useAuthContext } from '../../store/AuthContext';
import type { UserRole } from '../../types/auth.types';
import { getRoleDashboard } from '../../routes/rolePaths';

interface RoleCard {
  role: UserRole;
  title: string;
  description: string;
}

const ROLE_CARDS: RoleCard[] = [
  { role: 'JUGADOR', title: 'Jugador', description: 'Listo para empezar a jugar' },
  { role: 'CAPITAN', title: 'Capitan', description: 'Listo para dirigir' },
  { role: 'ADMINISTRADOR', title: 'Administrador', description: 'Listo para administrar' },
  { role: 'ARBITRO', title: 'Arbitro', description: 'Listo para arbitrar' },
  { role: 'ORGANIZADOR', title: 'Organizador', description: 'Listo para coordinar' },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { user, role, setRole, updateUser } = useAuthContext();

  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);
  const [error, setError] = useState('');

  const roleCards = useMemo(() => ROLE_CARDS, []);

  useEffect(() => {
    if (role) {
      navigate(getRoleDashboard(role), { replace: true });
    }
  }, [role, navigate]);

  const selectRole = async (selectedRole: UserRole) => {
    if (!user?.id) {
      setError('No se pudo identificar el usuario autenticado.');
      return;
    }

    setLoadingRole(selectedRole);
    setError('');

    try {
      await authService.setUserRole(user.id, selectedRole);
      setRole(selectedRole);
      updateUser({ ...user, role: selectedRole, profileComplete: user.profileComplete });
      navigate(getRoleDashboard(selectedRole), { replace: true });
    } catch {
      setError('No se pudo guardar el rol. Intenta nuevamente.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: '#000F20' }}>
      <h1 className="text-white text-4xl uppercase text-center mb-8" style={{ fontFamily: "'Anton SC', sans-serif" }}>
        Selecciona tu rol
      </h1>

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {roleCards.map((item) => (
          <button
            key={item.role}
            onClick={() => void selectRole(item.role)}
            disabled={loadingRole !== null || !user?.id}
            className="p-5 rounded-xl text-left disabled:opacity-60 transition-colors"
            style={{
              background: 'rgba(0,32,96,0.82)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div className="w-14 h-14 rounded-full mb-4 flex items-center justify-center text-xl"
              style={{ background: '#003C81', color: '#fff' }}>
              TCF
            </div>
            <h2 className="text-white text-2xl uppercase" style={{ fontFamily: "'Anton SC', sans-serif" }}>
              {item.title}
            </h2>
            <p className="text-white/80 text-sm mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              {loadingRole === item.role ? 'Guardando...' : item.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
