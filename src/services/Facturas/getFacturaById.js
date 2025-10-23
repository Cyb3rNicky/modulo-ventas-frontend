import { apiFetch } from "../../utils/apiFetch";

export const getFacturaById = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/facturas/${id}`;
  const f = await apiFetch(url, { method: "GET" });
  return {
    id: f.id,
    cotizacionId: f.cotizacionId,
    numero: f.numero,
    estado: f.estado,
    total: Number(f.total ?? 0),
  };
};
