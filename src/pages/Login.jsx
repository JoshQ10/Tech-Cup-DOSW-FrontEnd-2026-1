import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoTCFConLetras from '../assets/logos/LOGO FUTBOLL F Letras blancas.png';
import robotSaludo from '../assets/robots/robot saludando.gif';
import robotModal from '../assets/robots/robot-jugador.png';
import campus1 from '../assets/campus/campus-1.jpg';
import campus2 from '../assets/campus/campus-2.jpg';
import campus3 from '../assets/campus/campus-3.jpg';
import campus4 from '../assets/campus/campus-4.png';
import campus5 from '../assets/campus/campus-5.jpg';

const campusImages = [campus1, campus2, campus3, campus4, campus5];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % campusImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleIngresar = () => {
    const eErr = email.trim() === '';
    const pErr = password.trim() === '';
    setEmailError(eErr);
    setPasswordError(pErr);
    if (!eErr && !pErr) {
      // lógica de login aquí
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* ── MODAL olvide contraseña ── */}
      {showModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          <div className="bg-[#e8e8e8] rounded-xl flex items-center gap-6 px-10 py-10 max-w-xl w-full mx-6">
            <img
              src={robotModal}
              alt="Robot"
              className="h-40 w-auto object-contain flex-shrink-0"
            />
            <div className="flex flex-col gap-8">
              <p
                className="text-[#002652] text-xl uppercase font-bold leading-snug"
                style={{ fontFamily: "'Anton SC', sans-serif" }}
              >
                Olvidaste tu contraseña no te preocupes te enviaremos un correo
              </p>
              <div className="flex gap-4">
                <button
                  className="px-6 py-3 bg-[#002652] text-white rounded text-base hover:bg-[#001a3a] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Enviar Correo
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-[#001a3a] text-white rounded text-base hover:bg-[#002652] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LEFT — Campus + Robot ── */}
      <div className="hidden md:flex w-1/2 relative items-end justify-start overflow-hidden">
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

        {/* Robot + texto */}
        <div className="relative z-10 flex items-end gap-6 px-10 pb-0 w-full">
          {/* Robot cintura arriba */}
          <div className="flex-shrink-0 overflow-hidden" style={{ height: '55vh' }}>
            <img
              src={robotSaludo}
              alt="Robot saludando"
              className="w-auto object-contain object-top drop-shadow-2xl"
              style={{ height: '90vh', marginTop: '-10vh' }}
            />
          </div>
          {/* Texto a la altura de la cabeza */}
          <div className="flex flex-col mb-[30vh]">
            <h2
              className="text-3xl lg:text-5xl text-white uppercase leading-tight"
              style={{ fontFamily: "'Anton SC', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              Hola Como Estas
            </h2>
            <h2
              className="text-2xl lg:text-4xl text-white uppercase leading-tight"
              style={{ fontFamily: "'Anton SC', sans-serif", textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              ¿Que Tal Tu Dia?
            </h2>
          </div>
        </div>
      </div>

      {/* ── RIGHT — Login form ── */}
      <div className="w-full md:w-1/2 bg-[#002652] flex flex-col justify-center px-10 md:px-14 relative">

        {/* Title + Logo */}
        <div className="flex items-center justify-start gap-3 mb-10">
          <span
            className="text-white text-xl"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Iniciar secion en
          </span>
          <span
            className="text-white text-3xl uppercase"
            style={{ fontFamily: "'Anton SC', sans-serif" }}
          >
            TechCup Futbol
          </span>
          <img src={logoTCFConLetras} alt="TCF" className="h-20 w-auto" />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-6 w-full">

          {/* Email */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${emailError ? 'text-red-400' : 'text-white'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Email / Usuario
            </label>
            <input
              type="text"
              placeholder="User Name"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
              className="w-full px-4 py-4 text-gray-700 placeholder-gray-400 outline-none text-sm"
              style={{
                fontFamily: "'Inter', sans-serif",
                borderRadius: '6px',
                border: emailError ? '2px solid #f87171' : '2px solid transparent',
                background: 'rgba(255,255,255,0.9)',
              }}
            />
            {emailError && (
              <span className="text-red-400 text-xs mt-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                Error
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${passwordError ? 'text-red-400' : 'text-white'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
              className="w-full px-4 py-4 text-gray-700 placeholder-gray-400 outline-none text-sm"
              style={{
                fontFamily: "'Inter', sans-serif",
                borderRadius: '6px',
                border: passwordError ? '2px solid #f87171' : '2px solid transparent',
                background: 'rgba(255,255,255,0.9)',
              }}
            />
            {passwordError && (
              <span className="text-red-400 text-xs mt-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                Error
              </span>
            )}
          </div>

          {/* Ingresar */}
          <button
            onClick={handleIngresar}
            className="w-full py-4 bg-[#001a3a] border border-white/30 text-white rounded text-lg hover:bg-[#003580] transition-colors mt-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Ingresar
          </button>

          {/* Links */}
          <div className="flex justify-between">
            <button
              onClick={() => setShowModal(true)}
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
