import { useState, useEffect } from 'react';
import { Sidebar, Topbar, LogoutModal, useDashboard } from '../Dashboard';
import { authFetch } from '../../services/api';

const IconEdit  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;
const IconSave  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
const IconClose = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const IconPencil = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;

const EXTRA_NAV = [
  { icon: <IconEdit />, label: 'Gestión', key: 'org-gestion', path: '/organizador/gestion' },
];

const TABS = ['Partidos', 'Consulta Torneo'] as const;
type Tab = typeof TABS[number];

const INPUT: React.CSSProperties = { background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontFamily: "'Poppins', sans-serif" };
const BTN:   React.CSSProperties = { background: '#003C81', color: '#fff', fontFamily: "'Poppins', sans-serif" };
const CARD:  React.CSSProperties = { background: 'rgba(0,32,96,0.82)', border: '1px solid rgba(255,255,255,0.08)' };

const ESTADO_BG: Record<string, string> = {
  'FINALIZADO': 'rgba(220,165,0,0.25)',
  'POR JUGAR':  'rgba(80,120,200,0.25)',
  'EN CURSO':   'rgba(100,200,100,0.25)',
};
const ESTADO_TXT: Record<string, string> = {
  'FINALIZADO': '#B8A000', 'POR JUGAR': '#5078C8', 'EN CURSO': '#4ade80',
};

interface Partido { id: string; local: any; visitante: any; fecha?: string; hora?: string; cancha?: string; estado?: string; }
const norm = (raw: any): Partido => ({
  id: raw._id ?? raw.id, local: raw.local ?? raw.team1 ?? raw.equipo1 ?? {}, visitante: raw.visitante ?? raw.team2 ?? raw.equipo2 ?? {},
  fecha: raw.fecha ?? raw.date ?? 'Por definir', hora: raw.hora ?? raw.time ?? 'Por definir',
  cancha: raw.cancha ?? raw.venue ?? 'Por definir', estado: raw.estado ?? raw.status ?? 'POR JUGAR',
});
const nombreEq = (eq: any) => eq?.nombre ?? eq?.name ?? eq?.teamName ?? 'Equipo';
const logoEq   = (eq: any) => eq?.logo ?? eq?.logoUrl ?? null;

export default function GestionPartidosPage() {
  const { userName, userPhoto, fullName, userRole, loading, showLogoutModal, setShowLogoutModal, confirmLogout } = useDashboard();
  const [tab, setTab]             = useState<Tab>('Partidos');
  const [partidos, setPartidos]   = useState<Partido[]>([]);
  const [torneo, setTorneo]       = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [editP, setEditP]         = useState<Partido | null>(null);
  const [editForm, setEditForm]   = useState({ fecha: '', hora: '', cancha: '' });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editMsg, setEditMsg]     = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleLogout = () => setShowLogoutModal(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingPage(true);
        const [rM, rT] = await Promise.allSettled([
          authFetch('/matches').then(r => r.ok ? r.json() : []),
          authFetch('/tournament/current').then(r => r.ok ? r.json() : null),
        ]);
        if (rM.status === 'fulfilled') {
          const d = rM.value;
          setPartidos((Array.isArray(d) ? d : (d?.data ?? [])).map(norm));
        }
        if (rT.status === 'fulfilled') setTorneo(rT.value);
      } finally {
        setLoadingPage(false);
      }
    };
    fetchAll();
  }, []);

  const openEdit = (p: Partido) => {
    setEditP(p);
    setEditForm({ fecha: p.fecha !== 'Por definir' ? p.fecha ?? '' : '', hora: p.hora !== 'Por definir' ? p.hora ?? '' : '', cancha: p.cancha !== 'Por definir' ? p.cancha ?? '' : '' });
    setEditMsg(null);
  };

  const handleSaveEdit = async () => {
    if (!editP) return;
    try {
      setSavingEdit(true); setEditMsg(null);
      const res = await authFetch(`/matches/${editP.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ fecha: editForm.fecha || undefined, hora: editForm.hora || undefined, cancha: editForm.cancha || undefined }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setPartidos(prev => prev.map(p => p.id === editP.id ? { ...p, ...editForm } : p));
      setEditMsg({ type: 'ok', text: 'Partido actualizado correctamente' });
    } catch (err: any) {
      setEditMsg({ type: 'err', text: err.message });
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#000F20' }}>
      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}
      <Sidebar active="org-gestion" onLogout={handleLogout} extraNav={EXTRA_NAV} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={loading ? '...' : userName} userPhoto={userPhoto} fullName={fullName} userRole={userRole} onLogout={handleLogout} />

        <div className="flex-1 overflow-y-auto p-8" style={{ background: '#000F20' }}>
          <h1 className="text-white text-4xl uppercase mb-6" style={{ fontFamily: "'Anton SC', sans-serif" }}>Gestión — Organizador</h1>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', width: 'fit-content' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: tab === t ? '#003C81' : 'transparent', color: tab === t ? '#fff' : 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>
                {t}
              </button>
            ))}
          </div>

          {loadingPage && <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" /></div>}

          {/* ── Partidos ── */}
          {!loadingPage && tab === 'Partidos' && (
            partidos.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Poppins', sans-serif" }}>No hay partidos registrados.</p>
            ) : (
              <div className="rounded-xl overflow-hidden" style={CARD}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      {['Local', 'Visitante', 'Fecha', 'Hora', 'Cancha', 'Estado', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold"
                          style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {partidos.map((p, i) => {
                      const estado = p.estado ?? 'POR JUGAR';
                      return (
                        <tr key={p.id ?? i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.1s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          {[p.local, p.visitante].map((eq, j) => (
                            <td key={j} className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {logoEq(eq) ? <img src={logoEq(eq)!} alt="" className="w-6 h-6 rounded-full object-contain" />
                                  : <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: '#003C81' }}>{nombreEq(eq).charAt(0)}</div>}
                                <span className="text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{nombreEq(eq)}</span>
                              </div>
                            </td>
                          ))}
                          <td className="px-4 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif" }}>{p.fecha}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif" }}>{p.hora}</td>
                          <td className="px-4 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif" }}>{p.cancha}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-1 rounded font-semibold"
                              style={{ background: ESTADO_BG[estado] ?? 'rgba(80,80,80,0.3)', color: ESTADO_TXT[estado] ?? '#fff', fontFamily: "'Poppins', sans-serif" }}>
                              {estado}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => openEdit(p)} className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition-colors" style={BTN}
                              onMouseEnter={e => (e.currentTarget.style.background = '#0055cc')}
                              onMouseLeave={e => (e.currentTarget.style.background = '#003C81')}>
                              <IconPencil />Editar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* ── Consulta Torneo ── */}
          {!loadingPage && tab === 'Consulta Torneo' && (
            !torneo ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Poppins', sans-serif" }}>Sin información del torneo.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-xl p-6" style={CARD}>
                  <h3 className="text-white font-bold text-base mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Información General</h3>
                  {[
                    { label: 'Nombre',       val: torneo.nombre ?? torneo.name },
                    { label: 'Fase',         val: torneo.fase   ?? torneo.phase },
                    { label: 'Estado',       val: torneo.estado ?? torneo.status },
                    { label: 'Fecha inicio', val: (torneo.fechaInicio ?? torneo.startDate ?? '').slice(0, 10) || 'N/D' },
                    { label: 'Fecha fin',    val: (torneo.fechaFin    ?? torneo.endDate   ?? '').slice(0, 10) || 'N/D' },
                  ].filter(x => x.val).map(({ label, val }) => (
                    <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Poppins', sans-serif" }}>{label}</span>
                      <span className="text-white text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-6" style={CARD}>
                  <h3 className="text-white font-bold text-base mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Resumen de Partidos</h3>
                  {[
                    { label: 'Total',       val: partidos.length },
                    { label: 'Finalizados', val: partidos.filter(p => p.estado === 'FINALIZADO').length },
                    { label: 'Por jugar',   val: partidos.filter(p => p.estado === 'POR JUGAR').length },
                    { label: 'En curso',    val: partidos.filter(p => p.estado === 'EN CURSO').length },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Poppins', sans-serif" }}>{label}</span>
                      <span className="text-white text-sm font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* ── Modal editar partido ── */}
      {editP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: '#001540', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>Editar Partido</h2>
              <button onClick={() => setEditP(null)} style={{ color: 'rgba(255,255,255,0.5)' }}><IconClose /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-center text-white text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {nombreEq(editP.local)} vs {nombreEq(editP.visitante)}
              </p>
              {[
                { label: 'Fecha', key: 'fecha', type: 'date' },
                { label: 'Hora',  key: 'hora',  type: 'time' },
                { label: 'Cancha', key: 'cancha', type: 'text' },
              ].map(({ label, key, type }) => (
                <label key={key} className="flex flex-col gap-1">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>{label}</span>
                  <input type={type} placeholder={label}
                    value={(editForm as any)[key]}
                    onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                    className="px-4 py-3 rounded-lg outline-none text-sm" style={INPUT} />
                </label>
              ))}
              {editMsg && <p className="text-sm" style={{ color: editMsg.type === 'ok' ? '#4ade80' : '#f87171', fontFamily: "'Poppins', sans-serif" }}>{editMsg.text}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setEditP(null)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontFamily: "'Poppins', sans-serif" }}>
                Cancelar
              </button>
              <button onClick={handleSaveEdit} disabled={savingEdit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50" style={BTN}>
                <IconSave />{savingEdit ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
