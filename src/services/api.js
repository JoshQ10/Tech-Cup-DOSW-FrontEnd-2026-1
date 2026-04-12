// src/services/api.js
// URL base del backend — cámbiala si el back corre en otro puerto o servidor
const BASE_URL = '/api';

// ── LOGIN ──
export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Credenciales incorrectas');
  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('refreshToken', data.refreshToken);
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