import { useState, useEffect } from 'react';
import { Sidebar, Topbar, LogoutModal, useDashboard } from '../Dashboard';
import { authFetch } from '../../services/api';

const IconTeam  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const IconMail  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>;

const EXTRA_NAV = [
  { icon: <IconTeam />, label: 'Mi Equipo', key: 'miequipo', path: '/capitan/mi-equipo' },
];

export default function GestionEquipoPage() {
  const { userName, userPhoto, fullName, userRole, loading, showLogoutModal, setShowLogoutModal, confirmLogout } = useDashboard();
  const [equipo, setEquipo]               = useState<any>(null);
  const [loadingEquipo, setLoadingEquipo] = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [inviteInput, setInviteInput]     = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg]         = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleLogout = () => setShowLogoutModal(true);

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        setLoadingEquipo(true);
        const res = await authFetch('/teams/my');
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setEquipo(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingEquipo(false);
      }
    };
    fetchEquipo();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    try {
      setInviteLoading(true);
      setInviteMsg(null);
      const res = await authFetch('/invitations', {
        method: 'POST',
        body: JSON.stringify({ identifier: inviteInput.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as any).message ?? 'No se pudo enviar la invitación');
      }
      setInviteMsg({ type: 'ok', text: 'Invitación enviada correctamente' });
      setInviteInput('');
    } catch (err: any) {
      setInviteMsg({ type: 'err', text: err.message });
    } finally {
      setInviteLoading(false);
    }
  };

  const jugadores: any[] = equipo?.jugadores ?? equipo?.players ?? equipo?.members ?? [];

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#000F20' }}>
      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}
      <Sidebar active="miequipo" onLogout={handleLogout} extraNav={EXTRA_NAV} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={loading ? '...' : userName} userPhoto={userPhoto} fullName={fullName} userRole={userRole} onLogout={handleLogout} />

        <div className="flex-1 overflow-y-auto p-8" style={{ background: '#000F20' }}>
          <h1 className="text-white text-4xl uppercase mb-6" style={{ fontFamily: "'Anton SC', sans-serif" }}>
            Mi Equipo
          </h1>

          {loadingEquipo && (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
            </div>
          )}

          {error && !loadingEquipo && (
            <div className="rounded-lg p-4 mb-6" style={{ background: 'rgba(200,100,100,0.2)', border: '1px solid rgba(200,100,100,0.4)' }}>
              <p className="text-red-400 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                No se pudo cargar el equipo: {error}
              </p>
            </div>
          )}

          {!loadingEquipo && !error && !equipo && (
            <div className="flex items-center justify-center py-24">
              <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Poppins', sans-serif" }}>
                No tienes equipo asignado aún.
              </p>
            </div>
          )}

          {!loadingEquipo && equipo && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Tarjeta del equipo */}
              <div className="rounded-xl p-6 flex flex-col items-center gap-5"
                style={{ background: 'rgba(0,32,96,0.82)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {(equipo.logo ?? equipo.logoUrl) ? (
                  <img src={equipo.logo ?? equipo.logoUrl} alt="logo" className="w-28 h-28 object-contain rounded-full"
                    style={{ border: '3px solid rgba(255,255,255,0.25)' }} />
                ) : (
                  <div className="w-28 h-28 rounded-full flex items-center justify-center"
                    style={{ background: '#003C81', border: '3px solid rgba(255,255,255,0.15)' }}>
                    <IconTeam />
                  </div>
                )}
                <div className="text-center">
                  <h2 className="text-white text-2xl uppercase" style={{ fontFamily: "'Anton SC', sans-serif" }}>
                    {equipo.nombre ?? equipo.name ?? 'Sin nombre'}
                  </h2>
                  {(equipo.descripcion ?? equipo.description) && (
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>
                      {equipo.descripcion ?? equipo.description}
                    </p>
                  )}
                </div>
                <div className="w-full grid grid-cols-2 gap-3">
                  {[
                    { label: 'Jugadores', val: jugadores.length },
                    { label: 'Estado',    val: equipo.estado ?? equipo.status ?? 'Activo' },
                  ].map(({ label, val }) => (
                    <div key={label} className="text-center rounded-lg py-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
                      <p className="text-white font-bold text-lg">{val}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Poppins', sans-serif" }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Lista de jugadores */}
                <div className="rounded-xl p-6" style={{ background: 'rgba(0,32,96,0.82)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="text-white text-base font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Jugadores — {jugadores.length}
                  </h3>
                  {jugadores.length === 0 ? (
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Poppins', sans-serif" }}>
                      Aún no hay jugadores en el equipo.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                      {jugadores.map((j: any, i: number) => {
                        const nombre = j.nombre ?? j.name ?? j.firstName ?? `Jugador ${i + 1}`;
                        const foto   = j.foto ?? j.photo ?? j.photoUrl ?? null;
                        const pos    = j.posicion ?? j.position ?? null;
                        return (
                          <div key={j._id ?? j.id ?? i}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg"
                            style={{ background: 'rgba(0,0,0,0.25)' }}>
                            {foto ? (
                              <img src={foto} alt={nombre} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                                style={{ background: '#003C81' }}>
                                {nombre.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{nombre}</p>
                              {pos && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>{pos}</p>}
                            </div>
                            <span className="text-xs px-2 py-1 rounded flex-shrink-0"
                              style={{ background: 'rgba(0,60,129,0.5)', color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
                              #{i + 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Invitar jugador */}
                <div className="rounded-xl p-6" style={{ background: 'rgba(0,32,96,0.82)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 className="text-white text-base font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Invitar Jugador
                  </h3>
                  <form onSubmit={handleInvite} className="flex gap-3">
                    <input
                      type="text"
                      value={inviteInput}
                      onChange={e => setInviteInput(e.target.value)}
                      placeholder="Correo electrónico o cédula"
                      className="flex-1 px-4 py-3 rounded-lg outline-none text-white text-sm"
                      style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: "'Poppins', sans-serif" }}
                    />
                    <button
                      type="submit"
                      disabled={inviteLoading || !inviteInput.trim()}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-semibold disabled:opacity-50 flex-shrink-0 transition-colors"
                      style={{ background: '#003C81', fontFamily: "'Poppins', sans-serif" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0055cc'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#003C81'; }}
                    >
                      <IconMail />
                      {inviteLoading ? 'Enviando...' : 'Invitar'}
                    </button>
                  </form>
                  {inviteMsg && (
                    <p className="mt-3 text-sm" style={{ color: inviteMsg.type === 'ok' ? '#4ade80' : '#f87171', fontFamily: "'Poppins', sans-serif" }}>
                      {inviteMsg.text}
                    </p>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
