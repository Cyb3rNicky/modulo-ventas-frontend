// src/utils/auth.js
const KEY = 'auth';

export function setAuth({ token, user }) {
  localStorage.setItem(KEY, JSON.stringify({ token, user }));
}

export function getAuth() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  const a = getAuth();
  return !!a?.token;
}
