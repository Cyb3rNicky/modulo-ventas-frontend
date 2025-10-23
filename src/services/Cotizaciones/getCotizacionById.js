import { apiFetch } from "../../utils/apiFetch";

export const getCotizacionById = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/cotizaciones/${id}`;
  const json = await apiFetch(url, { method: "GET" });
  const c = json?.data ?? json;

  return {
    id: c.id,
    oportunidadId: c.oportunidadId ?? c.oportunidad?.id ?? null,
    activa: !!c.activa,
    total: Number(c.total ?? 0),
  };
};
