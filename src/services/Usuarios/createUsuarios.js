import { apiFetch } from "../../utils/apiFetch";

export const createUsuario = async ({ userName, email, nombre, apellido, password, role }) => {
  const url = 'https://web-service-ventas-api.onrender.com/api/auth/register';

  const payload = {
    userName,
    email,
    nombre,
    apellido,
    password,
    role,
  };

  const resp = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return resp; // devuelve el usuario creado según el API
};