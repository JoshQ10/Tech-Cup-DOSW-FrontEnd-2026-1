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

// ── VALIDAR CÉDULA ──
export const validarCedula = async (cedula) => {
  const response = await authFetch(`/players/search?cedula=${cedula}`);
  if (!response.ok) throw new Error('Cédula no encontrada');
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