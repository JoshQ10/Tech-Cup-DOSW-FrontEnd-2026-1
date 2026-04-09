import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import robotCabeza from '../assets/robots/robot-cabeza.png';
import robotCurioso from '../assets/robots/robot-curioso.png';
import robotPensativo from '../assets/robots/robot-pensativo.png';
import robotFestejo from '../assets/robots/robot-festejo.png';
import robotCapitan from '../assets/robots/robot-capitan.png';

const roleConfig = {
  Jugador: { bg: '#002652', robot: robotCurioso },
  Capitan: { bg: '#01540D', robot: robotCapitan },
  Administrador: { bg: '#50070C', robot: robotCurioso },
  Arbitro: { bg: '#514F01', robot: robotCurioso },
  Organizador: { bg: '#260053', robot: robotCurioso },
};

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRole = location.state?.role || 'Jugador';
  const config = roleConfig[selectedRole] || roleConfig.Jugador;

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    correo: '',
    tipoUsuario: selectedRole === 'Capitan' ? 'Interno' : '',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [relacion, setRelacion] = useState('');
  const [relacionOpciones, setRelacionOpciones] = useState([]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTipoUsuario = (tipo) => {
    handleChange('tipoUsuario', tipo);
    setShowDropdown(false);
    if (tipo === 'Externo') {
      setShowModal(true);
    }
  };

  const toggleRelacionOpcion = (opcion) => {
    setRelacionOpciones((prev) =>
      prev.includes(opcion)
        ? prev.filter((o) => o !== opcion)
        : [...prev, opcion]
    );
  };

  const handleCrearCuenta = () => {
    setShowConfirmation(true);
  };


  return (
    <div
      className="min-h-screen w-full text-white flex flex-col relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: config.bg }}
    >
      {/* Back arrow */}
      <button
        onClick={() => navigate('/seleccionar-rol')}
        className="absolute top-8 left-8 z-20 text-white hover:text-gray-300 transition-colors"
      >
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Robot upside down — top left */}
      <img
        src={robotCabeza}
        alt="Robot"
        className="absolute top-0 left-24 w-48 lg:w-56 object-contain z-10 pointer-events-none"
      />

      {/* Robot — bottom right */}
      <img
        src={config.robot}
        alt="Robot"
        className="absolute bottom-0 right-0 w-36 lg:w-44 object-contain z-10 pointer-events-none"
      />

      {/* Form container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Title */}
        <div className="w-full max-w-2xl mb-8">
          <h1 className="text-2xl md:text-3xl" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            <span className="font-light">Bienvenido a nuestra familia </span>
            <span style={{ fontFamily: "'Anton SC', sans-serif", fontWeight: 400 }}>TechCup Futbol</span>
          </h1>
        </div>

        <div className="w-full max-w-2xl flex flex-col gap-5">
          {/* Nombre + Apellido */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Nombre</label>
              <input
                type="text"
                placeholder="Escriba su Nombre"
                value={form.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-white/90 text-gray-700 placeholder-gray-400 outline-none text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <div className="w-[35%]">
              <label className="block text-sm font-medium mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Apellidos</label>
              <input
                type="text"
                placeholder="Escriba su Apellido"
                value={form.apellido}
                onChange={(e) => handleChange('apellido', e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-white/90 text-gray-700 placeholder-gray-400 outline-none text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Usuario</label>
            <input
              type="text"
              placeholder="Nombre usuario"
              value={form.usuario}
              onChange={(e) => handleChange('usuario', e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-white/90 text-gray-700 placeholder-gray-400 outline-none text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={(e) => handleChange('contrasena', e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-white/90 text-gray-700 placeholder-gray-400 outline-none text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={form.confirmarContrasena}
              onChange={(e) => handleChange('confirmarContrasena', e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-white/90 text-gray-700 placeholder-gray-400 outline-none text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Correo</label>
            <input
              type="email"
              placeholder="Correo"
              value={form.correo}
              onChange={(e) => handleChange('correo', e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-white/90 text-gray-700 placeholder-gray-400 outline-none text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Tipo de usuario - solo si NO es Capitán */}
          {selectedRole !== 'Capitan' && (
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Tipo de usuario</span>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 border border-white/30 rounded px-6 py-2.5 text-white min-w-[220px] justify-between"
                  style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: `${config.bg}CC` }}
                >
                  <span className="italic">{form.tipoUsuario || 'Seleccione Uno'}</span>
                  <svg className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute top-full left-0 w-full border border-white/30 rounded mt-1 z-30 overflow-hidden" style={{ backgroundColor: config.bg }}>
                    <button
                      onClick={() => handleTipoUsuario('Interno')}
                      className="w-full text-left px-6 py-2.5 hover:bg-white/10 transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Interno
                    </button>
                    <button
                      onClick={() => handleTipoUsuario('Externo')}
                      className="w-full text-left px-6 py-2.5 hover:bg-white/10 transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Externo
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Configurar Perfil Deportivo */}
          <div className="mt-4">
            <button
              onClick={() => navigate('/perfil-deportivo')}
              className="border-2 border-white px-8 py-3 rounded text-white hover:bg-white/10 transition-colors text-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Configurar Perfil Deportivo
            </button>
          </div>
        </div>
      </div>

      {/* Modal — Relación con la Escuela */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-200 rounded-lg p-8 max-w-lg w-full mx-4 relative flex gap-6">
            <img
              src={robotPensativo}
              alt="Robot pensativo"
              className="w-32 h-auto object-contain flex-shrink-0 self-center"
            />
            <div className="flex-1 flex flex-col">
              <h2
                className="text-xl font-bold text-[#002652] mb-4"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                ¿Que relacion tienes con la escuela?
              </h2>
              <div className="flex flex-col gap-3 mb-4">
                {['Familiar', 'Invitado'].map((opcion) => {
                  const isChecked = relacionOpciones.includes(opcion);
                  return (
                    <label
                      key={opcion}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => toggleRelacionOpcion(opcion)}
                    >
                      <div className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm
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
                placeholder="Escriba aqui la relacion que tiene"
                value={relacion}
                onChange={(e) => setRelacion(e.target.value)}
                className="w-full px-4 py-3 rounded border border-gray-300 text-gray-600 placeholder-gray-400 outline-none resize-none text-sm mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
                rows={3}
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-[#002652] text-white px-8 py-2.5 rounded font-medium hover:bg-[#001a3a] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal — Confirmación de cuenta */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-200 rounded-lg p-8 max-w-md w-full mx-4 relative flex flex-col items-center text-center">
            <img
              src={robotFestejo}
              alt="Robot festejo"
              className="w-40 h-auto object-contain mb-4"
            />
            <h2
              className="text-3xl text-[#002652] uppercase leading-tight mb-1"
              style={{ fontFamily: "'Anton SC', sans-serif" }}
            >
              Felicidades
            </h2>
            <h2
              className="text-2xl text-[#002652] uppercase leading-tight mb-1"
              style={{ fontFamily: "'Anton SC', sans-serif" }}
            >
              Has creado tu cuenta
            </h2>
            <h2
              className="text-xl uppercase leading-tight mb-6"
              style={{ fontFamily: "'Anton SC', sans-serif", color: config.bg }}
            >
              Revisa tu bandeja de entrada
            </h2>
            <button
              onClick={() => { setShowConfirmation(false); navigate('/iniciar-sesion'); }}
              className="text-white px-10 py-2.5 rounded font-medium hover:opacity-90 transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: config.bg }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
