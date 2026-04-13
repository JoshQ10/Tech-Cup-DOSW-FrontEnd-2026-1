import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import robotCabeza from '../assets/robots/robot-cabeza.png';
import robotCurioso from '../assets/robots/robot-curioso.png';
import robotPensativo from '../assets/robots/robot-pensativo.png';
import robotFestejo from '../assets/robots/robot-festejo.png';
import robotCapitan from '../assets/robots/robot capitan.png';
import robotAdmin from '../assets/robots/robot admin.png';
import robotArbitro from '../assets/robots/robot arbitro.png';
import robotOrganizador from '../assets/robots/robot organizador.png';
import { validarCedula } from '../services/api';

const roleConfig = {
  Jugador:       { bg: '#002652', robotTop: robotCabeza,     robotBottom: robotCurioso    },
  Capitan:       { bg: '#01540D', robotTop: robotCabeza,     robotBottom: robotCapitan    },
  Administrador: { bg: '#50070C', robotTop: robotCabeza,     robotBottom: robotAdmin      },
  Arbitro:       { bg: '#514F01', robotTop: robotCabeza,     robotBottom: robotArbitro    },
  Organizador:   { bg: '#260053', robotTop: robotCabeza,     robotBottom: robotOrganizador },
};

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRole = location.state?.role || 'Jugador';
  const config = roleConfig[selectedRole] || roleConfig.Jugador;

  const esCedulaRol = selectedRole === 'Organizador' || selectedRole === 'Arbitro' || selectedRole === 'Administrador';

  const [form, setForm] = useState({
    nombre: '', apellido: '', usuario: '', correo: '',
    contrasena: '', confirmarContrasena: '',
    tipoUsuario: selectedRole === 'Capitan' ? 'Interno' : '',
  });
  const [errors, setErrors] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [relacion, setRelacion] = useState('');
  const [relacionOpcion, setRelacionOpcion] = useState('');
  const [modalError, setModalError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleTipoUsuario = (tipo) => {
    handleChange('tipoUsuario', tipo);
    setShowDropdown(false);
    if (tipo === 'Externo') setShowModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre.trim())              newErrors.nombre = 'Campo requerido';
    if (!form.apellido.trim())            newErrors.apellido = 'Campo requerido';
    if (!form.usuario.trim())             newErrors.usuario = 'Campo requerido';
    if (!form.correo.trim())              newErrors.correo = 'Campo requerido';
    if (!form.contrasena.trim())          newErrors.contrasena = 'Campo requerido';
    if (!form.confirmarContrasena.trim()) newErrors.confirmarContrasena = 'Campo requerido';
    if (form.contrasena && form.confirmarContrasena && form.contrasena !== form.confirmarContrasena)
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    if (selectedRole !== 'Capitan' && !form.tipoUsuario)
      newErrors.tipoUsuario = 'Selecciona un tipo de usuario';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verificarCedula = async () => {
    if (!esCedulaRol) return true;
    try {
      await validarCedula(form.correo);
      return true;
    } catch {
      setErrors(prev => ({ ...prev, correo: 'Cédula en base de datos no encontrada' }));
      return false;
    }
  };

  const handleConfigurarPerfil = async () => {
    if (!validateForm()) return;
    if (!await verificarCedula()) return;
    navigate('/perfil-deportivo');
  };

  const handleCrearCuenta = async () => {
    if (!validateForm()) return;
    if (!await verificarCedula()) return;
    setShowConfirmation(true);
  };

  const handleEnviarModal = () => {
    if (!relacionOpcion) { setModalError('Debes seleccionar una opción'); return; }
    if (!relacion.trim()) { setModalError('Debes escribir tu relación con la escuela'); return; }
    setModalError('');
    setShowModal(false);
  };

  const inputStyle = (field) => ({
    fontFamily: "'Inter', sans-serif",
    borderRadius: '8px',
    border: errors[field] ? '2px solid #FF0000' : '2px solid transparent',
    background: errors[field] ? '#fff0f0' : 'rgba(255,255,255,0.92)',
    color: errors[field] ? '#FF0000' : '#374151',
  });

  const inputClass = "w-full px-4 py-3 outline-none text-sm";

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative">

      {/* ── FRANJA IZQUIERDA blanca con robot arriba ── */}
      <div className="hidden md:flex w-48 lg:w-56 flex-shrink-0 flex-col items-center justify-start pt-0 relative"
        style={{ background: 'white' }}>
        <img src={config.robotTop} alt="Robot"
          className="w-full object-contain"
          style={{ marginTop: '-10px' }} />
      </div>

      {/* ── CENTRO — color del rol ── */}
      <div className="flex-1 flex flex-col relative overflow-hidden"
        style={{ backgroundColor: config.bg }}>

        {/* Flecha atrás */}
        <button
          onClick={() => navigate('/seleccionar-rol')}
          className="absolute top-8 left-6 z-20 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Formulario */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          <div className="w-full max-w-2xl mb-8">
            <h1 className="text-2xl md:text-3xl" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              <span className="text-white font-light">Bienvenido a nuestra familia </span>
              <span className="text-white" style={{ fontFamily: "'Anton SC', sans-serif" }}>TechCup Futbol</span>
            </h1>
          </div>

          <div className="w-full max-w-2xl flex flex-col gap-4">

            {/* Nombre + Apellido */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-1 ${errors.nombre ? 'text-red-400' : 'text-white'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}>Nombre</label>
                <input type="text" placeholder="Escriba su Nombre"
                  value={form.nombre} onChange={e => handleChange('nombre', e.target.value)}
                  className={inputClass} style={inputStyle('nombre')}
                  onFocus={e => { if (!errors.nombre) e.target.style.border = '2px solid #4400FF'; }}
                  onBlur={e => { if (!errors.nombre) e.target.style.border = '2px solid transparent'; }}
                />
                {errors.nombre && <span className="text-red-400 text-xs mt-1 block">{errors.nombre}</span>}
              </div>
              <div className="w-[45%]">
                <label className={`block text-sm font-medium mb-1 ${errors.apellido ? 'text-red-400' : 'text-white'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}>Apellidos</label>
                <input type="text" placeholder="Escriba su Apellido"
                  value={form.apellido} onChange={e => handleChange('apellido', e.target.value)}
                  className={inputClass} style={inputStyle('apellido')}
                  onFocus={e => { if (!errors.apellido) e.target.style.border = '2px solid #4400FF'; }}
                  onBlur={e => { if (!errors.apellido) e.target.style.border = '2px solid transparent'; }}
                />
                {errors.apellido && <span className="text-red-400 text-xs mt-1 block">{errors.apellido}</span>}
              </div>
            </div>

            {/* Usuario */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${errors.usuario ? 'text-red-400' : 'text-white'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}>Usuario</label>
              <input type="text" placeholder="Nombre usuario"
                value={form.usuario} onChange={e => handleChange('usuario', e.target.value)}
                className={inputClass} style={inputStyle('usuario')}
                onFocus={e => { if (!errors.usuario) e.target.style.border = '2px solid #4400FF'; }}
                onBlur={e => { if (!errors.usuario) e.target.style.border = '2px solid transparent'; }}
              />
              {errors.usuario && <span className="text-red-400 text-xs mt-1 block">{errors.usuario}</span>}
            </div>

            {/* Correo o Cédula */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${errors.correo ? 'text-red-400' : 'text-white'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {esCedulaRol ? 'Número de Cédula' : 'Correo'}
              </label>
              <input
                type={esCedulaRol ? 'text' : 'email'}
                placeholder={esCedulaRol ? 'Número de Cédula' : 'Correo'}
                value={form.correo} onChange={e => handleChange('correo', e.target.value)}
                className={inputClass} style={inputStyle('correo')}
                onFocus={e => { if (!errors.correo) e.target.style.border = '2px solid #4400FF'; }}
                onBlur={e => { if (!errors.correo) e.target.style.border = '2px solid transparent'; }}
              />
              {errors.correo && <span className="text-red-400 text-xs mt-1 block">{errors.correo}</span>}
            </div>

            {/* Contraseña */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${errors.contrasena ? 'text-red-400' : 'text-white'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}>Contraseña</label>
              <input type="password" placeholder="Contraseña"
                value={form.contrasena} onChange={e => handleChange('contrasena', e.target.value)}
                className={inputClass} style={inputStyle('contrasena')}
                onFocus={e => { if (!errors.contrasena) e.target.style.border = '2px solid #4400FF'; }}
                onBlur={e => { if (!errors.contrasena) e.target.style.border = '2px solid transparent'; }}
              />
              {errors.contrasena && <span className="text-red-400 text-xs mt-1 block">{errors.contrasena}</span>}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${errors.confirmarContrasena ? 'text-red-400' : 'text-white'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}>Confirmar Contraseña</label>
              <input type="password" placeholder="Confirmar Contraseña"
                value={form.confirmarContrasena} onChange={e => handleChange('confirmarContrasena', e.target.value)}
                className={inputClass} style={inputStyle('confirmarContrasena')}
                onFocus={e => { if (!errors.confirmarContrasena) e.target.style.border = '2px solid #4400FF'; }}
                onBlur={e => { if (!errors.confirmarContrasena) e.target.style.border = '2px solid transparent'; }}
              />
              {errors.confirmarContrasena && <span className="text-red-400 text-xs mt-1 block">{errors.confirmarContrasena}</span>}
            </div>

            {/* Tipo de usuario */}
            {selectedRole !== 'Capitan' && (
              <div className="flex items-center gap-4 mt-1">
                <span className={`text-sm font-medium whitespace-nowrap ${errors.tipoUsuario ? 'text-red-400' : 'text-white'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  Tipo de usuario
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 rounded px-6 py-2.5 text-white min-w-[220px] justify-between"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      background: `${config.bg}CC`,
                      border: errors.tipoUsuario ? '2px solid #FF0000' : '1px solid rgba(255,255,255,0.5)',
                    }}
                  >
                    <span className="italic">{form.tipoUsuario || 'Seleccione Uno'}</span>
                    <svg className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showDropdown && (
                    <div className="absolute top-full left-0 w-full border border-white/30 rounded mt-1 z-30 overflow-hidden"
                      style={{ background: config.bg }}>
                      {['Interno', 'Externo'].map(tipo => (
                        <button key={tipo} onClick={() => handleTipoUsuario(tipo)}
                          className="w-full text-left px-6 py-2.5 text-white hover:bg-white/10 transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {tipo}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.tipoUsuario && <span className="text-red-400 text-xs">{errors.tipoUsuario}</span>}
              </div>
            )}

            {/* Botón */}
            <div className="mt-4">
              {selectedRole === 'Jugador' || selectedRole === 'Capitan' ? (
                <button
                  onClick={handleConfigurarPerfil}
                  className="border-2 border-white px-8 py-3 rounded text-white hover:bg-white/10 transition-colors text-base"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Configurar Perfil Deportivo
                </button>
              ) : (
                <button
                  onClick={handleCrearCuenta}
                  className="border-2 border-white px-8 py-3 rounded text-white hover:bg-white/10 transition-colors text-base"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Crear Cuenta
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── FRANJA DERECHA blanca con robot abajo ── */}
      <div className="hidden md:flex w-48 lg:w-56 flex-shrink-0 flex-col items-center justify-end pb-0 relative"
        style={{ background: 'white' }}>
        <img src={config.robotBottom} alt="Robot"
          className="w-full object-contain" />
      </div>

      {/* ── MODAL — Relación con la Escuela ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-[#e8e8e8] rounded-xl flex items-center gap-8 px-12 py-14 max-w-2xl w-full mx-6 min-h-[280px] relative overflow-visible">
            <img src={robotPensativo} alt="Robot" className="w-auto object-contain"
              style={{ position: 'absolute', left: '-30px', bottom: '-22px', height: '380px' }} />
            <div style={{ minWidth: '160px' }} />
            <div className="flex flex-col gap-6 w-full">
              <p className="text-[#002652] text-xl uppercase font-bold leading-snug"
                style={{ fontFamily: "'Anton SC', sans-serif" }}>
                ¿Qué relación tienes con la escuela?
              </p>
              <div className="flex flex-col gap-3">
                {['Familiar', 'Invitado'].map(opcion => {
                  const isChecked = relacionOpcion === opcion;
                  return (
                    <label key={opcion} className="flex items-center gap-3 cursor-pointer"
                      onClick={() => { setRelacionOpcion(opcion); setModalError(''); }}>
                      <div className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm transition-colors
                        ${isChecked ? 'border-[#002652] bg-[#002652]/20' : 'border-gray-500'}`}>
                        {isChecked && (
                          <svg className="w-3.5 h-3.5 text-[#002652]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[#002652] font-semibold" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {opcion}
                      </span>
                    </label>
                  );
                })}
              </div>
              <textarea
                placeholder="Escribe aquí la relación que tienes..."
                value={relacion} onChange={e => { setRelacion(e.target.value); setModalError(''); }}
                rows={3}
                className="w-full px-4 py-3 rounded text-sm text-gray-700 placeholder-gray-400 outline-none resize-none"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  border: modalError && !relacion.trim() ? '2px solid #FF0000' : '2px solid transparent',
                  background: 'rgba(255,255,255,0.9)', borderRadius: '6px',
                }}
                onFocus={e => e.target.style.border = '2px solid #4400FF'}
                onBlur={e => {
                  if (modalError && !relacion.trim()) e.target.style.border = '2px solid #FF0000';
                  else e.target.style.border = '2px solid transparent';
                }}
              />
              {modalError && (
                <span className="text-red-500 text-xs -mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {modalError}
                </span>
              )}
              <div className="flex gap-4">
                <button onClick={handleEnviarModal}
                  className="px-6 py-3 bg-[#002652] text-white rounded text-base hover:bg-[#001a3a] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Enviar
                </button>
                <button onClick={() => { setShowModal(false); handleChange('tipoUsuario', ''); }}
                  className="px-6 py-3 bg-[#001a3a] text-white rounded text-base hover:bg-[#002652] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL — Confirmación ── */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-[#e8e8e8] rounded-xl p-8 max-w-md w-full mx-4 flex flex-col items-center text-center">
            <img src={robotFestejo} alt="Robot festejo" className="w-40 h-auto object-contain mb-4" />
            <h2 className="text-3xl text-[#002652] uppercase leading-tight mb-1"
              style={{ fontFamily: "'Anton SC', sans-serif" }}>Felicidades</h2>
            <h2 className="text-2xl text-[#002652] uppercase leading-tight mb-1"
              style={{ fontFamily: "'Anton SC', sans-serif" }}>Has creado tu cuenta</h2>
            <h2 className="text-xl uppercase leading-tight mb-6"
              style={{ fontFamily: "'Anton SC', sans-serif", color: config.bg }}>
              Revisa tu bandeja de entrada
            </h2>
            <button
              onClick={() => { setShowConfirmation(false); navigate('/iniciar-sesion'); }}
              className="text-white px-10 py-2.5 rounded font-medium hover:opacity-90 transition-colors"
              style={{ background: config.bg, fontFamily: "'Poppins', sans-serif" }}>
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}