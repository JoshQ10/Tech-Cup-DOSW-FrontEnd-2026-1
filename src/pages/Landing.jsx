import { useNavigate } from 'react-router-dom';
import logoTCF from '../assets/logos/logo-tcf.png';
import logoEscuela from '../assets/logos/logo-escuela.png';
import logoIngenierias from '../assets/logos/logo-ingenierias.png';
import campus1 from '../assets/campus/campus-1.jpg';
import campus2 from '../assets/campus/campus-2.jpg';
import campus3 from '../assets/campus/campus-3.jpg';
import campus4 from '../assets/campus/campus-4.png';
import campus5 from '../assets/campus/campus-5.jpg';
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
        <div className="relative z-10 flex flex-col items-center">
          {/* Logos + Title */}
          <div className="flex items-center gap-6 mb-10">
            <img src={logoEscuela} alt="Escuela Colombiana de Ingeniería" className="h-24 md:h-32 object-contain" />
            <div className="w-px h-20 bg-[#002652]" />
            <img src={logoTCF} alt="TCF" className="w-20 md:w-24 object-contain" />
            <h1
              className="text-4xl md:text-6xl text-[#002652] uppercase"
              style={{ fontFamily: "'Anton SC', sans-serif" }}
            >
              TechCup Futbol
            </h1>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 w-72">
            <button
              onClick={() => navigate('/iniciar-sesion')}
              className="w-full py-3.5 bg-[#002652]/90 text-white rounded text-lg hover:bg-[#001a3a] transition-colors border border-white/30"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Iniciar Sesion
            </button>
            <button
              onClick={() => navigate('/seleccionar-rol')}
              className="w-full py-3.5 bg-[#002652]/90 text-white rounded text-lg hover:bg-[#001a3a] transition-colors border border-white/30"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>

      {/* Section 2 — Footer (scroll down to see) */}
      <div className="w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Top half — Dark blue */}
        <div className="bg-[#002652] px-10 md:px-16 py-10">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-white font-semibold text-lg mb-4">Redes :</h3>
            <div className="flex flex-col gap-2 text-white/80 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-base">&#9678;</span>
                <span>Escuela Colombiana de Ingenieria Julio Garavito</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold">&#10005;</span>
                <span>Escuela Colombiana de Ingenieria Julio Garavito</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom half — White */}
        <div className="bg-white px-10 md:px-16 py-10">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-10">
            {/* Left — Aviso */}
            <div className="max-w-xl">
              <h4
                className="text-[#002652] font-bold text-base mb-3"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Aviso Informativo
              </h4>
              <p
                className="text-gray-600 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Algunas imágenes, equipos o características mostradas en la aplicación pueden variar con respecto a la información real de los torneos. Los datos como resultados, posiciones o estadísticas pueden actualizarse o modificarse sin previo aviso.
              </p>
              <p
                className="text-gray-600 text-sm leading-relaxed mt-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Esta aplicación ha sido desarrollada con fines académicos como proyecto de corte para la asignatura Desarrollo de Software (DOSW) y permite la gestión de equipos, partidos y resultados dentro de un torneo de fútbol.
              </p>
              <p
                className="text-gray-600 text-sm leading-relaxed mt-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                La información mostrada depende de los datos ingresados por los usuarios o administradores del sistema.
              </p>
            </div>

            {/* Right — Logos institucionales */}
            <div className="flex flex-col gap-6 flex-shrink-0">
              <div className="flex items-center gap-4">
                <img src={logoEscuela} alt="Escuela" className="h-20 object-contain" />
                <span className="text-gray-700 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Universidad Escuela Colombiana De<br />Ingenieria Julio Garavito
                </span>
              </div>
              <div className="flex items-center gap-4">
                <img src={logoIngenierias} alt="Union Ingenierías" className="h-14 object-contain" />
                <span className="text-gray-700 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Union Ingenierias: Sistemas, Inteligencia<br />Artificial, Ciberseguridad
                </span>
              </div>
              <div className="flex items-center gap-4">
                <img src={logoTCF} alt="TCF" className="h-14 object-contain" />
                <div className="flex flex-col">
                  <span className="text-[#002652] text-sm font-bold" style={{ fontFamily: "'Anton SC', sans-serif" }}>
                    TechCup Futbol
                  </span>
                  <span className="text-gray-800 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    2026 Derechos reservados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
