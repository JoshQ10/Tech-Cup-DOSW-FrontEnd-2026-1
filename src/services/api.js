// src/services/api.js
// URL base del backend — cámbiala si el back corre en otro puerto o servidor
const BASE_URL = 'https://localhost:8443/api';

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Credenciales incorrectas');
  }

  const data = await response.json();
  // El back devuelve un token JWT — lo guardamos
  localStorage.setItem('token', data.token);
  return data;
};