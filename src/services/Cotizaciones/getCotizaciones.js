import { apiFetch } from "../../utils/apiFetch";

export const getCotizaciones = async () => {
  const url = "https://web-service-ventas-api.onrender.com/api/cotizaciones";
  const json = await apiFetch(url, { method: "GET" });
  const data = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

  // Normalizamos un poco por si el backend devuelve campos con otro casing
  return data.map(c => ({
    id: c.id,
    oportunidadId: c.oportunidadId ?? c.oportunidad?.id ?? null,
    activa: !!c.activa,
    total: Number(c.total ?? 0),
    // opcional: cliente/etiquetas si el backend lo incluye
    cliente: c.cliente?.nombre ?? null,
  }));
};
