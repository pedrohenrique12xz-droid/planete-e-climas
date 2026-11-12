const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export function getToken() { return localStorage.getItem('planeta-clima-token'); }
export async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken(); if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a solicitação.');
  return data;
}
