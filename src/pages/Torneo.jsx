import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Sidebar,
    Topbar,
    LogoutModal,
    useDashboard,
} from './Dashboard';
import TarjetasModal from '../components/torneo/TarjetasModal';
import EstadisticasModal from '../components/torneo/EstadisticasModal';
import robotCurioso from '../assets/robots/curioso rb 2.png';
import robotFinalLlaves from '../assets/robots/robot final llaves.png';
import robotConPalomitas from '../assets/robots/robot con palomitas.png';
import logoTcf from '../assets/logos/logo-tcf.png';

// ─── DATOS QUEMADOS ───────────────────────────────────────────────
const SUMMARY_DATA = {
    name: 'TechCup Futbol',
    year: '2026',
    status: 'En progreso',
    statusBg: '#0b8f0f',
    startDate: '01/03/2026',
    endDate: '31/05/2026',
    teams: [
        { id: '1', nombre: 'Equipo 1', escudoUrl: null },
        { id: '2', nombre: 'Equipo 2', escudoUrl: null },
        { id: '3', nombre: 'Equipo 3', escudoUrl: null },
        { id: '4', nombre: 'Equipo 4', escudoUrl: null },
    ],
    fields: ['Julio garavito', 'Julio garavito 2'],
    phases: [
        { key: 'GROUPS',    label: 'Fase De Grupos', active: true  },
        { key: 'SEMIFINALS',label: 'SemiFinal',       active: false },
        { key: 'FINAL',     label: 'Final',           active: false },
    ],
};
// ──────────────────────────────────────────────────────────────────

function IconCancha() {
    return (
        <svg
            viewBox="0 0 120 80"
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
        >
            <rect x="3" y="3" width="114" height="74" rx="6" />
            <line x1="60" y1="3" x2="60" y2="77" />
            <circle cx="60" cy="40" r="10" />
            <rect x="3" y="24" width="18" height="32" />
            <rect x="99" y="24" width="18" height="32" />
        </svg>
    );
}

function Escudo({ nombre, escudoUrl }) {
    return (
        <div className="flex flex-col items-center gap-1 min-w-[74px]">
            {escudoUrl ? (
                <img
                    src={escudoUrl}
                    alt={nombre}
                    className="w-14 h-14 rounded-full object-cover"
                    style={{ border: '2px solid #d0d7e2', background: 'white' }}
                />
            ) : (
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center
                                text-[10px] text-white font-semibold"
                    style={{
                        background: 'linear-gradient(135deg, #0f3f85 0%, #002652 100%)',
                        border: '2px solid #d0d7e2',
                    }}
                >
                    {String(nombre)
                        .split(' ')
                        .filter(Boolean)
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 3)}
                </div>
            )}
        </div>
    );
}

export default function Torneo() {
    const navigate  = useNavigate();
    const location  = useLocation();

    const [openTarjetas,     setOpenTarjetas]     = useState(false);
    const [openEstadisticas, setOpenEstadisticas] = useState(false);

    const {
        userName,
        userPhoto,
        fullName,
        userRole,
        loading,
        showLogoutModal,
        setShowLogoutModal,
        confirmLogout,
    } = useDashboard();

    const routePrefix = useMemo(() => {
        if (location.pathname.startsWith('/jugador/'))     return '/jugador';
        if (location.pathname.startsWith('/capitan/'))     return '/capitan';
        if (location.pathname.startsWith('/admin/'))       return '/admin';
        if (location.pathname.startsWith('/arbitro/'))     return '/arbitro';
        if (location.pathname.startsWith('/organizador/')) return '/organizador';
        return '';
    }, [location.pathname]);

    const go = (path) =>
        navigate(routePrefix ? `${routePrefix}${path}` : path);

    return (
        <div
            className="flex h-screen w-full overflow-hidden relative"
            style={{ background: '#000F20' }}
        >
            {showLogoutModal && (
                <LogoutModal
                    onConfirm={confirmLogout}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}

            <TarjetasModal
                open={openTarjetas}
                onClose={() => setOpenTarjetas(false)}
            />
            <EstadisticasModal
                open={openEstadisticas}
                onClose={() => setOpenEstadisticas(false)}
            />

            <Sidebar
                active="torneo"
                onLogout={() => setShowLogoutModal(true)}
                unreadInvitations={3}
                pendingCalendar={1}
                reglamentoPendiente={true}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar
                    userName={loading ? '...' : userName}
                    userPhoto={userPhoto}
                    fullName={fullName}
                    userRole={userRole}
                    onLogout={() => setShowLogoutModal(true)}
                />

                <div
                    className="flex-1 overflow-y-auto px-6 py-4"
                    style={{ background: '#c9ccd2' }}
                >
                    <section className="max-w-[1320px] mx-auto">

                        {/* ── HEADER ── */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <h1
                                    className="text-[52px] leading-none uppercase text-black"
                                    style={{ fontFamily: "'Anton SC', sans-serif" }}
                                >
                                    {SUMMARY_DATA.name} {SUMMARY_DATA.year}
                                </h1>
                                <img
                                    src={logoTcf}
                                    alt="TCF"
                                    className="w-12 h-12 object-contain"
                                />
                            </div>
                            <span
                                className="px-6 py-2 text-white text-2xl uppercase"
                                style={{
                                    background: SUMMARY_DATA.statusBg,
                                    fontFamily: "'Oswald', sans-serif",
                                }}
                            >
                                {SUMMARY_DATA.status}
                            </span>
                        </div>

                        {/* ── FECHAS ── */}
                        <div className="flex items-center gap-3 mb-4">
                            <span
                                className="px-4 py-1 text-white text-2xl"
                                style={{
                                    background: '#003C81',
                                    fontFamily: "'Oswald', sans-serif",
                                }}
                            >
                                Inicio {SUMMARY_DATA.startDate}
                            </span>
                            <span
                                className="px-4 py-1 text-white text-2xl"
                                style={{
                                    background: '#003C81',
                                    fontFamily: "'Oswald', sans-serif",
                                }}
                            >
                                Fin {SUMMARY_DATA.endDate}
                            </span>
                        </div>

                        {/* ── GRID PRINCIPAL ── */}
                        <div className="grid grid-cols-1 xl:grid-cols-[2.15fr_1fr] gap-3">

                            {/* ── PANEL IZQUIERDO ── */}
                            <div
                                className="rounded-md p-4"
                                style={{ background: '#003C81' }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 items-start">

                                    {/* Equipos inscritos */}
                                    <div>
                                        <h2
                                            className="text-white text-3xl mb-2"
                                            style={{ fontFamily: "'Oswald', sans-serif" }}
                                        >
                                            Equipos inscritos
                                        </h2>
                                        <div className="flex items-center gap-2 overflow-x-auto py-2">
                                            <button className="text-white text-2xl px-2">&lt;</button>
                                            {SUMMARY_DATA.teams.map((equipo) => (
                                                <Escudo
                                                    key={equipo.id}
                                                    nombre={equipo.nombre}
                                                    escudoUrl={equipo.escudoUrl}
                                                />
                                            ))}
                                            <button className="text-white text-2xl px-2">&gt;</button>
                                        </div>
                                    </div>

                                    {/* Canchas */}
                                    <div>
                                        <h2
                                            className="text-white text-3xl mb-2"
                                            style={{ fontFamily: "'Oswald', sans-serif" }}
                                        >
                                            Canchas:
                                        </h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            {SUMMARY_DATA.fields.map((cancha) => (
                                                <div key={cancha} className="text-white">
                                                    <div
                                                        className="rounded-md p-2 h-[78px]"
                                                        style={{ background: '#0a356d' }}
                                                    >
                                                        <IconCancha />
                                                    </div>
                                                    <p
                                                        className="text-center text-xl mt-1"
                                                        style={{ fontFamily: "'Oswald', sans-serif" }}
                                                    >
                                                        {cancha}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Divisor */}
                                <div
                                    className="h-[2px] my-4"
                                    style={{ background: 'rgba(255,255,255,0.8)' }}
                                />

                                {/* Tarjetas / Estadísticas / Fase */}
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr] gap-4 items-end">

                                    {/* Tarjetas */}
                                    <div
                                        className="rounded-3xl p-4 flex flex-col items-center
                                                    justify-center gap-4 h-[190px]"
                                        style={{ background: '#001b45' }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenTarjetas(true)}
                                            className="w-full h-full flex flex-col items-center
                                                       justify-center gap-4 rounded-3xl
                                                       transition hover:brightness-110"
                                            style={{ fontFamily: "'Oswald', sans-serif" }}
                                        >
                                            <div className="flex gap-3">
                                                <span
                                                    className="block w-14 h-24 rotate-[-5deg]"
                                                    style={{ background: '#ff1616' }}
                                                />
                                                <span
                                                    className="block w-14 h-24 rotate-[7deg]"
                                                    style={{ background: '#ffd400' }}
                                                />
                                            </div>
                                            <p className="text-white text-4xl">Tarjetas</p>
                                        </button>
                                    </div>

                                    {/* Estadísticas */}
                                    <div
                                        className="rounded-3xl p-4 flex flex-col items-center
                                                    justify-center gap-4 h-[190px]"
                                        style={{ background: '#001b45' }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenEstadisticas(true)}
                                            className="w-full h-full flex flex-col items-center
                                                       justify-center gap-4 rounded-3xl
                                                       transition hover:brightness-110"
                                            style={{ fontFamily: "'Oswald', sans-serif" }}
                                        >
                                            <svg
                                                viewBox="0 0 64 64"
                                                className="w-20 h-20"
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="4"
                                            >
                                                <line x1="8" y1="56" x2="8"  y2="8"  />
                                                <line x1="8" y1="56" x2="56" y2="56" />
                                                <rect x="16" y="24" width="6" height="32" fill="white" />
                                                <rect x="28" y="14" width="6" height="42" fill="white" />
                                                <rect x="40" y="30" width="6" height="26" fill="white" />
                                                <rect x="52" y="20" width="6" height="36" fill="white" />
                                            </svg>
                                            <p className="text-white text-4xl">Estadisticas</p>
                                        </button>
                                    </div>

                                    {/* Fase del Torneo */}
                                    <div className="p-2 relative min-h-[190px]">
                                        <h3
                                            className="text-white text-4xl mb-2"
                                            style={{ fontFamily: "'Oswald', sans-serif" }}
                                        >
                                            Fase del Torneo
                                        </h3>
                                        <div className="flex flex-col gap-2 max-w-[250px]">
                                            {SUMMARY_DATA.phases.map((phase) => (
                                                <span
                                                    key={phase.key}
                                                    className="text-white px-3 py-1 text-3xl"
                                                    style={{
                                                        background: phase.active
                                                            ? '#0b99d3'
                                                            : '#001b45',
                                                        fontFamily: "'Oswald', sans-serif",
                                                    }}
                                                >
                                                    {phase.label}
                                                </span>
                                            ))}
                                        </div>
                                        <img
                                            src={robotConPalomitas}
                                            alt="Robot"
                                            className="absolute right-[-15px] bottom-[-10px] w-40 h-auto"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── PANEL DERECHO ── */}
                            <div className="grid grid-rows-[1fr_1fr] gap-3">

                                {/* Fase eliminatoria */}
                                <div
                                    className="rounded-md p-4 relative"
                                    style={{ background: '#001b45' }}
                                >
                                    <h3
                                        className="text-white text-5xl mb-6"
                                        style={{ fontFamily: "'Oswald', sans-serif" }}
                                    >
                                        Fase eliminatoria:
                                    </h3>
                                    <button
                                        onClick={() => go('/llaves')}
                                        className="px-8 py-2 text-white text-2xl rounded"
                                        style={{
                                            background: '#003C81',
                                            fontFamily: "'Oswald', sans-serif",
                                        }}
                                    >
                                        Ver llave
                                    </button>
                                    <img
                                        src={robotFinalLlaves}
                                        alt="Robot"
                                        className="absolute right-[-10px] bottom-[-5px] w-48 h-auto"
                                    />
                                </div>

                                {/* Cosas que te podrían interesar */}
                                <div
                                    className="rounded-md p-4 relative"
                                    style={{ background: '#001b45' }}
                                >
                                    <h3
                                        className="text-white text-5xl leading-tight mb-4"
                                        style={{ fontFamily: "'Oswald', sans-serif" }}
                                    >
                                        Cosas que te podrian interesar:
                                    </h3>
                                    <div className="flex flex-col gap-3 max-w-[220px]">
                                        <button
                                            onClick={() => go('/reglamento')}
                                            className="px-4 py-2 text-white text-2xl rounded"
                                            style={{
                                                background: '#003C81',
                                                fontFamily: "'Oswald', sans-serif",
                                            }}
                                        >
                                            Ver Reglamento
                                        </button>
                                        <button
                                            onClick={() => go('/calendario')}
                                            className="px-4 py-2 text-white text-2xl rounded"
                                            style={{
                                                background: '#003C81',
                                                fontFamily: "'Oswald', sans-serif",
                                            }}
                                        >
                                            Ver calendario
                                        </button>
                                        <button
                                            onClick={() => go('/tabla-posiciones')}
                                            className="px-4 py-2 text-white text-2xl rounded"
                                            style={{
                                                background: '#003C81',
                                                fontFamily: "'Oswald', sans-serif",
                                            }}
                                        >
                                            Ver tabla
                                        </button>
                                    </div>
                                    <img
                                        src={robotCurioso}
                                        alt="Robot"
                                        className="absolute right-[-10px] bottom-[-10px] w-32 h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}