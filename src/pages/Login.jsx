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
import { useAuth } from '../hooks/useAuth';
import robotModal2 from '../assets/robots/curioso rb 2.png';

const campusImages = [campus1, campus2, campus3, campus4, campus5];

// ── Iconos SVG inline (sin dependencias extra) ──────────────────────────────
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);
// ────────────────────────────────────────────────────────────────────────────

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
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
            await login({
                emailOrUsername: email.trim(),
                password,
            });
        } catch (error) {
            setEmailError(true);
            setPasswordError(true);
            setLoginError('Usuario o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    // ── OAuth2: redirige al backend que inicia el flujo con Google ──
    const handleGoogleLogin = () => {
        window.location.href = '/oauth2/authorization/google';
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">

            {/* ── MODAL olvide contraseña ── */}
            {showModal && (
                <div
                    className="absolute inset-0 z-50 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.45)' }}
                >
                    <div className="bg-[#e8e8e8] rounded-xl flex items-center gap-8 px-12 py-14 max-w-2xl w-full mx-6 min-h-[280px] relative overflow-visible">
                        <img
                            src={robotModal2}
                            alt="Robot"
                            className="w-auto object-contain"
                            style={{
                                position: 'absolute',
                                left: '-30px',
                                bottom: '-22px',
                                height: '420px',
                            }}
                        />
                        <div style={{ minWidth: '180px' }} />
                        <div className="flex flex-col gap-12">
                            <p
                                className="text-[#002652] text-xl uppercase font-bold leading-snug"
                                style={{ fontFamily: "'Anton SC', sans-serif" }}
                            >
                                Olvidaste tu contraseña no te preocupes te enviaremos un correo
                            </p>
                            <div className="flex gap-20">
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
                    <div className="bg-[#e8e8e8] rounded-xl flex items-center gap-8 px-12 py-14 max-w-2xl w-full mx-6 min-h-[280px] relative overflow-visible">
                        <img
                            src={robotModal2}
                            alt="Robot"
                            className="w-auto object-contain"
                            style={{
                                position: 'absolute',
                                left: '-30px',
                                bottom: '-22px',
                                height: '420px',
                            }}
                        />
                        <div style={{ minWidth: '180px' }} />
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
                            ¿Que Tal Tu Dia hoy?
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

                    {/* ── Separador O ── */}
                    <div className="flex items-center gap-4 my-1">
                        <div className="flex-1 h-px bg-white/20" />
                        <span
                            className="text-white/50 text-xs"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
              O ingresa con
            </span>
                        <div className="flex-1 h-px bg-white/20" />
                    </div>

                    {/* ── Botones OAuth2 ── */}
                    <div className="flex gap-3">
                        {/* Google */}
                        <button
                            onClick={handleGoogleLogin}
                            className="flex-1 flex items-center justify-center gap-3 py-3 rounded transition-colors"
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                background: 'rgba(255,255,255,0.95)',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: 500,
                                border: '2px solid transparent',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.border = '2px solid #4285F4'}
                            onMouseLeave={(e) => e.currentTarget.style.border = '2px solid transparent'}
                        >
                            <GoogleIcon />
                            Google
                        </button>
                    </div>

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
