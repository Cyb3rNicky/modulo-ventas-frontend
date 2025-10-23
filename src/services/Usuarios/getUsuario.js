import { apiFetch } from "../../utils/apiFetch";

export const getUsuarios = async () => {
  const url = "https://web-service-ventas-api.onrender.com/api/admin/usuarios";
  const json = await apiFetch(url, { method: "GET" });

  const data = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json?.users)
    ? json.users
    : [];

  return data.map((usuario) => ({
    id: usuario.id,
    userName: usuario.userName,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
  }));
};
