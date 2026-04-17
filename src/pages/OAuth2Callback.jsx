import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getParamFromSearchOrHash = (key, searchParams, hashParams) => {
  return searchParams.get(key) || hashParams.get(key) || '';
};

const saveSession = async (token, refreshToken) => {
  localStorage.setItem('token', token);
  localStorage.setItem('techcup_token', token);

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('techcup_refresh_token', refreshToken);
  }

  try {
    const response = await fetch('/api/profile', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const profile = await response.json();
      localStorage.setItem('techcup_user', JSON.stringify(profile));
    }
  } catch {
    // Sin perfil no se bloquea la sesión, solo se omite cache de usuario.
  }
};

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Procesando inicio de sesion con Google...');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashText = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hashText);

    const token =
      getParamFromSearchOrHash('token', searchParams, hashParams) ||
      getParamFromSearchOrHash('accessToken', searchParams, hashParams) ||
      getParamFromSearchOrHash('access_token', searchParams, hashParams);

    const refreshToken =
      getParamFromSearchOrHash('refreshToken', searchParams, hashParams) ||
      getParamFromSearchOrHash('refresh_token', searchParams, hashParams);

    const errorMessage =
      getParamFromSearchOrHash('error', searchParams, hashParams) ||
      getParamFromSearchOrHash('message', searchParams, hashParams);

    let timeoutId;

    const run = async () => {
      if (errorMessage) {
        setStatus('error');
        setMessage('No fue posible completar el ingreso con Google. Intenta de nuevo.');
        timeoutId = setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1800);
        return;
      }

      if (!token) {
        setStatus('error');
        setMessage('No se recibio un token de autenticacion. Intenta nuevamente.');
        timeoutId = setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1800);
        return;
      }

      await saveSession(token, refreshToken);

      setStatus('success');
      setMessage('Ingreso exitoso. Redirigiendo al dashboard...');
      timeoutId = setTimeout(() => {
        window.location.replace('/dashboard');
      }, 800);
    };

    void run();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#002652] px-6">
      <div className="w-full max-w-md rounded-xl bg-white/95 p-8 text-center shadow-xl">
        <h1
          className="text-2xl uppercase"
          style={{ fontFamily: "'Anton SC', sans-serif", color: '#002652' }}
        >
          OAuth2 Callback
        </h1>
        <p
          className={`mt-4 text-sm ${status === 'error' ? 'text-red-600' : 'text-gray-700'}`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
