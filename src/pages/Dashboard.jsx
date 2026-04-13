import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoTCF from '../assets/logos/logo-tcf.png';
import robotConstructor from '../assets/robots/Contructor.png';
import robotCurioso from '../assets/robots/curioso rb 3.png';
import robotModal from '../assets/robots/robot-jugador.png';
import campus1 from '../assets/campus/campus-1.jpg';
import { authFetch } from '../services/api';


const IconHome     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const IconBall     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93V18h2v1.93c-3.05-.46-5.47-2.88-5.93-5.93H9v-2H7.07C7.53 8.95 9.95 6.53 13 6.07V8h-2V6.07C7.61 6.56 5 9.46 5 12c0 3.87 3.13 7 7 7z"/></svg>;
const IconMail     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>;
const IconCalendar = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>;
const IconInfo     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;
const IconReport   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>;
const IconGrid     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>;
const IconNetwork  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17 16l-4-4V8.82C14.16 8.4 15 7.3 15 6c0-1.66-1.34-3-3-3S9 4.34 9 6c0 1.3.84 2.4 2 2.82V12l-4 4H3v5h5v-3.05l4-4.2 4 4.2V21h5v-5h-4z"/></svg>;
const IconPower    = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M13 3h-2v10h2V3zm4.83 2.17-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>;
const IconArrow    = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>;
const IconUser     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const IconBadge    = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/></svg>;

// ── SIDEBAR ──
export function Sidebar({
  active,
  onLogout,
  unreadInvitations = 0,
  pendingCalendar = 0,
  reglamentoPendiente = false
}) {
  const navigate = useNavigate();
  const NAV = [
    { icon: <IconHome />, label: 'Principal', key: 'principal', path: '/dashboard' },

    { icon: <IconBall />, label: 'Perfil Deportivo', key: 'perfil', path: '/perfil-deportivo-user' },

    {
      icon: <IconMail />,
      label: 'Invitaciones',
      key: 'invitaciones',
      path: '/invitaciones',
      badge: unreadInvitations > 0 ? unreadInvitations : null
    },

    {
      icon: <IconCalendar />,
      label: 'Calendario',
      key: 'calendario',
      path: '/calendario',
      badge: pendingCalendar > 0 ? pendingCalendar : null
    },

    { icon: <IconInfo />, label: 'Torneo', key: 'torneo', path: '/torneo' },

    {
      icon: <IconReport />,
      label: 'Reglamento',
      key: 'reglamento',
      path: '/reglamento',
      alert: reglamentoPendiente
    },

    { icon: <IconGrid />, label: 'Tabla Posiciones', key: 'tabla', path: '/tabla' },

    { icon: <IconNetwork />, label: 'Llaves', key: 'llaves', path: '/llaves' },
  ];

  return (
    <div
      className="flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden group/sidebar z-20"
      style={{ background: '#000F20', width: '64px', borderRight: '1px solid #1a2a3a' }}
      onMouseEnter={e => e.currentTarget.style.width = '220px'}
      onMouseLeave={e => e.currentTarget.style.width = '64px'}
    >
      <div className="flex items-center px-3 py-5" style={{ borderBottom: '1px solid #1a2a3a' }}>
        <img src={logoTCF} alt="TCF" className="w-9 h-auto flex-shrink-0" />
      </div>

      <nav className="flex flex-col flex-1 py-4 gap-1">
        {NAV.map(({ icon, label, key, path, badge, alert }) => {
          const isActive = active === key;
          return (
            <button key={key} onClick={() => navigate(path)}
              className="flex items-center gap-3 px-[18px] py-3 relative whitespace-nowrap overflow-hidden transition-colors"
              style={{
                background: isActive ? '#003C81' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}}
            >
              <span className="relative flex-shrink-0">
                {icon}
                {badge && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    +{badge}
                  </span>
                )}
                {alert && <span className="absolute -top-1.5 -right-1.5 text-yellow-400 text-[10px]">⚠</span>}
              </span>
              <span className="text-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 delay-100"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-2">
        <span className="text-xs opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap"
          style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>
          ¿Necesitas ayuda?
        </span>
      </div>

      <div className="p-2" style={{ borderTop: '1px solid #1a2a3a' }}>
        <button onClick={onLogout}
          className="flex items-center gap-3 px-3 py-3 w-full rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <span className="flex-shrink-0"><IconPower /></span>
          <span className="text-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap"
            style={{ fontFamily: "'Poppins', sans-serif" }}>Salir</span>
        </button>
      </div>
    </div>
  );
}

// ── TOPBAR con menú de usuario ──
export function Topbar({ userName, userPhoto, userRole, fullName, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex items-center justify-between px-8 py-4 flex-shrink-0"
      style={{ background: '#000F20', borderBottom: '1px solid #1a2a3a' }}>
      <div className="flex items-center gap-3">
        <img src={logoTCF} alt="TCF" className="h-10 w-auto" />
        <span className="text-white text-2xl uppercase" style={{ fontFamily: "'Anton SC', sans-serif" }}>
          TechCup Futbol
        </span>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
          style={{ background: menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent' }}
          onMouseEnter={e => { if (!menuOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = 'transparent'; }}
        >
          <span className="text-white text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>{userName}</span>
          {userPhoto ? (
            <img src={userPhoto} alt="Perfil" className="w-10 h-10 rounded-full object-cover" style={{ border: '2px solid #003C81' }} />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: '#003C81', border: '2px solid #0055cc' }}>
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden shadow-2xl z-50"
            style={{ background: '#001540', border: '1px solid #1a2a3a', minWidth: '240px' }}>
            <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #1a2a3a', background: '#002060' }}>
              {userPhoto ? (
                <img src={userPhoto} alt="Perfil" className="w-12 h-12 rounded-full object-cover flex-shrink-0" style={{ border: '2px solid #003C81' }} />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                  style={{ background: '#003C81', border: '2px solid #0055cc' }}>
                  {userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-white font-semibold text-sm truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {fullName || userName}
                </span>
                <span className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter', sans-serif" }}>
                  @{userName?.toLowerCase().replace(/\s/g, '') || 'usuario'}
                </span>
              </div>
            </div>

            <div className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid #1a2a3a' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}><IconBadge /></span>
              <div className="flex flex-col">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>Rol</span>
                <span className="text-white text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{userRole || 'Jugador'}</span>
              </div>
            </div>

            <button className="w-full px-5 py-3 flex items-center gap-3 transition-colors text-left"
              style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
              <IconUser />
              <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Ver mi perfil</span>
            </button>

            <button onClick={onLogout}
              className="w-full px-5 py-3 flex items-center gap-3 transition-colors text-left"
              style={{ color: '#f87171', borderTop: '1px solid #1a2a3a' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <IconPower />
              <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MODAL LOGOUT ──
export function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="rounded-xl flex items-center gap-8 px-12 py-14 max-w-2xl w-full mx-6 relative overflow-visible"
        style={{ background: '#e8e8e8', minHeight: '280px' }}>
        <img src={robotModal} alt="Robot" className="w-auto object-contain"
          style={{ position: 'absolute', left: '-30px', bottom: '-22px', height: '420px' }} />
        <div style={{ minWidth: '180px' }} />
        <div className="flex flex-col gap-12">
          <p className="text-[#002652] text-xl uppercase font-bold leading-snug" style={{ fontFamily: "'Anton SC', sans-serif" }}>
            ¿Seguro que quieres cerrar sesión?
          </p>
          <div className="flex gap-8">
            <button onClick={onConfirm} className="px-6 py-3 text-white rounded text-base"
              style={{ background: '#002652', fontFamily: "'Poppins', sans-serif" }}>Sí, salir</button>
            <button onClick={onCancel} className="px-6 py-3 text-white rounded text-base"
              style={{ background: '#001a3a', fontFamily: "'Poppins', sans-serif" }}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PANTALLA EN CONSTRUCCIÓN ──
export function PantallaEnConstruccion({ titulo }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6" style={{ background: '#000F20' }}>
      <img src={robotConstructor} alt="En construcción" className="h-120 w-auto object-contain drop-shadow-2xl" />
      <div className="text-center">
        <h2 className="text-white text-3xl uppercase mb-2" style={{ fontFamily: "'Anton SC', sans-serif" }}>{titulo}</h2>
        <p className="text-yellow-400 text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>Próximamente disponible</p>
      </div>
    </div>
  );
}

// ── HOOK ──
export function useDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    authFetch('/profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setProfile(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/iniciar-sesion');
  };

  const userName = profile?.username || profile?.name || profile?.firstName || 'Usuario';
  const fullName = profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : profile?.name || userName;
  const userPhoto = profile?.photoUrl || profile?.photo || null;
  const userRole = profile?.role || profile?.rol || 'Jugador';

  return { profile, loading, userName, fullName, userPhoto, userRole, showLogoutModal, setShowLogoutModal, confirmLogout };
}

// TARJETA EN CONSTRUCCIÓN (compacta)
function ConstruccionInCard() {
  return (
    <div className="flex items-center justify-center gap-3 py-16">
      <img src={robotConstructor} alt="construcción" className="h-10 w-auto object-contain opacity-60" />
      <p className="text-yellow-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>En construcción</p>
    </div>
  );
}

//  DASHBOARD PRINCIPAL

export default function Dashboard() {
  const navigate = useNavigate();
  const { userName, fullName, userPhoto, userRole, loading, showLogoutModal, setShowLogoutModal, confirmLogout } = useDashboard();
  const handleLogout = () => setShowLogoutModal(true);

  const CARD = { background: 'rgba(0,32,96,0.82)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' };

  const accesos = [
    { label: 'Tabla de Posiciones', path: '/tabla',   svg: <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg> },
    { label: 'Llaves',              path: '/llaves',  svg: <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10"><path d="M17 16l-4-4V8.82C14.16 8.4 15 7.3 15 6c0-1.66-1.34-3-3-3S9 4.34 9 6c0 1.3.84 2.4 2 2.82V12l-4 4H3v5h5v-3.05l4-4.2 4 4.2V21h5v-5h-4z"/></svg> },
    { label: 'Torneo',              path: '/torneo',  svg: <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H9v2h6v-2h-2v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"/></svg> },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden relative" style={{ background: '#000F20' }}>

      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}

      <Sidebar
        active="principal"
        onLogout={handleLogout}
        unreadInvitations={3}
        pendingCalendar={1}
        reglamentoPendiente={true}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userName={loading ? '...' : userName}
          fullName={loading ? '...' : fullName}
          userPhoto={userPhoto}
          userRole={userRole}
          onLogout={handleLogout}
        />

        <div className="flex-1 overflow-y-auto relative" style={{ background: '#000F20' }}>

          {/* Hero fondo */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${campus1})` }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,15,32,0.55) 0%, rgba(0,15,32,0.82) 45%, rgba(0,15,32,0.97) 100%)' }} />
          </div>

          <div className="relative z-10 flex flex-col">

            {/* Saludo */}
            <div className="px-8 pt-7 pb-4">
              <h1 className="text-5xl text-white uppercase"
                style={{ fontFamily: "'Anton SC', sans-serif", textShadow: '2px 2px 12px rgba(0,0,0,0.8)' }}>
                Hola {loading ? '...' : userName}
              </h1>
            </div>

            {/* Grid principal — 2 columnas */}
            <div className="px-6 pb-8 grid grid-cols-2 gap-3">

              {/* Próximos Partidos */}
              <div className="rounded-xl p-4 min-h-[260px]" style={CARD}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-white text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Tus Próximos Partidos
                  </h2>
                  <button className="flex items-center gap-1 text-white text-xs rounded px-3 py-1"
                    style={{ border: '1px solid rgba(255,255,255,0.3)' }}>
                    Ver todos <IconArrow />
                  </button>
                </div>
                <ConstruccionInCard />
              </div>

              {/* Accesos Rápidos — 3 cards independientes */}
              <div className="grid grid-cols-3 gap-3">
                {accesos.map(({ label, path, svg }) => (
                  <button key={label} onClick={() => navigate(path)}
                    className="rounded-xl flex flex-col items-center justify-center gap-2 min-h-[260px] transition-colors"
                    style={CARD}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,60,129,0.9)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,32,96,0.82)'}
                  >
                    {svg}
                    <span className="text-white text-[10px] text-center leading-tight px-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Noticias & Datos */}
              <div className="rounded-xl p-4" style={CARD}>
                <h2 className="text-white text-sm font-semibold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Noticias & Datos
                </h2>
                <ConstruccionInCard />
              </div>

              {/* Tabla de Posiciones */}
              <div className="rounded-xl p-4" style={CARD}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-white text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Tabla de Posiciones
                  </h2>
                  <button className="flex items-center gap-1 text-white text-xs rounded px-3 py-1"
                    style={{ border: '1px solid rgba(255,255,255,0.3)' }}>
                    Ver todos <IconArrow />
                  </button>
                </div>
                <ConstruccionInCard />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Robot decorativo */}
      <div
        className="fixed pointer-events-none z-10"
        style={{
          width: '180px',
          bottom: '-16px',
          right: '-20px'
        }}
      >
        <img
          src={robotCurioso}
          alt="Robot Curioso"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}