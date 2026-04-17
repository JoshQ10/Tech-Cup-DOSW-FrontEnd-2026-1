import { useEffect, useMemo, useState } from 'react';
import ModalBase from '../ModalBase';
import robotRef from '../../assets/robots/robot-jugador.png';
import { getTournamentCards } from '../../services/api';

const normalizeCard = (item) => {
  // Estructura objetivo (UI): { type, date, player, minute }
  const typeRaw = item?.type || item?.tipo || item?.cardType || item?.color;
  const type = String(typeRaw || '').toLowerCase().includes('ro') || String(typeRaw || '').toLowerCase().includes('red')
    ? 'roja'
    : 'amarilla';

  const date = item?.date || item?.fecha || item?.matchDate || item?.day || '';
  const player = item?.player || item?.jugador || item?.playerName || item?.name || '';
  const minute = item?.minute ?? item?.minuto ?? item?.time ?? item?.min ?? '';

  return { type, date, player, minute };
};

export default function TarjetasModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const payload = await getTournamentCards();
        const list = Array.isArray(payload) ? payload : payload?.data || payload?.cards || [];
        setCards(list.map(normalizeCard));
      } catch (e) {
        setError(e?.message || 'No se pudieron cargar las tarjetas');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const c of cards) {
      const key = c.date || 'Sin fecha';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    }

    // Mantener el orden tal cual viene.
    return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
  }, [cards]);

  if (!open) return null;

  return (
    <ModalBase title="TARJETAS" onClose={onClose}>
      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        <div
          className="rounded-xl p-5"
          style={{ background: 'linear-gradient(180deg, rgba(0,32,96,0.55) 0%, rgba(0,15,32,0.85) 100%)' }}
        >
          <div className="grid grid-cols-[34px_1fr_1fr_1fr] gap-4 items-center px-2 pb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <div className="text-xs font-semibold uppercase">T</div>
            <div className="text-xs font-semibold uppercase">Fecha</div>
            <div className="text-xs font-semibold uppercase">Jugador</div>
            <div className="text-xs font-semibold uppercase">Minuto</div>
          </div>

          <div className="space-y-4">
            {loading && (
              <div className="py-14 text-center text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Cargando tarjetas...
              </div>
            )}

            {error && !loading && (
              <div className="rounded-lg p-4" style={{ background: 'rgba(200, 100, 100, 0.2)', border: '1px solid rgba(200, 100, 100, 0.5)' }}>
                <p className="text-red-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ⚠️ {error}
                </p>
              </div>
            )}

            {!loading && !error && grouped.length === 0 && (
              <div className="py-14 text-center" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Poppins', sans-serif" }}>
                No hay tarjetas registradas.
              </div>
            )}

            {!loading && !error && grouped.map(({ date, items }) => (
              <div key={date} className="space-y-2">
                {items.map((c, idx) => (
                  <div key={`${date}-${idx}`} className="grid grid-cols-[34px_1fr_1fr_1fr] gap-4 items-center px-2">
                    <div className="flex items-center justify-center">
                      <span
                        className="block h-4 w-3 rounded-sm"
                        style={{ background: c.type === 'roja' ? '#FF2B2B' : '#FFD400' }}
                        aria-label={c.type}
                      />
                    </div>

                    <div className="text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {date}
                    </div>

                    <div
                      className="text-white text-sm rounded-full px-3 py-1 inline-flex items-center gap-2"
                      style={{ background: 'rgba(255,255,255,0.08)', fontFamily: "'Poppins', sans-serif" }}
                    >
                      <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#FFD400' }} />
                      {c.player || 'Jugador'}
                    </div>

                    <div
                      className="text-white text-sm rounded-full px-3 py-1 inline-flex items-center gap-2 justify-start"
                      style={{ background: 'rgba(255,255,255,0.08)', fontFamily: "'Poppins', sans-serif" }}
                    >
                      <span className="inline-block w-4 h-4 rounded-full" style={{ background: 'rgba(255,255,255,0.22)' }} />
                      {c.minute !== '' ? `Minuto ${c.minute}` : 'Minuto -'}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="sticky top-0 flex flex-col items-center gap-5">
            <img src={robotRef} alt="Robot arbitro" className="w-full max-w-[220px] h-auto object-contain" />
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

