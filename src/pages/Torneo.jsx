import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  Topbar,
  LogoutModal,
  useDashboard,
} from './Dashboard';
import { getTournamentSummary } from '../services/api';
import TarjetasModal from '../components/torneo/TarjetasModal';
import EstadisticasModal from '../components/torneo/EstadisticasModal';
import robotCurioso from '../assets/robots/curioso rb 2.png';
import robotJugador from '../assets/robots/robot-jugador.png';
import logoTcf from '../assets/logos/logo-tcf.png';

const STATUS_META = {
  IN_PROGRESS: { label: 'En progreso', bg: '#0b8f0f' },
  FINISHED: { label: 'Terminado', bg: '#6b7280' },
  CANCELLED: { label: 'Cancelado', bg: '#dc2626' },
  PAUSED: { label: 'Pausado', bg: '#f59e0b' },
  SCHEDULED: { label: 'Programado', bg: '#2563eb' },
};

const normalizeStatusKey = (raw) => {
  const value = String(raw ?? '').trim().toLowerCase();
  if (!value) return 'IN_PROGRESS';

  // Español / Inglés / enums comunes
  if (['en progreso', 'progreso', 'in_progress', 'in progress', 'active', 'activo', 'playing', 'en_curso', 'en curso'].includes(value)) {
    return 'IN_PROGRESS';
  }
  if (['terminado', 'finalizado', 'finished', 'completed', 'done', 'ended', 'final', 'cerrado', 'closed'].includes(value)) {
    return 'FINISHED';
  }
  if (['cancelado', 'canceled', 'cancelled', 'anulado', 'suspended', 'suspendido'].includes(value)) {
    return 'CANCELLED';
  }
  if (['pausado', 'paused', 'on_hold', 'en pausa', 'en_pausa'].includes(value)) {
    return 'PAUSED';
  }
  if (['programado', 'scheduled', 'pending', 'pendiente', 'por iniciar', 'por_iniciar'].includes(value)) {
    return 'SCHEDULED';
  }

  return 'IN_PROGRESS';
};

const PHASE_META = {
  GROUPS: { label: 'Fase de Grupos' },
  ROUND_OF_16: { label: 'Octavos' },
  QUARTERFINALS: { label: 'Cuartos' },
  SEMIFINALS: { label: 'Semifinal' },
  FINAL: { label: 'Final' },
};

const PHASE_ORDER = ['GROUPS', 'ROUND_OF_16', 'QUARTERFINALS', 'SEMIFINALS', 'FINAL'];

const normalizePhaseKey = (raw) => {
  const value = String(raw ?? '').trim().toLowerCase();
  if (!value) return 'GROUPS';

  if (['fase de grupos', 'grupos', 'group', 'groups', 'group_stage', 'group stage'].includes(value)) return 'GROUPS';
  if (['octavos', 'octavos de final', 'round of 16', 'round_of_16', 'r16', 'ro16'].includes(value)) return 'ROUND_OF_16';
  if (['cuartos', 'cuartos de final', 'quarter', 'quarterfinal', 'quarter-finals', 'quarter_finals', 'qf'].includes(value)) return 'QUARTERFINALS';
  if (['semifinal', 'semifinales', 'semi', 'semi final', 'semi-final', 'semifinals', 'semi_finals', 'sf', 'semifinal'].includes(value)) {
    return 'SEMIFINALS';
  }
  if (['final', 'grand final', 'finale'].includes(value)) return 'FINAL';

  return 'GROUPS';
};

const buildPhaseStack = (currentPhaseKey) => {
  // UI como el mock: muestra la fase actual + SEMIFINALS + FINAL.
  // (Sin selección; solo se resalta la fase actual que llega del backend)
  const currentIndex = PHASE_ORDER.indexOf(currentPhaseKey);
  if (currentIndex === -1) return ['GROUPS', 'SEMIFINALS', 'FINAL'];

  const stack = [currentPhaseKey];
  for (const k of ['SEMIFINALS', 'FINAL']) {
    if (!stack.includes(k) && PHASE_ORDER.indexOf(k) > currentIndex) stack.push(k);
  }
  return stack;
};

const normalizeTournamentSummary = (payload) => {
  if (!payload) {
    const statusKey = normalizeStatusKey('En progreso');
    const phaseKey = normalizePhaseKey('Fase de Grupos');
    return {
      name: 'TechCup Futbol',
      year: '2026',
      statusKey,
      status: STATUS_META[statusKey]?.label || 'En progreso',
      startDate: '',
      endDate: '',
      fields: [],
      teams: [],
      phaseKey,
      phase: PHASE_META[phaseKey]?.label || 'Fase de Grupos',
    };
  }

  const name =
    payload.name ||
    payload.nombre ||
    payload.tournamentName ||
    payload.torneoNombre ||
    'TechCup Futbol';

  const year = String(payload.year || payload.anio || payload.año || payload.season || '2026');

  const rawStatus = payload.status || payload.estado || payload.state || payload.stageStatus || 'En progreso';
  const statusKey = normalizeStatusKey(rawStatus);
  const status = STATUS_META[statusKey]?.label || String(rawStatus);

  const startDate = payload.startDate || payload.fechaInicio || payload.inicio || payload.start || '';
  const endDate = payload.endDate || payload.fechaFin || payload.fin || payload.end || '';

  const fieldsRaw = payload.fields || payload.canchas || payload.venues || payload.courts || [];
  const fields = (Array.isArray(fieldsRaw) ? fieldsRaw : []).map((f) => (typeof f === 'string' ? f : f?.name || f?.nombre)).filter(Boolean);

  const teamsRaw = payload.teams || payload.equipos || payload.registeredTeams || payload.inscritos || [];
  const teams = (Array.isArray(teamsRaw) ? teamsRaw : []).map((t, idx) => {
    if (typeof t === 'string') return { id: `${idx}`, nombre: t, escudoUrl: null };
    return {
      id: t?._id || t?.id || `${idx}`,
      nombre: t?.nombre || t?.name || 'Equipo',
      escudoUrl: t?.escudoUrl || t?.crest || t?.logo || t?.shield || null,
    };
  });

  const rawPhase = payload.phase || payload.fase || payload.currentPhase || 'Fase de Grupos';
  const phaseKey = normalizePhaseKey(rawPhase);
  const phase = PHASE_META[phaseKey]?.label || String(rawPhase);

  return { name, year, statusKey, status, startDate, endDate, fields, teams, phaseKey, phase };
};

function IconCancha() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="3">
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
          className="w-14 h-14 rounded-full flex items-center justify-center text-[10px] text-white font-semibold"
          style={{ background: 'linear-gradient(135deg, #0f3f85 0%, #002652 100%)', border: '2px solid #d0d7e2' }}
        >
          {String(nombre)
            .split(' ')
            .filter(Boolean)
            .map((chunk) => chunk[0])
            .join('')
            .slice(0, 3)}
        </div>
      )}
    </div>
  );
}

export default function Torneo() {
  const navigate = useNavigate();
  const location = useLocation();

  const [summary, setSummary] = useState(() => normalizeTournamentSummary(null));
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  const [openTarjetas, setOpenTarjetas] = useState(false);
  const [openEstadisticas, setOpenEstadisticas] = useState(false);

  const statusMeta = STATUS_META[summary.statusKey] || STATUS_META.IN_PROGRESS;

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
    if (location.pathname.startsWith('/jugador/')) return '/jugador';
    if (location.pathname.startsWith('/capitan/')) return '/capitan';
    if (location.pathname.startsWith('/admin/')) return '/admin';
    if (location.pathname.startsWith('/arbitro/')) return '/arbitro';
    if (location.pathname.startsWith('/organizador/')) return '/organizador';
    return '';
  }, [location.pathname]);

  const openLlaves = () => navigate(routePrefix ? `${routePrefix}/llaves` : '/llaves');
  const openReglamento = () => navigate(routePrefix ? `${routePrefix}/reglamento` : '/reglamento');
  const openCalendario = () => navigate(routePrefix ? `${routePrefix}/calendario` : '/calendario');
  const openTabla = () => navigate(routePrefix ? `${routePrefix}/tabla-posiciones` : '/tabla');

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const payload = await getTournamentSummary();
        setSummary(normalizeTournamentSummary(payload));
      } catch (e) {
        setSummaryError(e?.message || 'No se pudo cargar la informacion del torneo');
        setSummary(normalizeTournamentSummary(null));
      } finally {
        setSummaryLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden relative" style={{ background: '#000F20' }}>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      <TarjetasModal open={openTarjetas} onClose={() => setOpenTarjetas(false)} />
      <EstadisticasModal open={openEstadisticas} onClose={() => setOpenEstadisticas(false)} />

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

        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ background: '#c9ccd2' }}>
          <section className="max-w-[1320px] mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1
                  className="text-[52px] leading-none uppercase text-black"
                  style={{ fontFamily: "'Anton SC', sans-serif" }}
                >
                  {summary.name} {summary.year}
                </h1>
                <img src={logoTcf} alt="TCF" className="w-12 h-12 object-contain" />
              </div>
              <span
                className="px-6 py-2 text-white text-2xl uppercase"
                style={{ background: statusMeta.bg, fontFamily: "'Oswald', sans-serif" }}
              >
                {summary.status}
              </span>
            </div>

            {summaryError && !summaryLoading && (
              <div
                className="rounded-lg p-3 mb-4"
                style={{ background: 'rgba(200, 100, 100, 0.2)', border: '1px solid rgba(200, 100, 100, 0.5)' }}
              >
                <p className="text-red-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ⚠️ {summaryError}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1 text-white text-2xl" style={{ background: '#003C81', fontFamily: "'Oswald', sans-serif" }}>
                Inicio {summary.startDate || '--/--/----'}
              </span>
              <span className="px-4 py-1 text-white text-2xl" style={{ background: '#003C81', fontFamily: "'Oswald', sans-serif" }}>
                Fin {summary.endDate || '--/--/----'}
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2.15fr_1fr] gap-3">
              <div className="rounded-md p-4" style={{ background: '#003C81' }}>
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 items-start">
                  <div>
                    <h2 className="text-white text-3xl mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
                      Equipos inscritos
                    </h2>
                    <div className="flex items-center gap-2 overflow-x-auto py-2">
                      <button className="text-white text-2xl px-2">&lt;</button>
                      {summary.teams.map((equipo) => (
                        <Escudo key={equipo.id} nombre={equipo.nombre} escudoUrl={equipo.escudoUrl} />
                      ))}
                      <button className="text-white text-2xl px-2">&gt;</button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-white text-3xl mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
                      Canchas:
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {summary.fields.map((cancha) => (
                        <div key={cancha} className="text-white">
                          <div className="rounded-md p-2 h-[78px]" style={{ background: '#0a356d' }}>
                            <IconCancha />
                          </div>
                          <p className="text-center text-xl mt-1" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            {cancha}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-[2px] my-4" style={{ background: 'rgba(255,255,255,0.8)' }} />

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.2fr] gap-4 items-end">
                  <div className="rounded-3xl p-4 flex flex-col items-center justify-center gap-4 h-[190px]" style={{ background: '#001b45' }}>
                    <button
                      type="button"
                      onClick={() => setOpenTarjetas(true)}
                      className="w-full h-full flex flex-col items-center justify-center gap-4 rounded-3xl transition hover:brightness-110"
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      <div className="flex gap-3">
                        <span className="block w-14 h-24 rotate-[-5deg]" style={{ background: '#ff1616' }} />
                        <span className="block w-14 h-24 rotate-[7deg]" style={{ background: '#ffd400' }} />
                      </div>
                      <p className="text-white text-4xl">Tarjetas</p>
                    </button>
                  </div>

                  <div className="rounded-3xl p-4 flex flex-col items-center justify-center gap-4 h-[190px]" style={{ background: '#001b45' }}>
                    <button
                      type="button"
                      onClick={() => setOpenEstadisticas(true)}
                      className="w-full h-full flex flex-col items-center justify-center gap-4 rounded-3xl transition hover:brightness-110"
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      <svg viewBox="0 0 64 64" className="w-20 h-20" fill="none" stroke="white" strokeWidth="4">
                        <line x1="8" y1="56" x2="8" y2="8" />
                        <line x1="8" y1="56" x2="56" y2="56" />
                        <rect x="16" y="24" width="6" height="32" fill="white" />
                        <rect x="28" y="14" width="6" height="42" fill="white" />
                        <rect x="40" y="30" width="6" height="26" fill="white" />
                        <rect x="52" y="20" width="6" height="36" fill="white" />
                      </svg>
                      <p className="text-white text-4xl">Estadisticas</p>
                    </button>
                  </div>

                  <div className="p-2 relative min-h-[190px]">
                    <h3 className="text-white text-4xl mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
                      Fase del Torneo
                    </h3>
                    <div className="flex flex-col gap-2 max-w-[250px]">
                      {buildPhaseStack(summary.phaseKey).map((key) => {
                        const label = PHASE_META[key]?.label || key;
                        const isActive = summary.phaseKey === key;
                        return (
                          <span
                            key={key}
                            className="text-white px-3 py-1 text-3xl"
                            style={{
                              background: isActive ? '#0b99d3' : '#001b45',
                              fontFamily: "'Oswald', sans-serif",
                            }}
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                    <img
                      src={robotJugador}
                      alt="Robot"
                      className="absolute right-0 bottom-0 w-28 h-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-rows-[1fr_1fr] gap-3">
                <div className="rounded-md p-4 relative" style={{ background: '#001b45' }}>
                  <h3 className="text-white text-5xl mb-6" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    Fase eliminatoria:
                  </h3>
                  <button
                    onClick={openLlaves}
                    className="px-8 py-2 text-white text-2xl rounded"
                    style={{ background: '#003C81', fontFamily: "'Oswald', sans-serif" }}
                  >
                    Ver llave
                  </button>
                  <img
                    src={robotJugador}
                    alt="Robot"
                    className="absolute right-2 bottom-0 w-36 h-auto"
                  />
                </div>

                <div className="rounded-md p-4 relative" style={{ background: '#001b45' }}>
                  <h3 className="text-white text-5xl leading-tight mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    Cosas que te podrian interesar:
                  </h3>
                  <div className="flex flex-col gap-3 max-w-[220px]">
                    <button onClick={openReglamento} className="px-4 py-2 text-white text-2xl rounded" style={{ background: '#003C81', fontFamily: "'Oswald', sans-serif" }}>
                      Ver Reglamento
                    </button>
                    <button onClick={openCalendario} className="px-4 py-2 text-white text-2xl rounded" style={{ background: '#003C81', fontFamily: "'Oswald', sans-serif" }}>
                      Ver calendario
                    </button>
                    <button onClick={openTabla} className="px-4 py-2 text-white text-2xl rounded" style={{ background: '#003C81', fontFamily: "'Oswald', sans-serif" }}>
                      Ver tabla
                    </button>
                  </div>
                  <img src={robotCurioso} alt="Robot" className="absolute right-[-8px] bottom-[-8px] w-32 h-auto" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
