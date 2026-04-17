import { useEffect, useMemo, useState } from 'react';
import { Sidebar, Topbar, LogoutModal, useDashboard } from './Dashboard';

import escudoPlaceholder from '../assets/logos/logo-tcf.png';
import robotModal from '../assets/robots/robot-jugador.png';
import robotPhone from '../assets/imagenes TCF (2)/imagenes TCF/New folder/robots/mensaje rb.png';

const CARDS_PER_PAGE = 4;

const INITIAL_INVITATIONS = [];

function InvitationDecisionModal({ invitation, onAccept, onReject }) {
  if (!invitation) return null;

  return (
      <div
          className="absolute inset-0 z-40 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
      >
        {/* Robot FUERA del contenedor gris para que no sea recortado */}
        <img
            src={robotModal}
            alt="Robot invitacion"
            className="absolute bottom-0 z-50 w-auto object-contain pointer-events-none"
            style={{
              height: 'clamp(400px, 45vh, 520px)',
              left: 'calc(50% - 32rem)',
              filter: 'drop-shadow(10px 5px 15px rgba(0,0,0,0.2))',
            }}
        />

        {/* pl-64 para dar espacio al robot a la izquierda */}
        <div className="relative w-full max-w-4xl rounded-2xl bg-[#e8e8e8] py-10 pl-64 pr-10 min-h-[380px] flex items-center overflow-visible">
          <div className="flex flex-col items-center gap-8 text-center w-full">
            <h2
                className="text-[56px] uppercase leading-[0.95] text-black"
                style={{ fontFamily: "'Anton SC', sans-serif" }}
            >
              Quieres unirte a nuestro equipo
            </h2>

            <p className="text-[#374151] text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Invitacion de <span className="font-bold">{invitation.teamName}</span>
            </p>

            <div className="flex w-full max-w-[360px] items-center justify-between gap-8">
              <button
                  onClick={onAccept}
                  className="h-10 flex-1 rounded-lg bg-[#0B4F9B] text-[26px] text-white shadow-md transition hover:scale-105 active:scale-95 hover:brightness-110"
                  style={{ fontFamily: "'Anton SC', sans-serif" }}
              >
                Si
              </button>

              <button
                  onClick={onReject}
                  className="h-10 flex-1 rounded-lg bg-[#0B4F9B] text-[26px] text-white shadow-md transition hover:scale-105 active:scale-95 hover:brightness-110"
                  style={{ fontFamily: "'Anton SC', sans-serif" }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

function InvitationCard({ invitation, onSelect }) {
  return (
      <button
          onClick={() => onSelect(invitation)}
          className="flex flex-col items-center rounded-sm px-4 py-4 text-left shadow-lg transition-transform hover:-translate-y-1"
          style={{
            background: invitation.cardGradient,
            width: 'clamp(168px, 13.5vw, 201px)',
            height: 'clamp(270px, 35vh, 316px)',
          }}
      >
        <img
            src={invitation.crest || escudoPlaceholder}
            alt={invitation.teamName}
            className="mb-3 w-auto object-contain"
            style={{ height: 'clamp(130px, 18vh, 165px)' }}
        />

        <div className="w-full text-white" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(11px, 0.85vw, 14px)' }}>
          <p className="leading-[1.28]">Equipo: {invitation.teamName}</p>
          <p className="leading-[1.28]">Capitan: {invitation.captain}</p>
          <p className="leading-[1.28]">Jugadores: {invitation.players}</p>
          <p className="leading-[1.28]">Fecha: {invitation.date}</p>
        </div>
      </button>
  );
}

function TeamPanel({ myTeam }) {
  return (
      <aside className="relative flex h-full w-full flex-col items-center border-l border-black/10 px-5 pb-24 pt-8">
        <h3
            className="mb-4 w-full text-center uppercase text-black"
            style={{ fontFamily: "'Anton SC', sans-serif", fontSize: 'clamp(34px, 3.1vw, 52px)' }}
        >
          Mi equipo
        </h3>

        {myTeam ? (
            <div className="z-10 mt-2 flex w-full max-w-[260px] flex-col items-center gap-2">
              <img
                  src={myTeam.crest}
                  alt={myTeam.teamName}
                  className="w-auto object-contain drop-shadow-lg"
                  style={{ height: 'clamp(120px, 17vh, 165px)' }}
              />
              <div className="w-full rounded-xl bg-white/60 px-3 py-2 text-center">
                <p className="text-[#001840]" style={{ fontFamily: "'Anton SC', sans-serif", fontSize: 'clamp(20px, 1.6vw, 28px)' }}>
                  {myTeam.teamName}
                </p>
                <p className="mt-1 text-[#334155]" style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(11px, 0.8vw, 13px)' }}>
                  Capitan: {myTeam.captain}
                </p>
              </div>
            </div>
        ) : (
            <div className="z-10 mt-4 flex flex-col items-center gap-3 opacity-25">
              <img
                  src={escudoPlaceholder}
                  alt="Sin equipo"
                  className="w-auto object-contain"
                  style={{ height: 'clamp(150px, 22vh, 230px)' }}
              />
              <p
                  className="text-center uppercase text-black leading-[0.95]"
                  style={{ fontFamily: "'Anton SC', sans-serif", fontSize: 'clamp(34px, 3.2vw, 56px)' }}
              >
                Sin equipo
              </p>
            </div>
        )}

        <img
            src={robotPhone}
            alt="Robot asistente"
            className="pointer-events-none absolute bottom-2 right-2 w-auto object-contain opacity-95"
            style={{ height: 'clamp(110px, 17vh, 165px)', transform: 'scaleX(-1)' }}
        />
      </aside>
  );
}

function Pagination({ currentPage, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
      <div className="mx-auto mt-8 flex items-center gap-2 rounded-sm bg-[#001f4a] px-3 py-2 text-white">
        <button
            type="button"
            aria-label="Pagina anterior"
            onClick={() => onChange(Math.max(1, currentPage - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/60 hover:bg-white/15"
        >
          <span className="text-xs">◀</span>
        </button>

        {pages.map((page) => {
          const active = page === currentPage;
          return (
              <button
                  key={page}
                  type="button"
                  onClick={() => onChange(page)}
                  className="h-7 w-7 rounded-full text-[28px] leading-none"
                  style={{
                    fontFamily: "'Anton SC', sans-serif",
                    background: active ? '#0E7CF2' : '#082857',
                  }}
              >
                {page}
              </button>
          );
        })}

        <button
            type="button"
            aria-label="Pagina siguiente"
            onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/60 hover:bg-white/15"
        >
          <span className="text-xs">▶</span>
        </button>
      </div>
  );
}

export default function Invitaciones() {
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

  const [invitations, setInvitations] = useState(INITIAL_INVITATIONS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [myTeam, setMyTeam] = useState(null);

  const totalPages = Math.max(1, Math.ceil(invitations.length / CARDS_PER_PAGE));

  const currentPageInvitations = useMemo(() => {
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    return invitations.slice(start, start + CARDS_PER_PAGE);
  }, [currentPage, invitations]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleAccept = () => {
    if (!selectedInvitation) return;
    setMyTeam(selectedInvitation);
    setInvitations((prev) => prev.filter((item) => item.id !== selectedInvitation.id));
    setSelectedInvitation(null);
  };

  const handleReject = () => {
    if (!selectedInvitation) return;
    setInvitations((prev) => prev.filter((item) => item.id !== selectedInvitation.id));
    setSelectedInvitation(null);
  };

  return (
      <div className="flex h-screen w-full overflow-hidden" style={{ background: '#D9D9D9' }}>
        {showLogoutModal && (
            <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />
        )}

        <Sidebar
            active="invitaciones"
            onLogout={() => setShowLogoutModal(true)}
            unreadInvitations={Math.min(invitations.length, 99)}
            pendingCalendar={10}
        />

        <div className="relative flex-1 overflow-hidden">
          <Topbar
              userName={loading ? '...' : userName}
              userPhoto={userPhoto}
              fullName={fullName}
              userRole={userRole}
              onLogout={() => setShowLogoutModal(true)}
          />

          <div className="grid h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(240px,24vw)]">
            <section className="h-full overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
              <h1
                  className="mb-8 uppercase text-black"
                  style={{ fontFamily: "'Anton SC', sans-serif", fontSize: 'clamp(34px, 3.6vw, 56px)' }}
              >
                Invitaciones
              </h1>

              <div className="flex flex-wrap items-start gap-5 lg:gap-7">
                {currentPageInvitations.map((invitation) => (
                    <InvitationCard
                        key={invitation.id}
                        invitation={invitation}
                        onSelect={setSelectedInvitation}
                    />
                ))}

                {currentPageInvitations.length === 0 && (
                    <div className="rounded-xl bg-white/70 px-6 py-8 text-center shadow">
                      <p className="text-[#0F172A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        No hay equipos disponibles por el momento.
                      </p>
                      <p className="mt-2 text-[#334155]" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px' }}>
                        Esta seccion se llenara cuando el backend envie invitaciones reales.
                      </p>
                    </div>
                )}
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
            </section>

            <TeamPanel myTeam={myTeam} />
          </div>

          <InvitationDecisionModal
              invitation={selectedInvitation}
              onAccept={handleAccept}
              onReject={handleReject}
          />
        </div>
      </div>
  );
}