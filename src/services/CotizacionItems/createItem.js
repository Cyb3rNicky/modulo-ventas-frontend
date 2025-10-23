import { apiFetch } from "../../utils/apiFetch";

export const createItem = async ({ cotizacionId, vehiculoId, descripcion, cantidad, precioUnitario, descuento }) => {
  const url = "https://web-service-ventas-api.onrender.com/api/cotizacion-items";
  const payload = {
    cotizacionId: Number(cotizacionId),
    vehiculoId: Number(vehiculoId),
    descripcion: String(descripcion ?? ""),
    cantidad: Number(cantidad),
    precioUnitario: Number(precioUnitario),
    descuento: Number(descuento ?? 0),
  };
  return apiFetch(url, { method: "POST", body: JSON.stringify(payload) });
};
