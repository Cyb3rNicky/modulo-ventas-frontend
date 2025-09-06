// src/services/Productos/createProducto.js
import { apiFetch } from "../../utils/apiFetch";

export const createProducto = async ({ nombre, descripcion, precio, cantidad }) => {
  const url = 'https://web-service-ventas-api.onrender.com/api/Productos';

  // Si el API autogenera el ID, puedes omitir "id"
  const payload = {
    id: 0,
    nombre,
    descripcion,
    precio: Number(precio),
    cantidad: Number(cantidad),
  };


  return apiFetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    }); // devuelve el producto creado (según imple del API)

};
