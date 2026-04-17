import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import logoTCF2 from '../assets/logos/LOGO FUTBOLL F Letras blancas.png';

import campus1 from '../assets/campus/campus-1.jpg';
import campus2 from '../assets/campus/campus-2.jpg';
import campus3 from '../assets/campus/campus-3.jpg';
import campus4 from '../assets/campus/campus-4.png';
import campus5 from '../assets/campus/campus-5.jpg';

import robotJugador from '../assets/robots/asomandose rb.png';
import robotCapitan from '../assets/robots/robot capitan.png';
import robotAdmin from '../assets/robots/robot admin.png';
import robotArbitro from '../assets/robots/robot arbitro.png';
import robotOrganizador from '../assets/robots/robot organizador.png';


const campusImages = [campus1, campus2, campus3, campus4, campus5];

const roles = [
  { name: 'Jugador', color: '#002652', robot: robotJugador, message: 'Jugar' },
  { name: 'Capitan', color: '#01540D', robot: robotCapitan, message: 'Dirigir' },
  { name: 'Administrador', color: '#50070C', robot: robotAdmin, message: 'Administrar' },
  { name: 'Arbitro', color: '#514F01', robot: robotArbitro, message: 'Arbitrar' },
  { name: 'Organizador', color: '#260053', robot: robotOrganizador, message: 'Coordinar' },
];

const DEFAULT_COLOR = '#002652';


export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromRegistration = location.state?.fromRegistration || false;

  const [hoveredRole, setHoveredRole] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % campusImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex h-screen w-full overflow-hidden text-white transition-colors duration-700"
      style={{
        backgroundColor: hoveredRole?.color || DEFAULT_COLOR,
      }}
    >
      {/* LEFT */}
      <div
        className="w-full md:w-[45%] flex flex-col px-10 py-12 md:px-16 lg:px-24 justify-center relative z-10"
        onMouseLeave={() => setHoveredRole(null)}
      >
        {/* LOGO */}
        <div className="flex items-center gap-4 mb-12">
          <h1
            className="text-5xl md:text-[3.5rem] uppercase tracking-tight"
            style={{
              fontFamily: "'Anton SC', sans-serif",
            }}
          >
            TechCup Futbol
          </h1>

          <img
            src={logoTCF2}
            alt="Logo"
            className="w-20 h-auto"
          />
        </div>

        {/* SUBTITLE */}
        <p
          className="text-xl md:text-2xl font-light mb-10"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Hola como estas antes de continuar,
          <br />
          con cual te identificas mas:
        </p>

        {/* ROLES */}
        <div className="flex flex-col gap-6">
          {roles.map((role) => {
            const isActive = hoveredRole?.name === role.name;

            return (
              <label
                key={role.name}
                className="flex items-center gap-4 cursor-pointer group"
                onMouseEnter={() => setHoveredRole(role)}
                onClick={() =>
                  navigate('/register', {
                    state: { role: role.name },
                  })
                }
              >
                <div
                  className={`w-7 h-7 border-2 flex items-center justify-center rounded-sm transition-all
                  ${
                    isActive
                      ? 'border-white bg-white/20'
                      : 'border-white/70 group-hover:border-white'
                  }`}
                >
                  {isActive && (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                <span
                  className="text-2xl md:text-3xl"
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                  }}
                >
                  {role.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>


      {/* RIGHT */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden">

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

        <div className="absolute inset-0 bg-black/30" />

        {roles.map((role) => {
          const isActive = hoveredRole?.name === role.name;

          return (
            <div
              key={role.name}
              className="absolute inset-0 flex items-center justify-center gap-10 px-8 overflow-hidden transition-opacity duration-500"
              style={{
                opacity: isActive ? 1 : 0,
              }}
            >
              {/* ROBOT */}
              <img
                src={role.robot}
                alt={role.name}
                className="
                  h-[70%]
                  max-h-[70vh]
                  object-contain
                  -translate-x-20
                  translate-y-52
                "
              />

              {/* TEXT */}
              <div
                className="-translate-y-4"
                style={{
                  fontFamily: "'Anton SC', sans-serif",
                }}
              >
                <span className="text-4xl uppercase block">
                  <span style={{ color: role.color }}>
                    Listo
                  </span>{' '}
                  para empezar
                </span>

                <span
                  className="text-6xl uppercase"
                  style={{
                    color: role.color,
                  }}
                >
                  {role.message}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}