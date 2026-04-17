import { useState, useEffect } from 'react';
import { Sidebar, Topbar, LogoutModal, useDashboard } from '../Dashboard';
import { authFetch } from '../../services/api';

const IconWhistle = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17 16l-4-4V8.82C14.16 8.4 15 7.3 15 6c0-1.66-1.34-3-3-3S9 4.34 9 6c0 1.3.84 2.4 2 2.82V12l-4 4H3v5h5v-3.05l4-4.2 4 4.2V21h5v-5h-4z"/></svg>;
const IconPlus    = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const IconTrash   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const IconClose   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;

const EXTRA_NAV = [
  { icon: <IconWhistle />, label: 'Mis Partidos', key: 'arbitro-partidos', path: '/arbitro/mis-partidos' },
];

const INPUT: React.CSSProperties = {
  background: 'rgba(0,0,0,0.35)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  fontFamily: "'Poppins', sans-serif",
};
const BTN: React.CSSProperties = { background: '#003C81', color: '#fff', fontFamily: "'Poppins', sans-serif" };

const ESTADO_BG: Record<string, string> = {
  'FINALIZADO': 'rgba(220,165,0,0.25)',
  'POR JUGAR':  'rgba(80,120,200,0.25)',
  'EN CURSO':   'rgba(100,200,100,0.25)',
};

interface Gol     { equipo: 'local' | 'visitante'; jugador: string; minuto: string; }
interface Tarjeta { equipo: 'local' | 'visitante'; jugador: string; minuto: string; tipo: 'AMARILLA' | 'ROJA'; }
interface Partido { id: string; local: any; visitante: any; resultado?: { local: number; visitante: number }; fecha?: string; hora?: string; cancha?: string; estado?: string; }

function norm(raw: any): Partido {
  return {
    id:        raw._id ?? raw.id,
    local:     raw.local     ?? raw.team1 ?? raw.equipo1 ?? {},
    visitante: raw.visitante ?? raw.team2 ?? raw.equipo2 ?? {},
    resultado: raw.resultado,
    fecha:     raw.fecha ?? raw.date   ?? 'Por definir',
    hora:      raw.hora  ?? raw.time   ?? 'Por definir',
    cancha:    raw.cancha ?? raw.venue ?? 'Por definir',
    estado:    raw.estado ?? raw.status ?? 'POR JUGAR',
  };
}

const nombre = (eq: any) => eq?.nombre ?? eq?.name ?? eq?.teamName ?? 'Equipo';
const logo   = (eq: any) => eq?.logo ?? eq?.logoUrl ?? null;

export default function RegistrarResultadosPage() {
  const { userName, userPhoto, fullName, userRole, loading, showLogoutModal, setShowLogoutModal, confirmLogout } = useDashboard();
  const [partidos, setPartidos]             = useState<Partido[]>([]);
  const [loadingP, setLoadingP]             = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [modal, setModal]                   = useState<Partido | null>(null);
  const [saving, setSaving]                 = useState(false);
  const [saveMsg, setSaveMsg]               = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [scoreL, setScoreL]                 = useState('0');
  const [scoreV, setScoreV]                 = useState('0');
  const [goles, setGoles]                   = useState<Gol[]>([]);
  const [tarjetas, setTarjetas]             = useState<Tarjeta[]>([]);
  const [posL, setPosL]                     = useState('50');

  const handleLogout = () => setShowLogoutModal(true);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        setLoadingP(true);
        let res = await authFetch('/referee/matches');
        if (!res.ok) res = await authFetch('/matches/assigned');
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const lista = Array.isArray(data) ? data : (data.data ?? []);
        setPartidos(lista.map(norm));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingP(false);
      }
    };
    fetchPartidos();
  }, []);

  const openModal = (p: Partido) => {
    setModal(p);
    setScoreL(String(p.resultado?.local ?? 0));
    setScoreV(String(p.resultado?.visitante ?? 0));
    setGoles([]); setTarjetas([]); setPosL('50'); setSaveMsg(null);
  };

  const handleSave = async () => {
    if (!modal) return;
    try {
      setSaving(true); setSaveMsg(null);
      const res = await authFetch(`/matches/${modal.id}/results`, {
        method: 'POST',
        body: JSON.stringify({
          resultado: { local: Number(scoreL), visitante: Number(scoreV) },
          goles, tarjetas,
          posesion: { local: Number(posL), visitante: 100 - Number(posL) },
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setSaveMsg({ type: 'ok', text: 'Resultado registrado correctamente' });
      setPartidos(prev => prev.map(p =>
        p.id === modal.id ? { ...p, resultado: { local: Number(scoreL), visitante: Number(scoreV) }, estado: 'FINALIZADO' } : p
      ));
    } catch (err: any) {
      setSaveMsg({ type: 'err', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const updGol = (i: number, f: keyof Gol, v: string) => setGoles(prev => prev.map((g, idx) => idx === i ? { ...g, [f]: v } : g));
  const updTar = (i: number, f: keyof Tarjeta, v: string) => setTarjetas(prev => prev.map((t, idx) => idx === i ? { ...t, [f]: v } : t));

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#000F20' }}>
      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}
      <Sidebar active="arbitro-partidos" onLogout={handleLogout} extraNav={EXTRA_NAV} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={loading ? '...' : userName} userPhoto={userPhoto} fullName={fullName} userRole={userRole} onLogout={handleLogout} />

        <div className="flex-1 overflow-y-auto p-8" style={{ background: '#000F20' }}>
          <h1 className="text-white text-4xl uppercase mb-6" style={{ fontFamily: "'Anton SC', sans-serif" }}>
            Partidos Asignados
          </h1>

          {loadingP && <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" /></div>}

          {error && !loadingP && (
            <div className="rounded-lg p-4 mb-6" style={{ background: 'rgba(200,100,100,0.2)', border: '1px solid rgba(200,100,100,0.4)' }}>
              <p className="text-red-400 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Error: {error}</p>
            </div>
          )}

          {!loadingP && !error && partidos.length === 0 && (
            <div className="flex justify-center py-24">
              <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Poppins', sans-serif" }}>No tienes partidos asignados.</p>
            </div>
          )}

          {!loadingP && partidos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {partidos.map(p => {
                const estado = p.estado ?? 'POR JUGAR';
                return (
                  <div key={p.id} className="rounded-xl p-5 flex flex-col gap-4"
                    style={{ background: 'rgba(0,32,96,0.82)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center justify-between">
                      {[p.local, p.visitante].map((eq, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 flex-1">
                          {logo(eq) ? <img src={logo(eq)!} alt="" className="w-10 h-10 rounded-full object-contain" />
                            : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: '#003C81' }}>{nombre(eq).charAt(0)}</div>}
                          <span className="text-white text-xs text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>{nombre(eq)}</span>
                        </div>
                      ))}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0 px-3">
                        {p.resultado ? (
                          <span className="text-white font-bold text-xl">{p.resultado.local} - {p.resultado.visitante}</span>
                        ) : (
                          <span className="text-white font-bold">VS</span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: ESTADO_BG[estado] ?? 'rgba(80,80,80,0.3)', color: '#fff', fontFamily: "'Poppins', sans-serif" }}>
                          {estado}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter', sans-serif" }}>
                      <span>{p.fecha}</span><span>{p.hora}</span><span>{p.cancha}</span>
                    </div>
                    <button onClick={() => openModal(p)} className="w-full py-2 rounded-lg text-white text-sm font-semibold transition-colors" style={BTN}
                      onMouseEnter={e => (e.currentTarget.style.background = '#0055cc')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#003C81')}>
                      {estado === 'FINALIZADO' ? 'Ver / Editar Resultado' : 'Registrar Resultado'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-2xl rounded-2xl flex flex-col" style={{ background: '#001540', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh' }}>

            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>Registrar Resultado</h2>
              <button onClick={() => setModal(null)} style={{ color: 'rgba(255,255,255,0.5)' }}><IconClose /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-6">

              {/* Marcador */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-white text-sm font-semibold flex-1 text-right" style={{ fontFamily: "'Poppins', sans-serif" }}>{nombre(modal.local)}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <input type="number" min="0" value={scoreL} onChange={e => setScoreL(e.target.value)}
                    className="w-14 text-center px-2 py-2 rounded-lg outline-none text-white text-2xl font-bold" style={INPUT} />
                  <span className="text-white text-xl">-</span>
                  <input type="number" min="0" value={scoreV} onChange={e => setScoreV(e.target.value)}
                    className="w-14 text-center px-2 py-2 rounded-lg outline-none text-white text-2xl font-bold" style={INPUT} />
                </div>
                <span className="text-white text-sm font-semibold flex-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{nombre(modal.visitante)}</span>
              </div>

              {/* Goles */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Goles</h3>
                  <button onClick={() => setGoles(p => [...p, { equipo: 'local', jugador: '', minuto: '' }])}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold" style={BTN}>
                    <IconPlus />Agregar gol
                  </button>
                </div>
                {goles.map((g, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <select value={g.equipo} onChange={e => updGol(i, 'equipo', e.target.value)}
                      className="px-3 py-2 rounded-lg outline-none text-xs flex-shrink-0" style={{ ...INPUT, width: '110px' }}>
                      <option value="local">Local</option><option value="visitante">Visitante</option>
                    </select>
                    <input placeholder="Jugador" value={g.jugador} onChange={e => updGol(i, 'jugador', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg outline-none text-sm" style={INPUT} />
                    <input placeholder="Min." value={g.minuto} onChange={e => updGol(i, 'minuto', e.target.value)}
                      className="px-3 py-2 rounded-lg outline-none text-sm" style={{ ...INPUT, width: '64px' }} />
                    <button onClick={() => setGoles(p => p.filter((_, idx) => idx !== i))} style={{ color: '#f87171' }}><IconTrash /></button>
                  </div>
                ))}
                {goles.length === 0 && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>Sin goles registrados</p>}
              </div>

              {/* Tarjetas */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Tarjetas</h3>
                  <button onClick={() => setTarjetas(p => [...p, { equipo: 'local', jugador: '', minuto: '', tipo: 'AMARILLA' }])}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold" style={BTN}>
                    <IconPlus />Agregar tarjeta
                  </button>
                </div>
                {tarjetas.map((t, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <select value={t.equipo} onChange={e => updTar(i, 'equipo', e.target.value)}
                      className="px-3 py-2 rounded-lg outline-none text-xs flex-shrink-0" style={{ ...INPUT, width: '110px' }}>
                      <option value="local">Local</option><option value="visitante">Visitante</option>
                    </select>
                    <input placeholder="Jugador" value={t.jugador} onChange={e => updTar(i, 'jugador', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg outline-none text-sm" style={INPUT} />
                    <input placeholder="Min." value={t.minuto} onChange={e => updTar(i, 'minuto', e.target.value)}
                      className="px-3 py-2 rounded-lg outline-none text-sm" style={{ ...INPUT, width: '64px' }} />
                    <select value={t.tipo} onChange={e => updTar(i, 'tipo', e.target.value)}
                      className="px-3 py-2 rounded-lg outline-none text-xs flex-shrink-0" style={{ ...INPUT, width: '100px' }}>
                      <option value="AMARILLA">Amarilla</option><option value="ROJA">Roja</option>
                    </select>
                    <button onClick={() => setTarjetas(p => p.filter((_, idx) => idx !== i))} style={{ color: '#f87171' }}><IconTrash /></button>
                  </div>
                ))}
                {tarjetas.length === 0 && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>Sin tarjetas registradas</p>}
              </div>

              {/* Posesión */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Posesión del balón</h3>
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm font-bold w-14 text-right">{posL}%</span>
                  <input type="range" min="0" max="100" value={posL} onChange={e => setPosL(e.target.value)} className="flex-1 accent-blue-500" />
                  <span className="text-white text-sm font-bold w-14">{100 - Number(posL)}%</span>
                </div>
                <div className="flex justify-between text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>
                  <span>{nombre(modal.local)}</span><span>{nombre(modal.visitante)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                {saveMsg && <p className="text-sm" style={{ color: saveMsg.type === 'ok' ? '#4ade80' : '#f87171', fontFamily: "'Poppins', sans-serif" }}>{saveMsg.text}</p>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setModal(null)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontFamily: "'Poppins', sans-serif" }}>
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50" style={BTN}>
                  {saving ? 'Guardando...' : 'Guardar resultado'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
