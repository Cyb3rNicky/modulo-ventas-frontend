import { apiFetch } from "../../utils/apiFetch";

export const updateEtapaOportunidad = async ({ id, etapaId }) => {
  const url = `https://web-service-ventas-api.onrender.com/api/oportunidades/${id}`;
  const payload = { etapaId: Number(etapaId) };

  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
