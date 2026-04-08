import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoTCF from '../assets/logos/logo-tcf.png';
import robotPintor from '../assets/robots/Robot-arte.png';
import robotTimido from '../assets/robots/robot-timido.png';
import robotSaludo from '../assets/robots/robot-jugador.png';

const posiciones = [
  'Portero', 'Defensa Central', 'Lateral Derecho', 'Lateral Izquierdo',
  'Mediocampista', 'Volante', 'Extremo Derecho', 'Extremo Izquierdo',
  'Delantero Centro', 'Mediapunta',
];

const pies = ['Derecho', 'Izquierdo', 'Ambidiestro'];

export default function PerfilDeportivo() {
  const navigate = useNavigate();
  const [posicion, setPosicion] = useState('');
  const [otraPosicion, setOtraPosicion] = useState('');
  const [dorsal, setDorsal] = useState('');
  const [pieDominante, setPieDominante] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoCuerpo, setFotoCuerpo] = useState(null);

  const [showPosicion, setShowPosicion] = useState(false);
  const [showOtra, setShowOtra] = useState(false);
  const [showPie, setShowPie] = useState(false);

  const handleFotoPerfil = (e) => {
    const file = e.target.files[0];
    if (file) setFotoPerfil(URL.createObjectURL(file));
  };

  const handleFotoCuerpo = (e) => {
    const file = e.target.files[0];
    if (file) setFotoCuerpo(URL.createObjectURL(file));
  };

  return (
    <div className="h-screen w-full bg-[#002652] text-white relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-8 py-3 bg-[#001a3a] flex-shrink-0">
        <img src={logoTCF} alt="TCF" className="w-12 h-auto" />
        <h1
          className="text-2xl md:text-3xl uppercase"
          style={{ fontFamily: "'Anton SC', sans-serif" }}
        >
          TechCup Futbol
        </h1>
      </div>

      {/* Divider line */}
      <div className="h-px bg-white/20 flex-shrink-0" />

      {/* Robot pintor — right side, large */}
      <img
        src={robotPintor}
        alt="Robot pintor"
        className="absolute right-[-40px] top-16 h-[85vh] object-contain z-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 flex-1 px-8 md:px-12 py-6 flex flex-col">
        {/* Row 1: Title + Position dropdowns */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <h2
            className="text-xl md:text-2xl italic"
            style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 400 }}
          >
            Configuremos Tu Perfil Deportivo
          </h2>

          {/* Posición principal */}
          <div className="relative">
            <button
              onClick={() => { setShowPosicion(!showPosicion); setShowOtra(false); setShowPie(false); }}
              className="flex items-center gap-3 bg-[#001a3a] border border-white/30 rounded px-5 py-2.5 min-w-[220px] justify-between"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="text-sm">{posicion || 'Cual es tu posicion'}</span>
              <svg className={`w-4 h-4 transition-transform ${showPosicion ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showPosicion && (
              <div className="absolute top-full left-0 w-full bg-[#001a3a] border border-white/30 rounded mt-1 z-30 max-h-48 overflow-y-auto">
                {posiciones.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPosicion(p); setShowPosicion(false); }}
                    className="w-full text-left px-5 py-2 text-sm hover:bg-white/10 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Otra posición */}
          <div className="relative">
            <button
              onClick={() => { setShowOtra(!showOtra); setShowPosicion(false); setShowPie(false); }}
              className="flex items-center gap-3 bg-[#001a3a] border border-white/30 rounded px-5 py-2.5 min-w-[200px] justify-between"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="text-sm">{otraPosicion || 'Otra Posicion'}</span>
              <svg className={`w-4 h-4 transition-transform ${showOtra ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showOtra && (
              <div className="absolute top-full left-0 w-full bg-[#001a3a] border border-white/30 rounded mt-1 z-30 max-h-48 overflow-y-auto">
                {posiciones.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setOtraPosicion(p); setShowOtra(false); }}
                    className="w-full text-left px-5 py-2 text-sm hover:bg-white/10 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Images section */}
        <p
          className="text-lg mb-4 italic"
          style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 400 }}
        >
          Agrega tu mejor imagen
        </p>

        <div className="flex items-start gap-10 mb-6 flex-1">
          {/* Profile photo circle */}
          <div className="flex flex-col items-center gap-3">
            <label className="cursor-pointer">
              <div className="w-36 h-36 rounded-full bg-gray-600/80 flex items-center justify-center overflow-hidden border-2 border-white/30">
                {fotoPerfil ? (
                  <img src={fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-14 h-14 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFotoPerfil} />
            </label>

            {/* Dorsal below profile */}
            <input
              type="number"
              min="1"
              max="99"
              placeholder="Seleciona tu Dorsal"
              value={dorsal}
              onChange={(e) => setDorsal(e.target.value)}
              className="bg-[#001a3a] border border-white/30 rounded px-4 py-2 text-white placeholder-white/60 outline-none w-[200px] text-sm"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />

            {/* Pie dominante below dorsal */}
            <div className="relative">
              <button
                onClick={() => { setShowPie(!showPie); setShowPosicion(false); setShowOtra(false); }}
                className="flex items-center gap-3 bg-[#001a3a] border border-white/30 rounded px-4 py-2 w-[200px] justify-between"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="text-sm">{pieDominante || 'Pie Dominante'}</span>
                <svg className={`w-4 h-4 transition-transform ${showPie ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPie && (
                <div className="absolute bottom-full left-0 w-full bg-[#001a3a] border border-white/30 rounded mb-1 z-30">
                  {pies.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPieDominante(p); setShowPie(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full body photo — robot silhouette placeholder */}
          <label className="cursor-pointer flex flex-col items-center">
            <div className="w-44 h-72 bg-gray-600/40 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-600/60 transition-colors">
              {fotoCuerpo ? (
                <img src={fotoCuerpo} alt="Cuerpo completo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <img src={robotTimido} alt="" className="w-24 opacity-40" />
                  <span
                    className="text-center text-sm uppercase font-bold leading-tight px-3 opacity-80"
                    style={{ fontFamily: "'Anton SC', sans-serif" }}
                  >
                    Pon aqui una imagen de cuerpo completo
                  </span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFotoCuerpo} />
          </label>

          {/* Continue section */}
          <div className="flex flex-col items-center gap-4 self-center">
            <img src={robotSaludo} alt="" className="w-16 opacity-40" />
            <button
              onClick={() => navigate('/registro')}
              className="bg-[#001a3a] border border-white/30 px-12 py-3 rounded text-white text-lg hover:bg-white/10 transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
