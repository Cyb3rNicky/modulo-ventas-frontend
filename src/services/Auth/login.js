// src/services/Auth/login.js
export const login = async ({ userName, password }) => {
  const url = 'https://web-service-ventas-api.onrender.com/api/auth/login';

  // NOTA: usamos las claves con el mismo casing que pide el backend
  const body = JSON.stringify({ UserName: userName, Password: password });

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body,
  });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try { msg += ` - ${await resp.text()}`; } catch {}
    throw new Error(msg);
  }

  // { token, user: { id, userName, email, nombre, apellido, roles: [...] } }
  return resp.json();
};
