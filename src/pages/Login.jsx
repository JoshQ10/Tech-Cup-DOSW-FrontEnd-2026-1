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
import { loginUser } from '../services/api';

const campusImages = [campus1, campus2, campus3, campus4, campus5];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpText, setHelpText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % campusImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleIngresar = async () => {
    const eErr = email.trim() === '';
    const pErr = password.trim() === '';
    setEmailError(eErr);
    setPasswordError(pErr);
    setLoginError('');

    if (eErr || pErr) return;

    try {
      setLoading(true);
      await loginUser(email, password);
      navigate('/seleccionar-rol');
    } catch (error) {
      setEmailError(true);
      setPasswordError(true);
      setLoginError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
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
            <img src={robotModal} alt="Robot" className="h-40 w-auto object-contain flex-shrink-0" />
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

      {/* ── MODAL ayuda/comentarios ── */}
      {showHelpModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
        >
          <div className="bg-[#e8e8e8] rounded-xl flex items-center gap-6 px-10 py-10 max-w-xl w-full mx-6">
            <img src={robotModal} alt="Robot" className="h-40 w-auto object-contain flex-shrink-0" />
            <div className="flex flex-col gap-6 w-full">
              <p
                className="text-[#002652] text-xl uppercase font-bold leading-snug"
                style={{ fontFamily: "'Anton SC', sans-serif" }}
              >
                Apreciamos tus comentarios
              </p>
              <textarea
                value={helpText}
                onChange={(e) => setHelpText(e.target.value)}
                placeholder="Escribe tu comentario aquí..."
                rows={4}
                className="w-full px-4 py-3 rounded text-sm text-gray-700 placeholder-gray-400 outline-none resize-none"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  border: '2px solid transparent',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '6px',
                }}
                onFocus={(e) => e.target.style.border = '2px solid #4400FF'}
                onBlur={(e) => e.target.style.border = '2px solid transparent'}
              />
              <div className="flex gap-4">
                <button
                  onClick={() => { setHelpText(''); setShowHelpModal(false); }}
                  className="px-6 py-3 bg-[#002652] text-white rounded text-base hover:bg-[#001a3a] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Enviar
                </button>
                <button
                  onClick={() => { setHelpText(''); setShowHelpModal(false); }}
                  className="px-6 py-3 bg-[#001a3a] text-white rounded text-base hover:bg-[#002652] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Salir
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
        <div className="relative z-10 flex items-end gap-6 px-10 pb-0 w-full">
          <div className="flex-shrink-0 overflow-hidden" style={{ height: '55vh' }}>
            <img
              src={robotSaludo}
              alt="Robot saludando"
              className="w-auto object-contain object-top drop-shadow-2xl"
              style={{ height: '90vh', marginTop: '-10vh' }}
            />
          </div>
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
              className={`block text-sm font-medium mb-2 ${emailError ? 'text-[#FF0000]' : 'text-white'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Email / Usuario
            </label>
            <input
              type="text"
              placeholder="User Name"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
                setLoginError('');
                e.target.classList.remove('placeholder-error');
              }}
              className={`w-full px-4 py-4 outline-none text-sm ${emailError ? 'placeholder-error' : ''}`}
              style={{
                fontFamily: "'Inter', sans-serif",
                borderRadius: '6px',
                border: emailError ? '2px solid #FF0000' : '2px solid transparent',
                background: 'rgba(255,255,255,0.9)',
                color: emailError ? '#FF0000' : '#374151',
              }}
              onFocus={(e) => {
                if (!emailError) {
                  e.target.style.border = '2px solid #4400FF';
                  e.target.classList.add('placeholder-focused');
                }
              }}
              onBlur={(e) => {
                if (!emailError) {
                  e.target.style.border = '2px solid transparent';
                  e.target.classList.remove('placeholder-focused');
                }
              }}
            />
            {emailError && (
              <span className="text-[#FF0000] text-xs mt-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                {loginError || 'Campo requerido'}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${passwordError ? 'text-[#FF0000]' : 'text-white'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
                setLoginError('');
                e.target.classList.remove('placeholder-error');
              }}
              className={`w-full px-4 py-4 outline-none text-sm ${passwordError ? 'placeholder-error' : ''}`}
              style={{
                fontFamily: "'Inter', sans-serif",
                borderRadius: '6px',
                border: passwordError ? '2px solid #FF0000' : '2px solid transparent',
                background: 'rgba(255,255,255,0.9)',
                color: passwordError ? '#FF0000' : '#374151',
              }}
              onFocus={(e) => {
                if (!passwordError) {
                  e.target.style.border = '2px solid #4400FF';
                  e.target.classList.add('placeholder-focused');
                }
              }}
              onBlur={(e) => {
                if (!passwordError) {
                  e.target.style.border = '2px solid transparent';
                  e.target.classList.remove('placeholder-focused');
                }
              }}
            />
            {passwordError && (
              <span className="text-[#FF0000] text-xs mt-1 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                {loginError || 'Campo requerido'}
              </span>
            )}
          </div>

          {/* Ingresar */}
          <button
            onClick={handleIngresar}
            disabled={loading}
            className="w-full py-4 bg-[#001a3a] border border-white/30 text-white rounded text-lg hover:bg-[#003580] transition-colors mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
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

        {/* Bottom help link — solo este, sin duplicado */}
        <div className="absolute bottom-4 right-6">
          <span
            onClick={() => setShowHelpModal(true)}
            className="text-white/50 text-xs underline cursor-pointer hover:text-white/80 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Necesitas ayuda tienes comentarios?
          </span>
        </div>

      </div>
    </div>
  );
}