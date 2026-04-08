import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoTCF from '../assets/logos/logo-tcf.png';
import robotSaludo from '../assets/robots/robot-jugador.png';
import campus1 from '../assets/campus/campus-1.jpg';
import campus2 from '../assets/campus/campus-2.jpg';
import campus3 from '../assets/campus/campus-3.jpg';
import campus4 from '../assets/campus/campus-4.png';
import campus5 from '../assets/campus/campus-5.jpg';
import { useEffect } from 'react';

const campusImages = [campus1, campus2, campus3, campus4, campus5];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % campusImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left — Campus + Robot */}
      <div className="hidden md:flex w-1/2 relative items-end justify-center">
        {/* Campus background */}
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
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to left, #002652 0%, #002652CC 15%, transparent 45%)' }}
        />

        {/* Robot + greeting */}
        <div className="relative z-10 flex items-end gap-4 pb-0">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <h2
                className="text-3xl lg:text-4xl text-white uppercase leading-tight text-center"
                style={{ fontFamily: "'Anton SC', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                Hola Como Estas
              </h2>
              <h2
                className="text-2xl lg:text-3xl text-white uppercase leading-tight text-center"
                style={{ fontFamily: "'Anton SC', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                ¿Que Tal Tu Dia?
              </h2>
            </div>
            <img
              src={robotSaludo}
              alt="Robot saludando"
              className="h-[50vh] max-h-[400px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="w-full md:w-1/2 bg-[#002652] flex flex-col justify-center px-10 md:px-16 lg:px-20 relative">
        {/* Title + Logo */}
        <div className="flex items-center justify-end gap-3 mb-10">
          <span
            className="text-white text-lg"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Iniciar secion en
          </span>
          <span
            className="text-white text-2xl uppercase"
            style={{ fontFamily: "'Anton SC', sans-serif" }}
          >
            TechCup Futbol
          </span>
          <img src={logoTCF} alt="TCF" className="w-14 h-auto" />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5 max-w-md w-full mx-auto">
          {/* Email */}
          <div>
            <label className="block text-white text-sm font-medium mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Email / Usuario
            </label>
            <input
              type="text"
              placeholder="User Name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white/90 text-gray-700 placeholder-gray-400 outline-none text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-white text-sm font-medium mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white/90 text-gray-700 placeholder-gray-400 outline-none text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Ingresar */}
          <button
            className="w-full py-3 bg-[#001a3a] border border-white/30 text-white rounded text-lg hover:bg-[#002652] transition-colors mt-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Ingresar
          </button>

          {/* Links */}
          <div className="flex justify-between mt-2">
            <button
              className="text-white/70 text-sm underline hover:text-white transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              ¿Olvidaste tu contraseña?
            </button>
            <button
              onClick={() => navigate('/seleccionar-rol')}
              className="text-white/70 text-sm underline hover:text-white transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              ¿No tienes cuenta?
            </button>
          </div>
        </div>

        {/* Bottom help link */}
        <div className="absolute bottom-4 right-6">
          <span
            className="text-white/50 text-xs underline"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Necesitas ayuda tienes comentarios?
          </span>
        </div>
      </div>
    </div>
  );
}
