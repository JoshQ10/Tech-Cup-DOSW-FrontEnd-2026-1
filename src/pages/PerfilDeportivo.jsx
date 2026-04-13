import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoTCF from '../assets/logos/logo-tcf.png';
import robotPintor from '../assets/robots/Robot-arte.png';
import robotSilueta from '../assets/robots/Silueta-robot.png';
import robotJugador from '../assets/robots/robot-jugador.png';

// Dorsales disponibles
import camisa1  from '../assets/camisa robots/1.png';
import camisa2  from '../assets/camisa robots/2.png';
import camisa3  from '../assets/camisa robots/3.png';
import camisa4  from '../assets/camisa robots/4.png';
import camisa5  from '../assets/camisa robots/5.png';
import camisa6  from '../assets/camisa robots/6.png';
import camisa7  from '../assets/camisa robots/7.png';
import camisa8  from '../assets/camisa robots/8.png';
import camisa9  from '../assets/camisa robots/9.png';
import camisa10 from '../assets/camisa robots/10.png';
import camisa69 from '../assets/camisa robots/69.png';

const dorsales = [
  { num: 6,  img: camisa6  },
  { num: 5,  img: camisa5  },
  { num: 4,  img: camisa4  },
  { num: 3,  img: camisa3  },
  { num: 2,  img: camisa2  },
  { num: 1,  img: camisa1  },
  { num: 69, img: camisa69 },
  { num: 10, img: camisa10 },
  { num: 9,  img: camisa9  },
  { num: 8,  img: camisa8  },
  { num: 7,  img: camisa7  },
];

const posiciones = [
  'Portero','Defensa Central','Lateral Derecho','Lateral Izquierdo',
  'Mediocampista','Volante','Extremo Derecho','Extremo Izquierdo',
  'Delantero Centro','Mediapunta',
];

const pies = ['Derecho', 'Izquierdo', 'Ambidiestro'];

// ── POP DORSAL ──
function PopDorsal({ onSelect, onClose }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-xl relative overflow-visible flex"
        style={{ background: '#d0d4db', maxWidth: '850px', width: '95%', padding: '32px' }}>

        {/* Robot asomándose derecha */}
        <img src={robotPintor} alt="Robot"
          className="absolute pointer-events-none"
          style={{ right: '-60px', bottom: '-20px', height: '420px', zIndex: 10 }} />

        <div className="flex-1 pr-48">
          <h2 className="text-3xl uppercase font-bold text-[#002652] mb-6"
            style={{ fontFamily: "'Anton SC', sans-serif" }}>
            Selecciona tu dorsal
          </h2>

          {/* Grid de dorsales */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {dorsales.map(({ num, img }) => (
              <button key={num}
                onClick={() => setSelected(num)}
                className="rounded-full overflow-hidden transition-all"
                style={{
                  width: '110px', height: '110px',
                  border: selected === num ? '4px solid #003C81' : '3px solid transparent',
                  boxShadow: selected === num ? '0 0 0 3px #003C81' : 'none',
                  background: 'transparent',
                }}>
                <img src={img} alt={`Dorsal ${num}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Botón Continuar */}
          <div className="flex justify-end">
            <button
              onClick={() => { if (selected) { onSelect(selected); onClose(); } }}
              disabled={!selected}
              className="px-10 py-3 text-white text-base rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: selected ? '#002652' : '#666',
                fontFamily: "'Poppins', sans-serif",
              }}>
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── POP FOTO ──
function PopFoto({ titulo, onAdd, onClose }) {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-xl relative overflow-visible"
        style={{ background: '#d0d4db', maxWidth: '800px', width: '95%', padding: '36px' }}>

        <h2 className="text-3xl uppercase font-bold text-[#002652] mb-6"
          style={{ fontFamily: "'Anton SC', sans-serif" }}>
          Sube tu mejor foto
        </h2>

        <div className="flex gap-8 items-start">
          {/* Columna izquierda — instrucciones */}
          <div className="flex flex-col gap-4" style={{ minWidth: '220px' }}>
            <p className="text-[#002652] font-bold text-base leading-snug"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Tranquilo si no la tienes la puedes subir en otro momento,{' '}
              <span className="text-blue-700">si quieres</span> puedes{' '}
              <span className="text-blue-500">no tener imagen</span>
            </p>

            {/* Ejemplo */}
            <div className="rounded-lg overflow-hidden w-28 mt-2"
              style={{ border: '2px solid #aaa' }}>
              <div className="bg-green-500 flex items-center justify-center"
                style={{ height: '120px' }}>
                <span className="text-white text-xs font-bold text-center px-2"
                  style={{ fontFamily: "'Anton SC', sans-serif" }}>
                  Esto es un ejemplo
                </span>
              </div>
            </div>

            {/* Robot sentado */}
            <img src={robotJugador} alt="Robot"
              className="w-24 object-contain mt-2" />
          </div>

          {/* Columna derecha — área de carga */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-gray-700 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Hola usuario sube tu imagen aquí...
            </p>
            <p className="text-gray-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              garantice que tenga el siguiente tamaño y el{' '}
              <span className="font-bold">FONDO VERDE</span>
            </p>
            <p className="text-gray-600 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              width : 1428 px / 12.09 cm<br />
              height : 2920 px / 24.72 cm
            </p>
            <p className="text-gray-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              haga click o arrástrela
            </p>

            {/* Drop zone */}
            <label
              className="flex items-center justify-center rounded-lg cursor-pointer transition-colors"
              style={{
                height: '160px',
                border: dragging ? '2px solid #003C81' : '2px dashed #aaa',
                background: dragging ? 'rgba(0,60,129,0.08)' : 'rgba(255,255,255,0.7)',
              }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <img src={preview} alt="Preview"
                  className="h-full w-auto object-contain rounded" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth={1.5} className="w-12 h-12">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  <span className="text-xs">Haga click o arrastre la imagen</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden"
                onChange={e => handleFile(e.target.files[0])} />
            </label>

            {/* Botones */}
            <div className="flex justify-between mt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-white rounded text-sm transition-colors"
                style={{ background: '#666', fontFamily: "'Poppins', sans-serif" }}>
                Omitir
              </button>
              <button
                onClick={() => { onAdd(preview); onClose(); }}
                className="px-8 py-2.5 text-white rounded text-sm transition-colors"
                style={{ background: '#002652', fontFamily: "'Poppins', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.background = '#003C81'}
                onMouseLeave={e => e.currentTarget.style.background = '#002652'}>
                Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PERFIL DEPORTIVO ──
export default function PerfilDeportivo() {
  const navigate = useNavigate();
  const [posicion, setPosicion]         = useState('');
  const [otraPosicion, setOtraPosicion] = useState('');
  const [dorsal, setDorsal]             = useState(null);
  const [dorsalImg, setDorsalImg]       = useState(null);
  const [pieDominante, setPieDominante] = useState('');
  const [fotoPerfil, setFotoPerfil]     = useState(null);
  const [fotoCuerpo, setFotoCuerpo]     = useState(null);

  const [showPosicion, setShowPosicion] = useState(false);
  const [showOtra, setShowOtra]         = useState(false);
  const [showPie, setShowPie]           = useState(false);
  const [showDorsal, setShowDorsal]     = useState(false);
  const [showFotoPerfil, setShowFotoPerfil] = useState(false);
  const [showFotoCuerpo, setShowFotoCuerpo] = useState(false);

  const handleSelectDorsal = (num) => {
    setDorsal(num);
    const found = dorsales.find(d => d.num === num);
    if (found) setDorsalImg(found.img);
  };

  return (
    <div className="h-screen w-full text-white relative overflow-hidden flex flex-col"
      style={{ background: '#002652' }}>

      {/* Pops */}
      {showDorsal && (
        <PopDorsal
          onSelect={handleSelectDorsal}
          onClose={() => setShowDorsal(false)}
        />
      )}
      {showFotoPerfil && (
        <PopFoto
          titulo="Sube tu mejor foto"
          onAdd={url => setFotoPerfil(url)}
          onClose={() => setShowFotoPerfil(false)}
        />
      )}
      {showFotoCuerpo && (
        <PopFoto
          titulo="Foto cuerpo completo"
          onAdd={url => setFotoCuerpo(url)}
          onClose={() => setShowFotoCuerpo(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 px-8 py-3 flex-shrink-0"
        style={{ background: '#001a3a', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img src={logoTCF} alt="TCF" className="w-12 h-auto" />
        <h1 className="text-2xl md:text-3xl uppercase"
          style={{ fontFamily: "'Anton SC', sans-serif" }}>
          TechCup Futbol
        </h1>
      </div>

      {/* Robot pintor derecha */}
      <img src={robotPintor} alt="Robot pintor"
        className="absolute pointer-events-none z-0"
        style={{ right: '-60px', top: '80px', height: '90vh', objectFit: 'contain' }} />

      {/* Contenido */}
      <div className="relative z-10 flex-1 px-8 md:px-12 py-6 flex flex-col">

        {/* Fila 1 — título + dropdowns */}
        <div className="flex flex-wrap items-center gap-6 mb-8">
          <h2 className="text-2xl md:text-3xl italic"
            style={{ fontFamily: "'Oswald', sans-serif" }}>
            Configuremos Tu Perfil Deportivo
          </h2>

          {/* Posición principal */}
          <div className="relative">
            <button
              onClick={() => { setShowPosicion(!showPosicion); setShowOtra(false); setShowPie(false); }}
              className="flex items-center gap-3 rounded px-6 py-3 min-w-[240px] justify-between text-base"
              style={{ background: '#001a3a', border: '1px solid rgba(255,255,255,0.3)', fontFamily: "'Poppins', sans-serif" }}>
              <span>{posicion || 'Cual es tu posicion'}</span>
              <svg className={`w-5 h-5 transition-transform ${showPosicion ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showPosicion && (
              <div className="absolute top-full left-0 w-full rounded mt-1 z-30 max-h-48 overflow-y-auto"
                style={{ background: '#001a3a', border: '1px solid rgba(255,255,255,0.3)' }}>
                {posiciones.map(p => (
                  <button key={p} onClick={() => { setPosicion(p); setShowPosicion(false); }}
                    className="w-full text-left px-6 py-2.5 hover:bg-white/10 transition-colors text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
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
              className="flex items-center gap-3 rounded px-6 py-3 min-w-[220px] justify-between text-base"
              style={{ background: '#001a3a', border: '1px solid rgba(255,255,255,0.3)', fontFamily: "'Poppins', sans-serif" }}>
              <span>{otraPosicion || 'Otra Posicion'}</span>
              <svg className={`w-5 h-5 transition-transform ${showOtra ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showOtra && (
              <div className="absolute top-full left-0 w-full rounded mt-1 z-30 max-h-48 overflow-y-auto"
                style={{ background: '#001a3a', border: '1px solid rgba(255,255,255,0.3)' }}>
                {posiciones.map(p => (
                  <button key={p} onClick={() => { setOtraPosicion(p); setShowOtra(false); }}
                    className="w-full text-left px-6 py-2.5 hover:bg-white/10 transition-colors text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fila 2 — imágenes */}
        <p className="text-2xl mb-6 italic"
          style={{ fontFamily: "'Oswald', sans-serif" }}>
          Agrega tu mejor imagen
        </p>

        <div className="flex items-start gap-10">

          {/* Foto perfil + dorsal + pie */}
          <div className="flex flex-col items-center gap-3">
            {/* Círculo foto perfil */}
            <button
              onClick={() => setShowFotoPerfil(true)}
              className="rounded-full overflow-hidden flex items-center justify-center transition-opacity hover:opacity-80"
              style={{
                width: '192px', height: '192px',
                background: '#4b5563',
                border: '2px solid rgba(255,255,255,0.3)',
              }}>
              {fotoPerfil ? (
                <img src={fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              )}
            </button>

            {/* Botón dorsal */}
            <button
              onClick={() => setShowDorsal(true)}
              className="flex items-center gap-2 rounded px-4 py-2 w-[220px] transition-colors hover:bg-white/10"
              style={{ background: '#001a3a', border: '1px solid rgba(255,255,255,0.3)', fontFamily: "'Poppins', sans-serif" }}>
              {dorsalImg && (
                <img src={dorsalImg} alt={`Dorsal ${dorsal}`} className="w-8 h-8 object-contain rounded-full" />
              )}
              <span className="text-sm">{dorsal ? `Dorsal ${dorsal}` : 'Seleciona tu Dorsal'}</span>
            </button>

            {/* Pie dominante */}
            <div className="relative">
              <button
                onClick={() => { setShowPie(!showPie); setShowPosicion(false); setShowOtra(false); }}
                className="flex items-center gap-3 rounded px-4 py-2 w-[220px] justify-between"
                style={{ background: '#001a3a', border: '1px solid rgba(255,255,255,0.3)', fontFamily: "'Poppins', sans-serif" }}>
                <span className="text-sm">{pieDominante || 'Pie Dominante'}</span>
                <svg className={`w-4 h-4 transition-transform ${showPie ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPie && (
                <div className="absolute bottom-full left-0 w-full rounded mb-1 z-30"
                  style={{ background: '#001a3a', border: '1px solid rgba(255,255,255,0.3)' }}>
                  {pies.map(p => (
                    <button key={p} onClick={() => { setPieDominante(p); setShowPie(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Foto cuerpo completo */}
          <button
            onClick={() => setShowFotoCuerpo(true)}
            className="rounded-lg overflow-hidden flex flex-col items-center justify-center gap-4 hover:opacity-80 transition-opacity"
            style={{
              width: '224px', height: '320px',
              background: 'rgba(75,85,99,0.4)',
              border: '2px dashed rgba(255,255,255,0.2)',
            }}>
            {fotoCuerpo ? (
              <img src={fotoCuerpo} alt="Cuerpo" className="w-full h-full object-cover" />
            ) : (
              <>
                <img src={robotSilueta} alt="" className="w-32 opacity-60" />
                <span className="text-center text-sm uppercase font-bold leading-tight px-3 opacity-80"
                  style={{ fontFamily: "'Anton SC', sans-serif" }}>
                  Pon aqui una imagen de cuerpo completo
                </span>
              </>
            )}
          </button>

          {/* Botón Continuar */}
          <div className="flex flex-col justify-end self-end mb-4">
            <button
              onClick={() => navigate('/registro')}
              className="px-10 py-3 text-white text-base rounded transition-colors"
              style={{ background: '#001a3a', border: '1px solid rgba(255,255,255,0.3)', fontFamily: "'Poppins', sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.background = '#003C81'}
              onMouseLeave={e => e.currentTarget.style.background = '#001a3a'}>
              Continuar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}