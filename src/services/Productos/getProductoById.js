import { apiFetch } from "../../utils/apiFetch";

export const getProductoById = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/productos/${id}`;
  const p = await apiFetch(url);

  return {
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    cantidad: p.cantidad,
  };
};
