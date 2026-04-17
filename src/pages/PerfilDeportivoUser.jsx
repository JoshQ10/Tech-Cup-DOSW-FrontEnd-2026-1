import { Sidebar, Topbar, LogoutModal, useDashboard } from './Dashboard';

import logoTCF from '../assets/logos/logo-tcf.png';
import canchaTactica from '../assets/imagenes TCF (2)/imagenes TCF/New folder/recursos x/CANCHA.png';
import balonBlanco from '../assets/imagenes TCF (2)/imagenes TCF/New folder/recursos x/balon blanco icon.png';
import siluetaJugador from '../assets/robots/Silueta-robot.png';

const EMPTY_PLAYER_DATA = {
  disponibilidad: '',
  goles: '',
  asistencias: '',
  partidos: '',
  nombre: '',
  rol: '',
  tipo: '',
  posicionPrincipal: '',
  otrasPosiciones: '',
  dorsal: '',
  pieDominante: '',
};

const emptyOrDash = (value) => (value && String(value).trim() ? value : '--');

// Coordenadas calculadas sobre CANCHA.png (1366x1024) como porcentajes responsivos.
const FIELD_CIRCLES = [
  { x: 50.07, y: 16.5 },
  { x: 25.99, y: 22.27 },
  { x: 74.08, y: 22.27 },
  { x: 37.7, y: 32.13 },
  { x: 62.52, y: 32.13 },
  { x: 21.89, y: 50.2 },
  { x: 42.24, y: 53.22 },
  { x: 59.08, y: 53.22 },
  { x: 78.18, y: 50.2 },
  { x: 50.07, y: 76.27 },
];

const ACTIVE_CIRCLE_INDEX = null;

function LabelValue({ label, value }) {
  return (
    <div>
      <h3
        className="uppercase text-white"
        style={{
          fontFamily: "'Anton SC', sans-serif",
          fontSize: 'clamp(28px, 2.45vw, 52px)',
          lineHeight: 1,
        }}
      >
        {label}
      </h3>
      <p
        className="mt-2 text-white/90"
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 'clamp(26px, 1.85vw, 40px)',
          lineHeight: 1.1,
        }}
      >
        {emptyOrDash(value)}
      </p>
    </div>
  );
}

export default function PerfilDeportivoUser() {
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

  const player = EMPTY_PLAYER_DATA;

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#000F20' }}>
      {showLogoutModal && (
        <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />
      )}

      <Sidebar
        active="perfil"
        onLogout={() => setShowLogoutModal(true)}
        unreadInvitations={99}
        pendingCalendar={10}
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

        <main
          className="relative flex-1 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #D7262E 0%, #6A356E 56%, #18479A 100%)',
          }}
        >
          <div className="grid h-full grid-cols-1 xl:grid-cols-[300px_minmax(460px,1fr)_300px]">
            <section className="flex h-full flex-col px-6 py-6">
              <div className="mb-6 flex items-center justify-center">
                <img
                  src={siluetaJugador}
                  alt="Sin foto"
                  className="w-auto object-contain opacity-70"
                  style={{ height: 'clamp(130px, 18vh, 220px)' }}
                />
              </div>

              <div className="space-y-5">
                <LabelValue label="Posicion principal" value={player.posicionPrincipal} />
                <LabelValue label="Otras posiciones" value={player.otrasPosiciones} />
                <LabelValue label="Dorsal" value={player.dorsal} />
                <LabelValue label="Pie dominante" value={player.pieDominante} />
              </div>
            </section>

            <section className="relative flex h-full flex-col items-center justify-center px-4 pb-6 pt-5">
              <div className="mb-4 flex items-center justify-center gap-5">
                <img
                  src={logoTCF}
                  alt="TCF"
                  className="w-auto object-contain"
                  style={{ height: 'clamp(70px, 9vh, 105px)' }}
                />

                <div className="flex items-center gap-3">
                  <span
                    className="uppercase text-white"
                    style={{ fontFamily: "'Anton SC', sans-serif", fontSize: 'clamp(32px, 2.2vw, 46px)' }}
                  >
                    Disponibilidad
                  </span>

                  <span
                    className="inline-block rounded-full bg-gray-300"
                    style={{ width: 'clamp(12px, 1vw, 16px)', height: 'clamp(12px, 1vw, 16px)' }}
                  />

                  <span
                    className="text-white"
                    style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(30px, 1.9vw, 40px)' }}
                  >
                    {player.disponibilidad ? player.disponibilidad : '--'}
                  </span>
                </div>
              </div>

              <div className="relative flex w-full items-center justify-center">
                <div className="relative w-full max-w-[840px] px-2">
                  <div className="relative mx-auto" style={{ width: 'min(78vw, 760px)', aspectRatio: '1366 / 1024' }}>
                    <img
                      src={canchaTactica}
                      alt="Cancha tactica"
                      className="absolute inset-0 h-full w-full object-contain"
                      style={{ filter: 'saturate(1.1) contrast(1.03)', boxShadow: '0 20px 28px rgba(0,0,0,0.4)' }}
                    />

                    {ACTIVE_CIRCLE_INDEX !== null && FIELD_CIRCLES[ACTIVE_CIRCLE_INDEX] && (
                      <div
                        className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-[#6B6B6B] bg-white/95 shadow-xl"
                        style={{
                          left: `${FIELD_CIRCLES[ACTIVE_CIRCLE_INDEX].x}%`,
                          top: `${FIELD_CIRCLES[ACTIVE_CIRCLE_INDEX].y}%`,
                          width: 'clamp(54px, 5.2vw, 84px)',
                          height: 'clamp(54px, 5.2vw, 84px)',
                        }}
                      >
                        <img
                          src={balonBlanco}
                          alt="Posicion"
                          className="h-auto w-[62%] object-contain"
                          style={{ filter: 'invert(17%) sepia(94%) saturate(2783%) hue-rotate(208deg) brightness(88%) contrast(98%)' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="flex h-full flex-col px-6 py-6">
              <div className="mb-4 grid grid-cols-[1fr_auto] gap-x-7 gap-y-2">
                <span className="uppercase text-white/70" style={{ fontFamily: "'Anton SC', sans-serif", fontSize: 'clamp(28px, 2vw, 40px)' }}>
                  Goles
                </span>
                <span className="text-white" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(34px, 2.2vw, 46px)' }}>
                  {emptyOrDash(player.goles)}
                </span>

                <span className="uppercase text-white/70" style={{ fontFamily: "'Anton SC', sans-serif", fontSize: 'clamp(28px, 2vw, 40px)' }}>
                  Asistencias
                </span>
                <span className="text-white" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(34px, 2.2vw, 46px)' }}>
                  {emptyOrDash(player.asistencias)}
                </span>

                <span className="uppercase text-white/70" style={{ fontFamily: "'Anton SC', sans-serif", fontSize: 'clamp(28px, 2vw, 40px)' }}>
                  Partidos
                </span>
                <span className="text-white" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(34px, 2.2vw, 46px)' }}>
                  {emptyOrDash(player.partidos)}
                </span>
              </div>

              <div className="mb-4 space-y-1 text-white">
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(24px, 1.35vw, 30px)' }}>
                  <span className="font-semibold">Nombre :</span> {emptyOrDash(player.nombre)}
                </p>
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(24px, 1.35vw, 30px)' }}>
                  <span className="font-semibold">Rol :</span> {emptyOrDash(player.rol)}
                </p>
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(24px, 1.35vw, 30px)' }}>
                  <span className="font-semibold">Tipo :</span> {emptyOrDash(player.tipo)}
                </p>
              </div>

              <div className="mt-auto flex items-end justify-center">
                <img
                  src={siluetaJugador}
                  alt="Sin imagen de jugador"
                  className="h-auto w-auto object-contain opacity-75"
                  style={{ height: 'clamp(180px, 38vh, 500px)', transform: 'scaleX(-1)' }}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}