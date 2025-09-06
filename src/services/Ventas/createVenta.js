// src/services/Ventas/createVenta.js
import { apiFetch } from "../../utils/apiFetch";

export const createVenta = async ({ clienteId, productos }) => {
  const url = 'https://web-service-ventas-api.onrender.com/api/Ventas';

  const payload = {
    clienteId: Number(clienteId),
    productos: productos.map(p => ({
      productoId: Number(p.productoId),
      cantidad: Number(p.cantidad),
    })),
  };

  const resp = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return resp; // devuelve la respuesta del API con la venta creada
};