import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoTCF from '../assets/logos/logo-tcf.png';
import campus1 from '../assets/campus/campus-1.jpg';
import campus2 from '../assets/campus/campus-2.jpg';
import campus3 from '../assets/campus/campus-3.jpg';
import campus4 from '../assets/campus/campus-4.png';
import campus5 from '../assets/campus/campus-5.jpg';
import robotJugador from '../assets/robots/robot-jugador.png';
import robotCapitan from '../assets/robots/robot-capitan.png';
import robotAdmin from '../assets/robots/robot-admin.png';
import robotArbitro from '../assets/robots/robot-arbitro.png';
import robotOrganizador from '../assets/robots/robot-organizador.png';

const campusImages = [campus1, campus2, campus3, campus4, campus5];

const roles = [
  { name: 'Jugador', color: '#002652', robot: robotJugador, message: 'Listo para empezar\nJugar' },
  { name: 'Capitan', color: '#01540D', robot: robotCapitan, message: 'Listo para empezar\nDirigir' },
  { name: 'Administrador', color: '#50070C', robot: robotAdmin, message: 'Listo para empezar\nAdministrar' },
  { name: 'Arbitro', color: '#514F01', robot: robotArbitro, message: 'Listo para empezar\nArbitrar' },
  { name: 'Organizador', color: '#260053', robot: robotOrganizador, message: 'Listo para empezar\nCordinar' },
];

const DEFAULT_COLOR = '#002652';

export default function Home() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [bgColor, setBgColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % campusImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (role) => {
    if (selectedRole === role.name) {
      setSelectedRole(null);
      setBgColor(DEFAULT_COLOR);
    } else {
      setSelectedRole(role.name);
      setBgColor(role.color);
    }
  };

  return (
    <div
      className="flex h-screen w-full text-white overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: bgColor }}
    >
      {/* Left Column */}
      <div className="w-full md:w-[45%] flex flex-col px-10 py-12 md:px-16 lg:px-24 justify-center relative z-10">

        {/* Logo + Title */}
        <div className="flex items-center gap-4 mb-12">
          <h1
            className="text-5xl md:text-[3.5rem] uppercase tracking-tight text-white m-0 leading-none"
            style={{ fontFamily: "'Anton SC', sans-serif" }}
          >
            TechCup Futbol
          </h1>
          <img
            src={logoTCF}
            alt="TechCup Futbol Logo"
            className="w-20 h-auto object-contain"
          />
        </div>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl font-light mb-10 max-w-md leading-relaxed text-gray-100"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Hola como estas antes de continuar,
          <br /> con cual te identificas mas:
        </p>

        {/* Checkbox List */}
        <div className="flex flex-col gap-6">
          {roles.map((role) => {
            const isChecked = selectedRole === role.name;
            return (
              <label
                key={role.name}
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => handleRoleSelect(role)}
              >
                <div
                  className={`w-7 h-7 border-2 flex flex-shrink-0 items-center justify-center transition-colors rounded-sm
                    ${isChecked ? 'border-white bg-white/20' : 'border-white/70 group-hover:border-white'}`}
                >
                  {isChecked && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-2xl md:text-3xl tracking-wide text-gray-100 group-hover:text-white transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 400 }}
                >
                  {role.name}
                </span>
              </label>
            );
          })}
        </div>

        {/* Continuar button — appears when a role is selected */}
        {selectedRole && (
          <button
            onClick={() => navigate('/registro', { state: { role: selectedRole } })}
            className="mt-8 border-2 border-white px-10 py-3 rounded text-white text-xl hover:bg-white/10 transition-all duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Continuar
          </button>
        )}
      </div>

      {/* Right Column — Campus images with crossfade */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[55%]">
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

        {/* Dark overlay to push campus back */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Gradient blend — one layer per role color */}
        {roles.map((role) => (
          <div
            key={role.name}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              background: `linear-gradient(to right, ${role.color} 0%, ${role.color}CC 15%, transparent 45%)`,
              opacity: bgColor === role.color ? 1 : 0,
            }}
          />
        ))}

        {/* Robot + Message per role */}
        {roles.map((role) => {
          const isActive = selectedRole === role.name;
          const line2 = role.message.split('\n')[1];
          return (
            <div
              key={role.name}
              className="absolute inset-0 flex items-center justify-center gap-6 transition-opacity duration-500 px-8"
              style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none' }}
            >
              {/* Robot image */}
              <img
                src={role.robot}
                alt={`Robot ${role.name}`}
                className="h-[55%] max-h-[55vh] object-contain relative z-10 drop-shadow-2xl"
              />
              {/* Message beside robot */}
              <div
                className="relative z-20 flex flex-col"
                style={{ fontFamily: "'Anton SC', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                <span className="text-3xl lg:text-4xl xl:text-5xl uppercase leading-tight">
                  <span style={{ color: role.color }}>{`Listo `}</span>
                  <span style={{ color: '#FFFFFF' }}>para empezar</span>
                </span>
                <span
                  className="text-4xl lg:text-5xl xl:text-6xl uppercase leading-tight"
                  style={{ color: role.color }}
                >
                  {line2}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
