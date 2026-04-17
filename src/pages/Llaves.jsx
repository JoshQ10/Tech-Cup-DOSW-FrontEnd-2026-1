import { useState, useEffect } from 'react';
import { Sidebar, Topbar, LogoutModal, useDashboard } from './Dashboard';
import { authFetch } from '../services/api';

const TCF_LOGO = (
  <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)" className="w-8 h-8">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93V18h2v1.93c-3.05-.46-5.47-2.88-5.93-5.93H9v-2H7.07C7.53 8.95 9.95 6.53 13 6.07V8h-2V6.07C7.61 6.56 5 9.46 5 12c0 3.87 3.13 7 7 7z" />
  </svg>
);

function normalizarBracket(data) {
  if (!data) return { rounds: [] };

  if (Array.isArray(data)) {
    const grouped = {};
    data.forEach(match => {
      const r = match.round ?? match.ronda ?? 0;
      if (!grouped[r]) grouped[r] = [];
      grouped[r].push(match);
    });
    return {
      rounds: Object.keys(grouped)
        .sort((a, b) => Number(a) - Number(b))
        .map(r => ({ roundIndex: Number(r), matches: grouped[r] }))
    };
  }

  if (data.rounds) return data;
  if (data.data) return normalizarBracket(data.data);

  return { rounds: [] };
}

function normalizarEquipo(raw) {
  if (!raw) return null;
  return {
    id: raw._id || raw.id || null,
    nombre: raw.nombre || raw.name || raw.teamName || 'Por definir',
    logo: raw.logo || raw.logoUrl || raw.escudo || null,
  };
}

function normalizarPartido(raw) {
  return {
    id: raw._id || raw.id,
    equipo1: normalizarEquipo(raw.equipo1 || raw.team1 || raw.local || raw.teamA),
    equipo2: normalizarEquipo(raw.equipo2 || raw.team2 || raw.visitante || raw.teamB),
    ganador: normalizarEquipo(raw.ganador || raw.winner),
    score1: raw.score1 ?? raw.golesLocal ?? raw.scoreA ?? null,
    score2: raw.score2 ?? raw.golesVisitante ?? raw.scoreB ?? null,
  };
}

function TeamBox({ equipo, isWinner }) {
  const BORDER = isWinner ? '2px solid #FFD700' : '2px solid rgba(255,255,255,0.6)';
  const BG = isWinner ? 'rgba(255,215,0,0.08)' : 'rgba(0,15,32,0.9)';

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded"
      style={{
        border: BORDER,
        background: BG,
        minWidth: '130px',
        height: '44px',
        transition: 'border-color 0.3s',
      }}
    >
      {equipo?.logo ? (
        <img
          src={equipo.logo}
          alt={equipo.nombre}
          className="w-7 h-7 object-contain rounded-full flex-shrink-0"
          onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div
        className="w-7 h-7 flex-shrink-0 items-center justify-center"
        style={{ display: equipo?.logo ? 'none' : 'flex' }}
      >
        {TCF_LOGO}
      </div>
      <span
        className="text-white text-xs font-medium truncate"
        style={{ fontFamily: "'Poppins', sans-serif", maxWidth: '80px', color: equipo ? '#fff' : 'rgba(255,255,255,0.3)' }}
      >
        {equipo?.nombre ?? 'Por definir'}
      </span>
      {isWinner && (
        <span className="ml-auto text-yellow-400 text-xs font-bold flex-shrink-0">W</span>
      )}
    </div>
  );
}

function MatchSlot({ partido }) {
  const eq1 = partido?.equipo1 ?? null;
  const eq2 = partido?.equipo2 ?? null;
  const ganadorId = partido?.ganador?.id;

  return (
    <div className="flex flex-col gap-0.5">
      <TeamBox equipo={eq1} isWinner={ganadorId && eq1?.id === ganadorId} />
      <div style={{ height: '2px', background: 'rgba(255,255,255,0.15)' }} />
      <TeamBox equipo={eq2} isWinner={ganadorId && eq2?.id === ganadorId} />
    </div>
  );
}

const LINE = 'rgba(255,255,255,0.5)';
const LW = '2px';

function BracketLeft({ qfMatches, sfMatches }) {
  const qf = [...(qfMatches || [null, null, null, null])].slice(0, 4);
  while (qf.length < 4) qf.push(null);
  const sf = [...(sfMatches || [null, null])].slice(0, 2);
  while (sf.length < 2) sf.push(null);

  return (
    <div className="flex items-center gap-0">
      {/* QF column */}
      <div className="flex flex-col justify-around" style={{ height: '520px', gap: '0' }}>
        {qf.map((m, i) => (
          <div key={i} className="flex items-center">
            <MatchSlot partido={m} />
          </div>
        ))}
      </div>

      {/* QF → SF connectors */}
      <div className="relative flex-shrink-0" style={{ width: '36px', height: '520px' }}>
        {/* top pair: QF[0] mid → SF[0] mid */}
        <div style={{ position: 'absolute', top: '65px', left: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '195px', left: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '65px', left: '18px', width: LW, height: '132px', background: LINE }} />
        <div style={{ position: 'absolute', top: '130px', left: '18px', width: '18px', height: LW, background: LINE }} />

        {/* bottom pair: QF[2] mid → SF[1] mid */}
        <div style={{ position: 'absolute', top: '325px', left: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '455px', left: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '325px', left: '18px', width: LW, height: '132px', background: LINE }} />
        <div style={{ position: 'absolute', top: '390px', left: '18px', width: '18px', height: LW, background: LINE }} />
      </div>

      {/* SF column */}
      <div className="flex flex-col justify-around" style={{ height: '520px' }}>
        {sf.map((m, i) => (
          <div key={i} className="flex items-center">
            <MatchSlot partido={m} />
          </div>
        ))}
      </div>

      {/* SF → Final connectors */}
      <div className="relative flex-shrink-0" style={{ width: '36px', height: '520px' }}>
        <div style={{ position: 'absolute', top: '130px', left: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '390px', left: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '130px', left: '18px', width: LW, height: '262px', background: LINE }} />
        <div style={{ position: 'absolute', top: '260px', left: '18px', width: '18px', height: LW, background: LINE }} />
      </div>
    </div>
  );
}

function BracketRight({ qfMatches, sfMatches }) {
  const qf = [...(qfMatches || [null, null, null, null])].slice(0, 4);
  while (qf.length < 4) qf.push(null);
  const sf = [...(sfMatches || [null, null])].slice(0, 2);
  while (sf.length < 2) sf.push(null);

  return (
    <div className="flex items-center gap-0">
      {/* Final → SF connectors (mirrored) */}
      <div className="relative flex-shrink-0" style={{ width: '36px', height: '520px' }}>
        <div style={{ position: 'absolute', top: '130px', right: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '390px', right: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '130px', right: '18px', width: LW, height: '262px', background: LINE }} />
        <div style={{ position: 'absolute', top: '260px', right: '18px', width: '18px', height: LW, background: LINE }} />
      </div>

      {/* SF column */}
      <div className="flex flex-col justify-around" style={{ height: '520px' }}>
        {sf.map((m, i) => (
          <div key={i} className="flex items-center">
            <MatchSlot partido={m} />
          </div>
        ))}
      </div>

      {/* SF → QF connectors (mirrored) */}
      <div className="relative flex-shrink-0" style={{ width: '36px', height: '520px' }}>
        <div style={{ position: 'absolute', top: '65px', right: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '195px', right: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '65px', right: '18px', width: LW, height: '132px', background: LINE }} />
        <div style={{ position: 'absolute', top: '130px', right: '18px', width: '18px', height: LW, background: LINE }} />

        <div style={{ position: 'absolute', top: '325px', right: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '455px', right: 0, width: '18px', height: LW, background: LINE }} />
        <div style={{ position: 'absolute', top: '325px', right: '18px', width: LW, height: '132px', background: LINE }} />
        <div style={{ position: 'absolute', top: '390px', right: '18px', width: '18px', height: LW, background: LINE }} />
      </div>

      {/* QF column */}
      <div className="flex flex-col justify-around" style={{ height: '520px', gap: '0' }}>
        {qf.map((m, i) => (
          <div key={i} className="flex items-center">
            <MatchSlot partido={m} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Llaves() {
  const { userName, userPhoto, fullName, userRole, loading, showLogoutModal, setShowLogoutModal, confirmLogout } = useDashboard();
  const [bracket, setBracket] = useState(null);
  const [loadingBracket, setLoadingBracket] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBracket = async () => {
      try {
        setLoadingBracket(true);
        setError(null);
        const response = await authFetch('/brackets');
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const raw = await response.json();
        const normalized = normalizarBracket(raw);
        const rounds = normalized.rounds || [];

        const partidos = rounds.flatMap(r =>
          (r.matches || []).map(m => ({ ...normalizarPartido(m), roundIndex: r.roundIndex ?? r.round ?? 0 }))
        );

        const byRound = {};
        partidos.forEach(p => {
          const r = p.roundIndex;
          if (!byRound[r]) byRound[r] = [];
          byRound[r].push(p);
        });

        const sortedRounds = Object.keys(byRound).map(Number).sort((a, b) => a - b);
        const [r0, r1, r2] = sortedRounds;

        setBracket({
          qfLeft: (byRound[r0] || []).slice(0, 4),
          qfRight: (byRound[r0] || []).slice(4, 8),
          sfLeft: (byRound[r1] || []).slice(0, 2),
          sfRight: (byRound[r1] || []).slice(2, 4),
          final: (byRound[r2] || [])[0] ?? null,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingBracket(false);
      }
    };

    fetchBracket();
  }, []);

  const handleLogout = () => setShowLogoutModal(true);

  const finalMatch = bracket?.final ?? null;
  const ganadorFinal = finalMatch?.ganador ?? null;

  return (
    <div className="flex h-screen w-full overflow-hidden relative" style={{ background: '#000F20' }}>
      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}
      <Sidebar active="llaves" onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userName={loading ? '...' : userName}
          userPhoto={userPhoto}
          fullName={fullName}
          userRole={userRole}
          onLogout={handleLogout}
        />

        <div className="flex-1 overflow-auto flex flex-col" style={{ background: '#000F20' }}>
          <div className="px-8 pt-6 pb-2">
            <h1 className="text-white text-4xl uppercase" style={{ fontFamily: "'Anton SC', sans-serif" }}>
              Llaves del Torneo
            </h1>
          </div>

          {loadingBracket && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                <p className="text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Cargando llaves...</p>
              </div>
            </div>
          )}

          {error && !loadingBracket && (
            <div className="mx-8 mt-4 rounded-lg p-4" style={{ background: 'rgba(200,100,100,0.2)', border: '1px solid rgba(200,100,100,0.4)' }}>
              <p className="text-red-400 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                No se pudieron cargar las llaves: {error}
              </p>
            </div>
          )}

          {!loadingBracket && !error && (
            <div className="flex-1 flex items-center justify-center px-4 pb-8">
              <div className="flex items-center gap-0">

                {/* Left bracket */}
                <BracketLeft
                  qfMatches={bracket?.qfLeft}
                  sfMatches={bracket?.sfLeft}
                />

                {/* Final center */}
                <div className="flex flex-col items-center gap-4 px-4" style={{ minWidth: '220px' }}>
                  {ganadorFinal && (
                    <div className="flex flex-col items-center gap-2 mb-2">
                      {ganadorFinal.logo ? (
                        <img src={ganadorFinal.logo} alt={ganadorFinal.nombre} className="w-16 h-16 object-contain rounded-full" style={{ border: '2px solid #FFD700' }} />
                      ) : (
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.15)', border: '2px solid #FFD700' }}>
                          {TCF_LOGO}
                        </div>
                      )}
                      <span className="text-yellow-400 text-xs font-bold uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Campeón
                      </span>
                      <span className="text-white text-sm font-semibold text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {ganadorFinal.nombre}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-1">
                    <span className="text-white text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif" }}>
                      Final
                    </span>
                  </div>

                  <MatchSlot partido={finalMatch} />

                  {finalMatch?.score1 != null && (
                    <div
                      className="flex items-center gap-3 px-4 py-2 rounded"
                      style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)' }}
                    >
                      <span className="text-white font-bold text-xl">{finalMatch.score1}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>-</span>
                      <span className="text-white font-bold text-xl">{finalMatch.score2}</span>
                    </div>
                  )}
                </div>

                {/* Right bracket */}
                <BracketRight
                  qfMatches={bracket?.qfRight}
                  sfMatches={bracket?.sfRight}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
