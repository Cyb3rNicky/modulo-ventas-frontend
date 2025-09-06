// src/services/Productos/deleteProducto.js
import { apiFetch } from "../../utils/apiFetch";

export const deleteUsuario = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/admin/usuarios/${id}`;

  await apiFetch(url, { method: "DELETE" });
  
  return true; // DELETE devuelve 204 No Content
};
