// src/services/Usuarios/getUsuarioById.js
import { apiFetch } from "../../utils/apiFetch";

export const getUsuarioById = async (id) => {
  const url = "https://web-service-ventas-api.onrender.com/api/admin/usuarios";

  const usuarios = await apiFetch(url); // devuelve un array

  const usuario = usuarios.find(u => u.id === Number(id));
  if (!usuario) throw new Error("Usuario no encontrado");

  return {
    id: usuario.id,
    userName: usuario.userName,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
  };
};
