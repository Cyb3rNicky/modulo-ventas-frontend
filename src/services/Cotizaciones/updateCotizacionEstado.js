import { apiFetch } from "../../utils/apiFetch";

export const updateCotizacionEstado = async ({ id, activa, total }) => {
  const url = `https://web-service-ventas-api.onrender.com/api/cotizaciones/${id}/estado`;
  const payload = { activa: !!activa, total: Number(total ?? 0) }; // si solo acepta 'activa', elimina 'total'
  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
