import { apiFetch } from "../../utils/apiFetch";

export const deleteEtapa = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/etapas/${id}`;
  await apiFetch(url, { method: "DELETE" });
  return true;
};
