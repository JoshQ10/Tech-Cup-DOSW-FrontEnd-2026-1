import { useState, useEffect } from 'react';
import { Sidebar, Topbar, LogoutModal, useDashboard } from './Dashboard';
import { authFetch } from '../services/api';
import logoTCF from '../assets/logos/logo-tcf.png';
import robotCurioso from '../assets/robots/robot-curioso.png';

const TCF_FALLBACK = (
  <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.25)" className="w-7 h-7">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93V18h2v1.93c-3.05-.46-5.47-2.88-5.93-5.93H9v-2H7.07C7.53 8.95 9.95 6.53 13 6.07V8h-2V6.07C7.61 6.56 5 9.46 5 12c0 3.87 3.13 7 7 7z" />
  </svg>
);

function normalizarEquipo(raw) {
  return {
    id: raw._id || raw.id,
    nombre: raw.nombre || raw.name || raw.teamName || 'Equipo',
    logo: raw.logo || raw.logoUrl || raw.escudo || null,
    pj: raw.pj ?? raw.partidosJugados ?? raw.played ?? 0,
    pg: raw.pg ?? raw.partidosGanados ?? raw.won ?? 0,
    pe: raw.pe ?? raw.partidosEmpatados ?? raw.drawn ?? 0,
    pp: raw.pp ?? raw.partidosPerdidos ?? raw.lost ?? 0,
    gf: raw.gf ?? raw.golesFavor ?? raw.goalsFor ?? 0,
    gc: raw.gc ?? raw.golesContra ?? raw.goalsAgainst ?? 0,
    dc: raw.dc ?? raw.diferencia ?? raw.goalDifference ?? (
      (raw.gf ?? raw.golesFavor ?? raw.goalsFor ?? 0) -
      (raw.gc ?? raw.golesContra ?? raw.goalsAgainst ?? 0)
    ),
    pts: raw.pts ?? raw.puntos ?? raw.points ?? 0,
  };
}

const COLS = [
  { key: 'pos',    label: 'Pos',  w: '60px'  },
  { key: 'equipo', label: 'Equipo', w: '200px' },
  { key: 'pj',     label: 'PJ',   w: '44px'  },
  { key: 'pg',     label: 'PG',   w: '44px'  },
  { key: 'pe',     label: 'PE',   w: '44px'  },
  { key: 'pp',     label: 'PP',   w: '44px'  },
  { key: 'gf',     label: 'GF',   w: '44px'  },
  { key: 'gc',     label: 'GC',   w: '44px'  },
  { key: 'dc',     label: 'DC',   w: '52px'  },
  { key: 'pts',    label: 'pts',  w: '52px'  },
];

function PosCircle({ pos }) {
  if (pos > 3) {
    return (
      <span className="text-white font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {pos}
      </span>
    );
  }
  const colors = ['#22c55e', '#22c55e', '#22c55e'];
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white font-bold text-sm"
      style={{ background: colors[pos - 1], fontFamily: "'Poppins', sans-serif" }}
    >
      {pos}
    </span>
  );
}

function LogoEquipo({ logo, nombre }) {
  const [err, setErr] = useState(false);
  if (logo && !err) {
    return (
      <img
        src={logo}
        alt={nombre}
        className="w-7 h-7 object-contain rounded-full flex-shrink-0"
        onError={() => setErr(true)}
      />
    );
  }
  return <span className="flex-shrink-0">{TCF_FALLBACK}</span>;
}

export default function TablaPosiciones() {
  const { userName, userPhoto, fullName, userRole, loading, showLogoutModal, setShowLogoutModal, confirmLogout } = useDashboard();
  const [equipos, setEquipos] = useState([]);
  const [loadingTabla, setLoadingTabla] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => setShowLogoutModal(true);

  useEffect(() => {
    const fetchTabla = async () => {
      try {
        setLoadingTabla(true);
        setError(null);
        const response = await authFetch('/standings');
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const raw = await response.json();
        const lista = Array.isArray(raw) ? raw : raw.data ?? raw.standings ?? [];
        const normalizados = lista.map(normalizarEquipo);
        normalizados.sort((a, b) => b.pts - a.pts || b.dc - a.dc || b.gf - a.gf);
        setEquipos(normalizados);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTabla(false);
      }
    };
    fetchTabla();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden relative" style={{ background: '#000F20' }}>
      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}
      <Sidebar active="tabla" onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userName={loading ? '...' : userName}
          userPhoto={userPhoto}
          fullName={fullName}
          userRole={userRole}
          onLogout={handleLogout}
        />

        <div className="flex-1 overflow-y-auto" style={{ background: '#000F20' }}>
          <div className="flex gap-8 px-8 pt-7 pb-10">

            {/* Columna principal */}
            <div className="flex-1 min-w-0">
              <h1
                className="text-white text-4xl uppercase mb-6 flex items-center gap-3"
                style={{ fontFamily: "'Anton SC', sans-serif" }}
              >
                Tabla de Posiciones
                <span className="text-3xl">⚽</span>
              </h1>

              {/* Card tabla */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: '#002060', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Header de la card */}
                <div
                  className="flex items-center justify-center gap-3 py-5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <img src={logoTCF} alt="TCF" className="w-8 h-auto" />
                  <span
                    className="text-white text-2xl uppercase"
                    style={{ fontFamily: "'Anton SC', sans-serif" }}
                  >
                    TechCup Futbol
                  </span>
                </div>

                {/* Estado: cargando */}
                {loadingTabla && (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3" />
                      <p className="text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Cargando tabla...
                      </p>
                    </div>
                  </div>
                )}

                {/* Estado: error */}
                {error && !loadingTabla && (
                  <div className="mx-6 my-4 rounded-lg p-4" style={{ background: 'rgba(200,100,100,0.2)', border: '1px solid rgba(200,100,100,0.4)' }}>
                    <p className="text-red-400 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      No se pudo cargar la tabla: {error}
                    </p>
                  </div>
                )}

                {/* Tabla */}
                {!loadingTabla && !error && (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                        {COLS.map(col => (
                          <th
                            key={col.key}
                            style={{
                              width: col.w,
                              padding: '10px 12px',
                              textAlign: col.key === 'equipo' ? 'left' : 'center',
                              color: 'rgba(255,255,255,0.55)',
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: '13px',
                              fontWeight: '600',
                            }}
                          >
                            {col.key === 'pos' ? '' : col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {equipos.length === 0 && (
                        <tr>
                          <td colSpan={COLS.length} className="text-center py-10">
                            <span className="text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255,255,255,0.4)' }}>
                              No hay equipos registrados
                            </span>
                          </td>
                        </tr>
                      )}
                      {equipos.map((eq, idx) => {
                        const pos = idx + 1;
                        const isTop3 = pos <= 3;
                        return (
                          <tr
                            key={eq.id ?? idx}
                            style={{
                              borderBottom: '1px solid rgba(255,255,255,0.07)',
                              background: isTop3 ? 'rgba(255,255,255,0.03)' : 'transparent',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = isTop3 ? 'rgba(255,255,255,0.03)' : 'transparent'; }}
                          >
                            {/* Pos */}
                            <td className="text-center" style={{ padding: '12px 12px' }}>
                              <PosCircle pos={pos} />
                            </td>

                            {/* Equipo */}
                            <td style={{ padding: '12px 12px' }}>
                              <div className="flex items-center gap-3">
                                <LogoEquipo logo={eq.logo} nombre={eq.nombre} />
                                <span
                                  className="text-white text-sm font-medium"
                                  style={{ fontFamily: "'Poppins', sans-serif", color: isTop3 ? '#fff' : 'rgba(255,255,255,0.75)' }}
                                >
                                  {eq.nombre}
                                </span>
                              </div>
                            </td>

                            {/* Stats */}
                            {['pj', 'pg', 'pe', 'pp', 'gf', 'gc', 'dc', 'pts'].map(k => (
                              <td
                                key={k}
                                className="text-center"
                                style={{
                                  padding: '12px 4px',
                                  fontFamily: "'Poppins', sans-serif",
                                  fontSize: '14px',
                                  fontWeight: k === 'pts' ? '700' : '400',
                                  color: k === 'pts'
                                    ? '#fff'
                                    : eq[k] === 0 || eq[k] == null
                                    ? 'rgba(255,255,255,0.3)'
                                    : k === 'dc' && eq[k] > 0
                                    ? '#4ade80'
                                    : k === 'dc' && eq[k] < 0
                                    ? '#f87171'
                                    : 'rgba(255,255,255,0.75)',
                                }}
                              >
                                {eq[k] == null ? '-' : k === 'dc' && eq[k] > 0 ? `+${eq[k]}` : eq[k]}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Robot decorativo */}
            <div className="flex flex-col items-center justify-end flex-shrink-0" style={{ width: '220px', paddingBottom: '8px' }}>
              <img
                src={robotCurioso}
                alt="Robot"
                className="w-full object-contain"
                style={{ transform: 'scaleY(-1)', maxHeight: '340px' }}
              />
              <p
                className="text-white text-2xl text-center mt-3 uppercase"
                style={{ fontFamily: "'Anton SC', sans-serif", lineHeight: '1.2' }}
              >
                Uff Esta Re Bueno!!!
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
