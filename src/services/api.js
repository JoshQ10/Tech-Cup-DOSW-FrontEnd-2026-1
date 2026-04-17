// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// ── LOGIN ──
export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Credenciales incorrectas');
  const data = await response.json();
  const token = data.token || data.accessToken;
  const refreshToken = data.refreshToken || data.refresh_token;

  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('techcup_token', token);
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('techcup_refresh_token', refreshToken);
  }

  if (data.user) {
    localStorage.setItem('techcup_user', JSON.stringify(data.user));
  }

  return data;
};

// ── REGISTRO ──
export const registerUser = async (formData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error('Error al registrarse');
  return await response.json();
};

// ── RECUPERAR CONTRASEÑA ──
export const resendVerification = async (email) => {
  const response = await fetch(`${BASE_URL}/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error('Error al enviar correo');
  return await response.text();
};

// ── VALIDAR CÉDULA ──
export const validarCedula = async (cedula) => {
  const response = await authFetch(`/players/search?cedula=${cedula}`);
  if (!response.ok) throw new Error('Cédula no encontrada');
  return await response.json();
};

// ── LLAVES / BRACKETS ──
export const getBrackets = async () => {
  const response = await authFetch('/brackets');
  if (!response.ok) throw new Error('Error al cargar las llaves');
  return await response.json();
};

// ── HELPER — obtener token guardado ──
export const getToken = () => localStorage.getItem('token');

// ── HELPER — peticiones autenticadas ──
export const authFetch = async (url, options = {}) => {
  const token = getToken();
  return fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// ── REGLAMENTO ──
const REGLAMENTO_GET_ENDPOINTS = [
  '/regulation/current',
  '/regulations/current',
  '/rules/current',
  '/tournament/regulation/current',
  '/reglamento/current',
  '/reglamento',
];

const REGLAMENTO_PDF_ENDPOINTS = [
  '/regulation/current/pdf',
  '/regulations/current/pdf',
  '/rules/current/pdf',
  '/tournament/regulation/current/pdf',
  '/reglamento/current/pdf',
  '/reglamento/pdf',
];

const REGLAMENTO_CONFIRM_ENDPOINTS = [
  '/regulation/current/read',
  '/regulations/current/read',
  '/rules/current/read',
  '/tournament/regulation/current/read',
  '/reglamento/current/read',
  '/reglamento/read',
];

const normalizeReglamentoResponse = (payload) => {
  if (!payload) {
    return { title: 'Reglamento oficial del torneo', content: '', pdfUrl: '' };
  }

  const title =
    payload.title ||
    payload.name ||
    payload.nombre ||
    payload.regulationTitle ||
    payload.reglamentoTitulo ||
    'Reglamento oficial del torneo';

  const content =
    payload.content ||
    payload.text ||
    payload.description ||
    payload.regulationText ||
    payload.reglamentoTexto ||
    payload.body ||
    '';

  const pdfUrl =
    payload.pdfUrl ||
    payload.pdfURL ||
    payload.documentUrl ||
    payload.urlPdf ||
    payload.url ||
    '';

  return { title, content, pdfUrl };
};

export const getReglamento = async () => {
  let lastError = new Error('No se pudo cargar el reglamento');

  for (const endpoint of REGLAMENTO_GET_ENDPOINTS) {
    try {
      const response = await authFetch(endpoint);
      if (!response.ok) continue;

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        return normalizeReglamentoResponse(data);
      }

      const text = await response.text();
      return normalizeReglamentoResponse({ content: text });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export const downloadReglamentoPdf = async () => {
  let lastError = new Error('No se pudo descargar el PDF del reglamento');

  for (const endpoint of REGLAMENTO_PDF_ENDPOINTS) {
    try {
      const response = await authFetch(endpoint, {
        headers: { Accept: 'application/pdf, application/json' },
      });

      if (!response.ok) continue;

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/pdf')) {
        return await response.blob();
      }

      if (contentType.includes('application/json')) {
        const data = await response.json();

        if (data?.base64Pdf) {
          const byteChars = atob(data.base64Pdf);
          const byteNumbers = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i += 1) {
            byteNumbers[i] = byteChars.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          return new Blob([byteArray], { type: 'application/pdf' });
        }

        const url = data?.pdfUrl || data?.documentUrl || data?.urlPdf || data?.url;
        if (url) {
          const fileResponse = await fetch(url, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          if (fileResponse.ok) {
            return await fileResponse.blob();
          }
        }
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export const confirmarLecturaReglamento = async () => {
  let lastError = new Error('No se pudo confirmar la lectura del reglamento');

  const attempts = [
    { method: 'POST', body: JSON.stringify({ readAt: new Date().toISOString() }) },
    { method: 'POST' },
    { method: 'PUT', body: JSON.stringify({ read: true }) },
    { method: 'PATCH', body: JSON.stringify({ read: true }) },
  ];

  for (const endpoint of REGLAMENTO_CONFIRM_ENDPOINTS) {
    for (const attempt of attempts) {
      try {
        const response = await authFetch(endpoint, attempt);
        if (response.ok) return true;
      } catch (error) {
        lastError = error;
      }
    }
  }

  throw lastError;
};
