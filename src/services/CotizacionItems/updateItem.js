import { apiFetch } from "../../utils/apiFetch";

export const updateItem = async ({ id, vehiculoId, descripcion, cantidad, precioUnitario, descuento }) => {
  const url = `https://web-service-ventas-api.onrender.com/api/cotizacion-items/${id}`;
  const payload = {
    vehiculoId: Number(vehiculoId),
    descripcion: String(descripcion ?? ""),
    cantidad: Number(cantidad),
    precioUnitario: Number(precioUnitario),
    descuento: Number(descuento ?? 0),
  };
  return apiFetch(url, { method: "PUT", body: JSON.stringify(payload) });
};
