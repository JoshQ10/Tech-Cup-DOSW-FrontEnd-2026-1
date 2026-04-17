import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando correo...');

  useEffect(() => {
    const token = params.get('token') || '';

    const run = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token no valido.');
        return;
      }
      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Correo verificado correctamente.');
      } catch {
        setStatus('error');
        setMessage('No fue posible verificar el correo.');
      }
    };

    void run();
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#000F20' }}>
      <div className="px-8 py-10 rounded-xl" style={{ background: '#001a3a' }}>
        <h1 className="text-3xl text-white uppercase" style={{ fontFamily: "'Anton SC', sans-serif" }}>
          Verificacion de correo
        </h1>
        <p className={`mt-3 ${status === 'error' ? 'text-red-400' : 'text-white'}`}>{message}</p>
      </div>
    </div>
  );
}

