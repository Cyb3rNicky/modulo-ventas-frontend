import { apiFetch } from "../../utils/apiFetch";

export const getUsuarioById = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/admin/usuarios/${id}`;
  const json = await apiFetch(url, { method: "GET" });

  const u = json?.data ?? json;

  if (!u || typeof u !== "object") {
    throw new Error("Usuario no encontrado");
  }

  return {
    id: u.id,
    userName: u.userName,
    email: u.email,
    nombre: u.nombre,
    apellido: u.apellido,
  };
};
