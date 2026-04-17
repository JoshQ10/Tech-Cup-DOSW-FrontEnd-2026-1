import { useState, useEffect } from 'react';
import { Sidebar, Topbar, LogoutModal, useDashboard } from '../Dashboard';
import { authFetch } from '../../services/api';

const IconSettings = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>;
const IconSave    = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
const IconPlus    = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const IconTrash   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;

const EXTRA_NAV = [
  { icon: <IconSettings />, label: 'Gestión Torneo', key: 'gestion-torneo', path: '/admin/gestion-torneo' },
];

const FASES   = ['GRUPOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'];
const ESTADOS = ['PROXIMO', 'ACTIVO', 'PAUSADO', 'FINALIZADO'];
const TABS    = ['Info General', 'Equipos', 'Brackets', 'Fechas'] as const;
type Tab = typeof TABS[number];

const CARD: React.CSSProperties  = { background: 'rgba(0,32,96,0.82)', border: '1px solid rgba(255,255,255,0.08)' };
const INPUT: React.CSSProperties = { background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontFamily: "'Poppins', sans-serif" };
const BTN: React.CSSProperties   = { background: '#003C81', color: '#fff', fontFamily: "'Poppins', sans-serif" };

export default function GestionTorneoPage() {
  const { userName, userPhoto, fullName, userRole, loading, showLogoutModal, setShowLogoutModal, confirmLogout } = useDashboard();
  const [tab, setTab]         = useState<Tab>('Info General');
  const [torneo, setTorneo]   = useState<any>(null);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [brackets, setBrackets] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [addInput, setAddInput] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [form, setForm] = useState({ nombre: '', fase: '', estado: '', fechaInicio: '', fechaFin: '' });

  const handleLogout = () => setShowLogoutModal(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingPage(true);
        const [rT, rE, rB] = await Promise.allSettled([
          authFetch('/tournament/current').then(r => r.ok ? r.json() : null),
          authFetch('/teams').then(r => r.ok ? r.json() : []),
          authFetch('/brackets').then(r => r.ok ? r.json() : null),
        ]);
        const t = rT.status === 'fulfilled' ? rT.value : null;
        if (t) {
          setTorneo(t);
          setForm({
            nombre:      t.nombre ?? t.name ?? '',
            fase:        t.fase   ?? t.phase ?? '',
            estado:      t.estado ?? t.status ?? '',
            fechaInicio: (t.fechaInicio ?? t.startDate ?? '').slice(0, 10),
            fechaFin:    (t.fechaFin    ?? t.endDate   ?? '').slice(0, 10),
          });
        }
        if (rE.status === 'fulfilled') {
          const d = rE.value;
          setEquipos(Array.isArray(d) ? d : (d?.data ?? d?.teams ?? []));
        }
        if (rB.status === 'fulfilled') setBrackets(rB.value);
      } finally {
        setLoadingPage(false);
      }
    };
    fetchAll();
  }, []);

  const handleSave = async () => {
    if (!torneo) return;
    try {
      setSaving(true);
      setSaveMsg(null);
      const id = torneo._id ?? torneo.id;
      const res = await authFetch(`/tournament/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          nombre: form.nombre || undefined, fase: form.fase || undefined,
          estado: form.estado || undefined, fechaInicio: form.fechaInicio || undefined,
          fechaFin: form.fechaFin || undefined,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setSaveMsg({ type: 'ok', text: 'Guardado correctamente' });
    } catch (err: any) {
      setSaveMsg({ type: 'err', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAddEquipo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addInput.trim() || !torneo) return;
    try {
      setAddLoading(true);
      const id = torneo._id ?? torneo.id;
      const res = await authFetch(`/tournament/${id}/teams`, {
        method: 'POST',
        body: JSON.stringify({ teamId: addInput.trim() }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const nuevo = await res.json();
      setEquipos(prev => [...prev, nuevo]);
      setAddInput('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveEquipo = async (eq: any) => {
    if (!torneo || !window.confirm(`¿Quitar "${eq.nombre ?? eq.name}" del torneo?`)) return;
    try {
      const tid = torneo._id ?? torneo.id;
      const eid = eq._id    ?? eq.id;
      await authFetch(`/tournament/${tid}/teams/${eid}`, { method: 'DELETE' });
      setEquipos(prev => prev.filter(x => (x._id ?? x.id) !== eid));
    } catch (err: any) { alert(err.message); }
  };

  const handleAdvancePhase = async () => {
    if (!torneo || !window.confirm('¿Avanzar a la siguiente fase del torneo?')) return;
    const id = torneo._id ?? torneo.id;
    const res = await authFetch(`/tournament/${id}/advance-phase`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      const nuevaFase = data.fase ?? data.phase;
      if (nuevaFase) {
        setTorneo((p: any) => ({ ...p, fase: nuevaFase }));
        setForm(p => ({ ...p, fase: nuevaFase }));
        setSaveMsg({ type: 'ok', text: `Fase avanzada a: ${nuevaFase}` });
      }
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#000F20' }}>
      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}
      <Sidebar active="gestion-torneo" onLogout={handleLogout} extraNav={EXTRA_NAV} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={loading ? '...' : userName} userPhoto={userPhoto} fullName={fullName} userRole={userRole} onLogout={handleLogout} />

        <div className="flex-1 overflow-y-auto p-8" style={{ background: '#000F20' }}>
          <h1 className="text-white text-4xl uppercase mb-6" style={{ fontFamily: "'Anton SC', sans-serif" }}>
            Gestión del Torneo
          </h1>

          {loadingPage ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
            </div>
          ) : (
            <>
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

              {/* ── Info General ── */}
              {tab === 'Info General' && (
                <div className="rounded-xl p-6 max-w-lg" style={CARD}>
                  <h2 className="text-white font-bold text-base mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Información General</h2>
                  <div className="flex flex-col gap-4">
                    {[{ label: 'Nombre del torneo', key: 'nombre', type: 'text' as const }].map(({ label, key }) => (
                      <label key={key} className="flex flex-col gap-1">
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>{label}</span>
                        <input className="px-4 py-3 rounded-lg outline-none text-sm" style={INPUT}
                          value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                      </label>
                    ))}

                    <label className="flex flex-col gap-1">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>Fase actual</span>
                      <select className="px-4 py-3 rounded-lg outline-none text-sm" style={INPUT}
                        value={form.fase} onChange={e => setForm(p => ({ ...p, fase: e.target.value }))}>
                        <option value="">-- Seleccionar --</option>
                        {FASES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>Estado</span>
                      <select className="px-4 py-3 rounded-lg outline-none text-sm" style={INPUT}
                        value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>
                        <option value="">-- Seleccionar --</option>
                        {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </label>

                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 self-start"
                      style={BTN}>
                      <IconSave />{saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    {saveMsg && <p className="text-sm" style={{ color: saveMsg.type === 'ok' ? '#4ade80' : '#f87171', fontFamily: "'Poppins', sans-serif" }}>{saveMsg.text}</p>}
                  </div>
                </div>
              )}

              {/* ── Equipos ── */}
              {tab === 'Equipos' && (
                <div className="rounded-xl p-6" style={CARD}>
                  <h2 className="text-white font-bold text-base mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Equipos participantes — {equipos.length}
                  </h2>
                  <form onSubmit={handleAddEquipo} className="flex gap-3 mb-5">
                    <input className="flex-1 px-4 py-3 rounded-lg outline-none text-sm" style={INPUT}
                      placeholder="ID del equipo a agregar"
                      value={addInput} onChange={e => setAddInput(e.target.value)} />
                    <button type="submit" disabled={addLoading || !addInput.trim()}
                      className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 flex-shrink-0"
                      style={BTN}><IconPlus />{addLoading ? 'Agregando...' : 'Agregar'}
                    </button>
                  </form>
                  {equipos.length === 0 ? (
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Poppins', sans-serif" }}>No hay equipos registrados.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {equipos.map((eq: any, i: number) => {
                        const nombre = eq.nombre ?? eq.name ?? `Equipo ${i + 1}`;
                        return (
                          <div key={eq._id ?? eq.id ?? i} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.25)' }}>
                            {(eq.logo ?? eq.logoUrl) ? (
                              <img src={eq.logo ?? eq.logoUrl} alt={nombre} className="w-8 h-8 rounded-full object-contain flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white font-bold" style={{ background: '#003C81' }}>
                                {nombre.charAt(0)}
                              </div>
                            )}
                            <span className="text-white text-sm flex-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{nombre}</span>
                            <button onClick={() => handleRemoveEquipo(eq)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-colors"
                              style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', fontFamily: "'Poppins', sans-serif" }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.3)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.15)')}>
                              <IconTrash />Quitar
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── Brackets ── */}
              {tab === 'Brackets' && (
                <div className="rounded-xl p-6" style={CARD}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Poppins', sans-serif" }}>Estado de los Brackets</h2>
                    <button onClick={handleAdvancePhase}
                      className="px-4 py-2 rounded-lg text-sm font-semibold" style={BTN}>
                      Avanzar fase →
                    </button>
                  </div>
                  {!brackets ? (
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Poppins', sans-serif" }}>Sin información de brackets.</p>
                  ) : (
                    <pre className="text-xs rounded-lg p-4 overflow-auto max-h-80"
                      style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                      {JSON.stringify(brackets, null, 2)}
                    </pre>
                  )}
                  {saveMsg && <p className="mt-3 text-sm" style={{ color: saveMsg.type === 'ok' ? '#4ade80' : '#f87171', fontFamily: "'Poppins', sans-serif" }}>{saveMsg.text}</p>}
                </div>
              )}

              {/* ── Fechas ── */}
              {tab === 'Fechas' && (
                <div className="rounded-xl p-6 max-w-md" style={CARD}>
                  <h2 className="text-white font-bold text-base mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Fechas del Torneo</h2>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: 'Fecha de inicio', key: 'fechaInicio' },
                      { label: 'Fecha de fin',    key: 'fechaFin' },
                    ].map(({ label, key }) => (
                      <label key={key} className="flex flex-col gap-1">
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>{label}</span>
                        <input type="date" className="px-4 py-3 rounded-lg outline-none text-sm" style={INPUT}
                          value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                      </label>
                    ))}
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold disabled:opacity-50 self-start" style={BTN}>
                      <IconSave />{saving ? 'Guardando...' : 'Guardar fechas'}
                    </button>
                    {saveMsg && <p className="text-sm" style={{ color: saveMsg.type === 'ok' ? '#4ade80' : '#f87171', fontFamily: "'Poppins', sans-serif" }}>{saveMsg.text}</p>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
