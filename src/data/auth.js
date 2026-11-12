import { apiRequest } from './api';

const USER_KEY = 'planeta-clima-user';
const AUTH_EVENT = 'planeta-auth-change';
function notifyAuthChange() { window.dispatchEvent(new Event(AUTH_EVENT)); }
function saveSession({ user, token }) {
  localStorage.setItem('planeta-clima-token', token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChange();
  return user;
}
export function subscribeToAuth(callback) {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
  catch { return null; }
}
export async function registerUser({ name, email, password }) {
  return saveSession(await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }));
}
export async function loginUser(email, password) {
  return saveSession(await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }));
}
export function logoutUser() {
  localStorage.removeItem('planeta-clima-token');
  localStorage.removeItem(USER_KEY);
  notifyAuthChange();
}

// Gerenciamento de usuários do painel administrativo, sempre pelo banco MySQL.
export async function getUsers() { return (await apiRequest('/users')).items || []; }
export async function createUser(values) { return (await apiRequest('/users', { method: 'POST', body: JSON.stringify(values) })).item; }
export async function editUser(id, values) { return (await apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(values) })).item; }
export async function removeUser(id) { return apiRequest(`/users/${id}`, { method: 'DELETE' }); }
