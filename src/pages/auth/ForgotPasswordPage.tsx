import { useState } from 'react';
import { authService } from '../../services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('No deje este campo Vacio');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.forgotPassword(email.trim());
      setMessage(response.message || 'Revisa tu correo para continuar.');
    } catch {
      setError('No se pudo enviar el correo de recuperacion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#000F20' }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded-xl" style={{ background: '#001a3a' }}>
        <h1 className="text-3xl text-white uppercase mb-4" style={{ fontFamily: "'Anton SC', sans-serif" }}>
          Recuperar contrasena
        </h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
          className="w-full px-4 py-3 rounded outline-none"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {message && <p className="text-green-400 text-sm mt-2">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-3 rounded text-white"
          style={{ background: '#16A34A', fontFamily: "'Poppins', sans-serif" }}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

