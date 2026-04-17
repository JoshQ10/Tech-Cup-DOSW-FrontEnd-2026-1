import { useEffect, useMemo, useState } from 'react';
import ModalBase from '../ModalBase';
import robotStats from '../../assets/robots/robot-jugador.png';
import {
  getTournamentTopScorers,
  getTournamentMatchHistory,
} from '../../services/api';

const TABS = {
  scorers: 'Maximos Goleadores',
  matches: 'Historial de Partidos',
  derived: 'Estadisticas Derivadas',
};

const normalizeScorer = (item) => {
  return {
    pos: item?.pos ?? item?.position,
    team: item?.team || item?.equipo || item?.teamName || '-',
    player: item?.player || item?.jugador || item?.playerName || '-',
    goals: item?.goals ?? item?.goles ?? item?.total ?? 0,
    crest: item?.crest || item?.escudo || item?.teamCrest || null,
  };
};

const normalizeMatch = (m) => {
  const localName = m?.local?.nombre || m?.home?.name || m?.local || m?.equipoLocal || 'Local';
  const awayName = m?.visitante?.nombre || m?.away?.name || m?.visitante || m?.equipoVisitante || 'Visitante';

  const localCrest = m?.local?.logo || m?.home?.crest || m?.localLogo || m?.escudoLocal || null;
  const awayCrest = m?.visitante?.logo || m?.away?.crest || m?.visitanteLogo || m?.escudoVisitante || null;

  const date = m?.fecha || m?.date || m?.matchDate || '';

  const resLocal = m?.resultado?.local ?? m?.score?.home ?? m?.golesLocal ?? null;
  const resAway = m?.resultado?.visitante ?? m?.score?.away ?? m?.golesVisitante ?? null;

  const result = resLocal != null && resAway != null ? `${String(resLocal).padStart(2, '0')} - ${String(resAway).padStart(2, '0')}` : '';

  return { date, localName, awayName, localCrest, awayCrest, result };
};

export default function EstadisticasModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('scorers');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [scorers, setScorers] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [scorersPayload, matchesPayload] = await Promise.all([
          getTournamentTopScorers().catch(() => null),
          getTournamentMatchHistory().catch(() => null),
        ]);

        const scorersList = scorersPayload
          ? (Array.isArray(scorersPayload) ? scorersPayload : scorersPayload?.data || scorersPayload?.scorers || [])
          : [];

        const matchesList = matchesPayload
          ? (Array.isArray(matchesPayload) ? matchesPayload : matchesPayload?.data || matchesPayload?.matches || [])
          : [];

        setScorers(scorersList.map(normalizeScorer));
        setMatches(matchesList.map(normalizeMatch));
      } catch (e) {
        setError(e?.message || 'No se pudieron cargar las estadisticas');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setActiveTab('scorers');
  }, [open]);

  const derived = useMemo(() => {
    // Placeholder: cuando el backend defina métricas, aquí se calculan.
    // Por ahora dejamos un panel “listo” para conectar.
    return {
      hint: 'Cuando el backend exponga estas métricas, este panel se llena automaticamente.',
    };
  }, []);

  if (!open) return null;

  return (
    <ModalBase title="ESTADISTICAS" onClose={onClose}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div
          className="rounded-xl p-5"
          style={{ background: 'linear-gradient(180deg, rgba(0,32,96,0.55) 0%, rgba(0,15,32,0.85) 100%)' }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {Object.entries(TABS).map(([key, label]) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className="px-4 py-2 text-white text-sm border transition"
                  style={{
                    borderColor: 'rgba(255,255,255,0.65)',
                    background: active ? 'rgba(14, 124, 242, 0.25)' : 'transparent',
                    fontFamily: "'Oswald', sans-serif",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {loading && (
            <div className="py-16 text-center text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Cargando...
            </div>
          )}

          {error && !loading && (
            <div className="rounded-lg p-4" style={{ background: 'rgba(200, 100, 100, 0.2)', border: '1px solid rgba(200, 100, 100, 0.5)' }}>
              <p className="text-red-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ⚠️ {error}
              </p>
            </div>
          )}

          {!loading && !error && activeTab === 'scorers' && (
            <div>
              <div className="grid grid-cols-[70px_1fr_1fr_90px] gap-4 px-2 pb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <div className="text-xs font-semibold uppercase">Pos</div>
                <div className="text-xs font-semibold uppercase">Equipo</div>
                <div className="text-xs font-semibold uppercase">Jugador</div>
                <div className="text-xs font-semibold uppercase text-right">Goles</div>
              </div>

              <div className="space-y-3">
                {scorers.length === 0 ? (
                  <div className="py-10 text-center" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Poppins', sans-serif" }}>
                    No hay datos de goleadores.
                  </div>
                ) : (
                  scorers.map((row, idx) => (
                    <div
                      key={`${row.player}-${idx}`}
                      className="grid grid-cols-[70px_1fr_1fr_90px] gap-4 items-center px-2 py-2 rounded"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                          style={{ background: '#00C853', color: '#001b45' }}
                        >
                          {row.pos ?? idx + 1}
                        </span>
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {row.team}
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {row.player}
                      </div>
                      <div className="text-white text-sm text-right" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {row.goals}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {!loading && !error && activeTab === 'matches' && (
            <div>
              <div className="grid grid-cols-[140px_1fr_140px] gap-4 px-2 pb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <div className="text-xs font-semibold uppercase">Fecha</div>
                <div className="text-xs font-semibold uppercase">Partido</div>
                <div className="text-xs font-semibold uppercase text-right">Resultado</div>
              </div>

              <div className="space-y-3">
                {matches.length === 0 ? (
                  <div className="py-10 text-center" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Poppins', sans-serif" }}>
                    No hay historial de partidos.
                  </div>
                ) : (
                  matches.map((m, idx) => (
                    <div
                      key={`${m.date}-${idx}`}
                      className="grid grid-cols-[140px_1fr_140px] gap-4 items-center px-2 py-2 rounded"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <div className="text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {m.date || '-'}
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {m.localName} <span style={{ color: 'rgba(255,255,255,0.7)' }}>VS</span> {m.awayName}
                      </div>
                      <div className="text-white text-sm text-right" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {m.result || '-'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {!loading && !error && activeTab === 'derived' && (
            <div className="min-h-[240px]">
              <p className="text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {derived.hint}
              </p>
              <div className="rounded-lg p-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <p className="text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255,255,255,0.8)' }}>
                  Ejemplos posibles: goles por partido, promedio de tarjetas, fair play por equipo, racha de victorias, etc.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="sticky top-0 flex flex-col items-center gap-5">
            <img src={robotStats} alt="Robot estadisticas" className="w-full max-w-[280px] h-auto object-contain" />
            <button
              onClick={onClose}
              type="button"
              className="px-8 py-2 text-white text-lg rounded shadow transition hover:brightness-110"
              style={{ background: '#003C81', fontFamily: "'Oswald', sans-serif" }}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}

