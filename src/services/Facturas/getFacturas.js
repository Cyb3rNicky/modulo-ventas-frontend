import { apiFetch } from "../../utils/apiFetch";

export const getFacturas = async () => {
  const url = "https://web-service-ventas-api.onrender.com/api/facturas";
  const json = await apiFetch(url, { method: "GET" });
  const data = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
  return data.map(f => ({
    id: f.id,
    cotizacionId: f.cotizacionId,
    numero: f.numero,
    estado: f.estado,   // string
    total: Number(f.total ?? 0),
  }));
};
