import { useState, useEffect } from 'react';
import { Sidebar, Topbar, LogoutModal, useDashboard } from './Dashboard';
import { authFetch } from '../services/api';

const normalizarPartido = (partido) => {
  return {
    id: partido._id || partido.id,
    local: {
      nombre: partido.local?.nombre || 'Equipo Local',
      logo: partido.local?.logo || '⚽'
    },
    visitante: {
      nombre: partido.visitante?.nombre || 'Equipo Visitante',
      logo: partido.visitante?.logo || '🐧'
    },
    resultado: partido.resultado || null,
    fecha: partido.fecha || 'Fecha por definir',
    hora: partido.hora || 'Hora por definir',
    cancha: partido.cancha || 'Cancha por definir',
    estado: partido.estado || 'POR ASIGNAR',
    goles: {
      local: partido.goles?.local || [],
      visitante: partido.goles?.visitante || []
    },
    tarjetas: {
      local: partido.tarjetas?.local || [],
      visitante: partido.tarjetas?.visitante || []
    },
    posesion: partido.posesion || null
  };
};

function CartaPartido({ partido, onPartidoClick }) {
  const estadoColor = {
    'FINALIZADO': 'rgba(220, 165, 0, 0.3)',
    'POR JUGAR': 'rgba(80, 120, 200, 0.3)',
    'CANCELADO': 'rgba(200, 100, 100, 0.3)',
    'POR ASIGNAR': 'rgba(100, 100, 100, 0.3)'
  };

  const estadoTextColor = {
    'FINALIZADO': '#B8A000',
    'POR JUGAR': '#5078C8',
    'CANCELADO': '#C86464',
    'POR ASIGNAR': '#808080'
  };

  return (
    <button
      onClick={() => onPartidoClick(partido)}
      className="w-full rounded-lg p-6 transition-all hover:shadow-xl hover:scale-105"
      style={{
        background: 'rgba(0, 32, 96, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer'
      }}
    >
      <div className="flex items-center justify-between">
        {/* Equipo Local */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="text-5xl">{partido.local.logo}</div>
          <p className="text-white text-xs text-center font-semibold">{partido.local.nombre}</p>
        </div>

        {/* Resultado y VS */}
        <div className="flex flex-col items-center gap-3 px-6 flex-1">
          <p className="text-white text-2xl font-bold">VS</p>
          {partido.resultado && (
            <div className="flex items-center gap-2">
              <span
                className="text-white font-bold text-xl px-3 py-1 rounded"
                style={{ background: estadoColor[partido.estado] }}
              >
                {partido.resultado.local} - {partido.resultado.visitante}
              </span>
            </div>
          )}
        </div>

        {/* Equipo Visitante */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="text-5xl">{partido.visitante.logo}</div>
          <p className="text-white text-xs text-center font-semibold">{partido.visitante.nombre}</p>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        <div className="flex flex-col gap-1">
          <p className="text-white font-semibold">{partido.cancha}</p>
          <p>{partido.hora}</p>
        </div>

        <div className="text-right">
          <p
            className="font-bold px-3 py-1 rounded text-xs"
            style={{
              background: estadoColor[partido.estado],
              color: estadoTextColor[partido.estado]
            }}
          >
            {partido.estado}
          </p>
        </div>
      </div>
    </button>
  );
}

function ModalPartido({ partido, onClose }) {
  if (!partido) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
      <div
        className="rounded-xl shadow-2xl overflow-auto max-h-[90vh] w-full max-w-2xl"
        style={{ background: '#000F20', border: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h2 className="text-white text-xl font-bold">Detalles del Partido</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            ✕
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-8 flex flex-col gap-8">
          {/* Encabezado con equipos y resultado */}
          <div className="flex items-center justify-between text-center">
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="text-6xl">{partido.local.logo}</div>
              <p className="text-white text-sm font-semibold">{partido.local.nombre}</p>
            </div>

            <div className="flex flex-col items-center gap-4 px-8">
              {partido.resultado && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-white text-5xl font-bold">{partido.resultado.local}</span>
                    <span className="text-white text-xl" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>-</span>
                    <span className="text-white text-5xl font-bold">{partido.resultado.visitante}</span>
                  </div>
                  <p
                    className="px-4 py-2 rounded font-semibold text-sm"
                    style={{
                      background: 'rgba(220, 165, 0, 0.3)',
                      color: '#B8A000'
                    }}
                  >
                    FINALIZADO
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="text-6xl">{partido.visitante.logo}</div>
              <p className="text-white text-sm font-semibold">{partido.visitante.nombre}</p>
            </div>
          </div>

          {/* Información del partido */}
          <div className="grid grid-cols-3 gap-4 text-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px' }}>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Fecha</p>
              <p className="text-white font-semibold text-sm">{partido.fecha}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Hora</p>
              <p className="text-white font-semibold text-sm">{partido.hora}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Cancha</p>
              <p className="text-white font-semibold text-sm">{partido.cancha}</p>
            </div>
          </div>

          {/* Sección Goles */}
          {(partido.goles.local.length > 0 || partido.goles.visitante.length > 0) && (
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px' }}>
              <h3 className="text-white text-lg font-bold mb-4">⚽ GOLES</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Goles Local */}
                <div className="flex flex-col gap-2">
                  {partido.goles.local.map((gol, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      <span className="text-white font-semibold text-sm flex-1">{gol.jugador}</span>
                      <span className="text-white text-xs px-2 py-1 rounded" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                        min {gol.minuto}
                      </span>
                    </div>
                  ))}
                  {partido.goles.local.length === 0 && (
                    <p style={{ color: 'rgba(255, 255, 255, 0.4)' }} className="text-xs">Sin goles</p>
                  )}
                </div>

                {/* Goles Visitante */}
                <div className="flex flex-col gap-2">
                  {partido.goles.visitante.map((gol, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      <span className="text-white font-semibold text-sm flex-1">{gol.jugador}</span>
                      <span className="text-white text-xs px-2 py-1 rounded" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                        min {gol.minuto}
                      </span>
                    </div>
                  ))}
                  {partido.goles.visitante.length === 0 && (
                    <p style={{ color: 'rgba(255, 255, 255, 0.4)' }} className="text-xs">Sin goles</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sección Tarjetas */}
          {(partido.tarjetas.local.length > 0 || partido.tarjetas.visitante.length > 0) && (
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px' }}>
              <h3 className="text-white text-lg font-bold mb-4">🟨🟥 TARJETAS</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Tarjetas Local */}
                <div className="flex flex-col gap-2">
                  {partido.tarjetas.local.map((tarjeta, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      <span
                        className="text-lg"
                        style={{ color: tarjeta.tipo === 'amarilla' ? '#FFD700' : '#FF6B6B' }}
                      >
                        {tarjeta.tipo === 'amarilla' ? '🟨' : '🟥'}
                      </span>
                      <span className="text-white font-semibold text-sm flex-1">{tarjeta.jugador}</span>
                      <span className="text-white text-xs px-2 py-1 rounded" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                        min {tarjeta.minuto}
                      </span>
                    </div>
                  ))}
                  {partido.tarjetas.local.length === 0 && (
                    <p style={{ color: 'rgba(255, 255, 255, 0.4)' }} className="text-xs">Sin tarjetas</p>
                  )}
                </div>

                {/* Tarjetas Visitante */}
                <div className="flex flex-col gap-2">
                  {partido.tarjetas.visitante.map((tarjeta, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      <span
                        className="text-lg"
                        style={{ color: tarjeta.tipo === 'amarilla' ? '#FFD700' : '#FF6B6B' }}
                      >
                        {tarjeta.tipo === 'amarilla' ? '🟨' : '🟥'}
                      </span>
                      <span className="text-white font-semibold text-sm flex-1">{tarjeta.jugador}</span>
                      <span className="text-white text-xs px-2 py-1 rounded" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                        min {tarjeta.minuto}
                      </span>
                    </div>
                  ))}
                  {partido.tarjetas.visitante.length === 0 && (
                    <p style={{ color: 'rgba(255, 255, 255, 0.4)' }} className="text-xs">Sin tarjetas</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Posesión */}
          {partido.posesion && (
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px' }}>
              <h3 className="text-white text-lg font-bold mb-4">Dominación del balón</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-semibold">{partido.local.nombre}</span>
                    <span className="text-white font-bold">{partido.posesion.local}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${partido.posesion.local}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-semibold">{partido.visitante.nombre}</span>
                    <span className="text-white font-bold">{partido.posesion.visitante}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${partido.posesion.visitante}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con botón Volver */}
        <div
          className="px-8 py-6 flex justify-start"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
            style={{
              background: '#003C81',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Calendario() {
  const { userName, fullName, userPhoto, userRole, loading: userLoading, showLogoutModal, setShowLogoutModal, confirmLogout } = useDashboard();
  const [partidos, setPartidos] = useState([]);
  const [loadingPartidos, setLoadingPartidos] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPartido, setSelectedPartido] = useState(null);

  const handleLogout = () => setShowLogoutModal(true);

  // Cargar partidos del backend
  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        setLoadingPartidos(true);
        setError(null);
        
        // Realizar la petición al backend
        // Ajusta el endpoint según tu API real (/matches, /games, /partidos, etc.)
        const response = await authFetch('/matches');
        
        if (!response.ok) {
          throw new Error(`Error al cargar partidos: ${response.status}`);
        }
        
        const data = await response.json();
        const partidosList = Array.isArray(data) ? data : data.data || [];
        
        // Normalizar cada partido para asegurar que tenga la estructura correcta
        const partidosNormalizados = partidosList.map(normalizarPartido);
        setPartidos(partidosNormalizados);
      } catch (err) {
        console.error('Error cargando partidos:', err);
        setError(err.message);
      } finally {
        setLoadingPartidos(false);
      }
    };

    fetchPartidos();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden relative" style={{ background: '#000F20' }}>
      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}

      <Sidebar active="calendario" onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          userName={userLoading ? '...' : userName}
          fullName={userLoading ? '...' : fullName}
          userPhoto={userPhoto}
          userRole={userRole}
          onLogout={handleLogout}
        />

        {/* Contenido Principal */}
        <div className="flex-1 overflow-y-auto" style={{ background: '#000F20' }}>
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-white text-4xl font-bold" style={{ fontFamily: "'Anton SC', sans-serif" }}>
                MIS PARTIDOS
              </h1>
            </div>

            {/* Estado: Cargando */}
            {loadingPartidos && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Cargando partidos...</p>
                </div>
              </div>
            )}

            {/* Estado: Error */}
            {error && !loadingPartidos && (
              <div className="rounded-lg p-6 mb-6" style={{ background: 'rgba(200, 100, 100, 0.2)', border: '1px solid rgba(200, 100, 100, 0.5)' }}>
                <p className="text-red-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ⚠️ {error}
                </p>
              </div>
            )}

            {/* Estado: Sin datos */}
            {!loadingPartidos && partidos.length === 0 && !error && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-white text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    No hay partidos disponibles
                  </p>
                </div>
              </div>
            )}

            {/* Grid de Partidos */}
            {!loadingPartidos && partidos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {partidos.map(partido => (
                  <CartaPartido
                    key={partido.id}
                    partido={partido}
                    onPartidoClick={setSelectedPartido}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles del Partido */}
      {selectedPartido && (
        <ModalPartido
          partido={selectedPartido}
          onClose={() => setSelectedPartido(null)}
        />
      )}
    </div>
  );
}