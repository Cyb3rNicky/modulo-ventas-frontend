import { apiFetch } from "../../utils/apiFetch";

export const getItemsByCotizacionId = async (cotizacionId) => {
  const url = `https://web-service-ventas-api.onrender.com/api/cotizacion-items/cotizacion/${cotizacionId}`;
  const json = await apiFetch(url, { method: "GET" });
  const data = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

  return data.map(it => ({
    id: it.id,
    cotizacionId: it.cotizacionId ?? cotizacionId,
    vehiculoId: it.vehiculoId,
    descripcion: it.descripcion ?? "",
    cantidad: Number(it.cantidad ?? 0),
    precioUnitario: Number(it.precioUnitario ?? 0),
    descuento: Number(it.descuento ?? 0),
  }));
};
