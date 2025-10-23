import { apiFetch } from "../../utils/apiFetch";

export const createCotizacion = async ({ oportunidadId, activa, total }) => {
  const url = "https://web-service-ventas-api.onrender.com/api/cotizaciones";
  const payload = {
    oportunidadId: Number(oportunidadId),
    activa: !!activa,
    total: Number(total),
  };
  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
