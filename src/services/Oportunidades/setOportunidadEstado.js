import { apiFetch } from "../../utils/apiFetch";

export const setOportunidadEstado = async ({ id, activa }) => {
  const url = `https://web-service-ventas-api.onrender.com/api/oportunidades/${id}/estado`;
  const payload = { activa: !!activa };
  return apiFetch(url, { method: "PUT", body: JSON.stringify(payload) });
};
