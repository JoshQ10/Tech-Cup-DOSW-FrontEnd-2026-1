import { useNavigate } from 'react-router-dom';
import logoTCF from '../assets/logos/logo-tcf.png';
import logoEscuela from '../assets/logos/logo-escuela.png';
import logoIngenierias from '../assets/logos/logo-ingenierias.png';
import campus1 from '../assets/campus/campus-1.jpg';
import campus2 from '../assets/campus/campus-2.jpg';
import campus3 from '../assets/campus/campus-3.jpg';
import campus4 from '../assets/campus/campus-4.png';
import campus5 from '../assets/campus/campus-5.jpg';
import logoTCFConLetras from '../assets/logos/LOGO FUTBOLL F Con letras.png';
import { useState, useEffect } from 'react';

const campusImages = [campus1, campus2, campus3, campus4, campus5];

export default function Landing() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % campusImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-y-auto">
      {/* Section 1 — Hero (full viewport height) */}
      <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        {/* Background campus images */}
        {campusImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: index === currentImage ? 0.55 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/35" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Logos + Title */}
          <div className="flex items-center gap-6 mb-10">
            <img src={logoEscuela} alt="Escuela Colombiana de Ingeniería" className="h-24 md:h-[160px] object-contain" />
            <div className="w-px h-20 bg-[#002652]" />
            <img src={logoTCF} alt="TCF" className="w-20 md:w-[120px] object-contain" />
            <h1
              className="text-4xl md:text-[70px] text-[#002652] uppercase"
              style={{ fontFamily: "'Anton SC', sans-serif" }}
            >
              TechCup Futbol
            </h1>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-8 w-[220px]">
            <button
              onClick={() => navigate('/iniciar-sesion')}
              className="w-full h-[60px] bg-[#002652] text-white rounded text-lg hover:bg-[#001a3a] transition-colors border border-white/30"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Iniciar Sesion
            </button>
            <button
              onClick={() => navigate('/seleccionar-rol')}
              className="w-full h-[60px] bg-[#002652] text-white rounded text-lg hover:bg-[#001a3a] transition-colors border border-white/30"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>

      {/* Section 2 — Footer */}
      <div className="w-full flex" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* Izquierda — Azul oscuro */}
        <div className="bg-[#002652] w-1/2 px-10 md:px-16 py-10 flex flex-col gap-6">
          {/* Redes */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Redes :</h3>
            <div className="flex flex-col gap-3 text-white/80 text-sm">
              {/* Instagram */}
              <div className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                <span className="underline">Escuela Colombiana de Ingenieria Julio Garavito</span>
              </div>
              {/* X / Twitter */}
              <div className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="underline">Escuela Colombiana de Ingenieria Julio Garavito</span>
              </div>
            </div>
          </div>

          {/* Aviso */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Aviso informativo</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Algunas imágenes, equipos o características mostradas en la aplicación pueden variar con respecto a la información real de los torneos.
              Los datos como resultados, posiciones o estadísticas pueden actualizarse o modificarse sin previo aviso.
            </p>
            <p className="text-white/70 text-sm leading-relaxed mt-2">
              Esta aplicación ha sido desarrollada con fines académicos como proyecto de corte para la asignatura Desarrollo de Software (DOSW) y
              permite la gestión de equipos, partidos y resultados dentro de un torneo de fútbol.
            </p>
            <p className="text-white/70 text-sm leading-relaxed mt-2">
              La información mostrada depende de los datos ingresados por los usuarios o administradores del sistema.
            </p>
          </div>
        </div>

        {/* Derecha — Blanca */}
        <div className="bg-white w-1/2 px-10 py-10 flex flex-col justify-center gap-8">

          {/* Fila 1 */}
          <div className="flex items-center gap-6">
            <div className="w-[140px] flex items-center justify-center flex-shrink-0">
              <img src={logoEscuela} alt="Escuela" className="h-16 object-contain" />
            </div>
            <span className="text-gray-700 text-sm">Universida Escuela Colombiana De Ingenieria Julio Garavito</span>
          </div>

          {/* Fila 2 */}
          <div className="flex items-center gap-6">
            <div className="w-[140px] flex items-center justify-center flex-shrink-0">
              <img src={logoIngenierias} alt="Union Ingenierías" className="h-16 object-contain" />
            </div>
            <span className="text-gray-700 text-sm">Union Ingenierias: Sistemas, Inteligencia Arficial, Ciberseguridad</span>
          </div>

          {/* Fila 3 */}
          <div className="flex items-center gap-6">
            <div className="w-[140px] flex items-center justify-center flex-shrink-0">
              <img src={logoTCFConLetras} alt="TechCup Futbol" className="h-16 object-contain" />
            </div>
            <span className="text-gray-700 text-sm">TechCup Futbol 2026 Derechos reservados</span>
          </div>

        </div>

      </div>
    </div>
  );
}
