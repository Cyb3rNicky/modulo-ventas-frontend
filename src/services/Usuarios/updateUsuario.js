// src/services/Productos/updateProducto.js
import { apiFetch } from "../../utils/apiFetch";

export const updateUsuario = async ({ id, passwordNueva, confirmarPasswordNueva }) => {
  const url = `https://web-service-ventas-api.onrender.com/api/auth/resetear-password/${id}`;

  const payload = {
    id: Number(id), // el backend valida que id del body == id de la ruta
    passwordNueva,
    confirmarPasswordNueva,
  };

   // apiFetch ya maneja token, headers y errores
  const result = await apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  // Si la API devuelve 204 No Content, apiFetch regresa `null`
  return result ?? true;
  
};
