import { apiFetch } from "../../utils/apiFetch";

export const getEtapas = async () => {
  const url = "https://web-service-ventas-api.onrender.com/api/etapas";
  const resp = await apiFetch(url, { method: "GET" });

  // El endpoint devuelve un array (si no, devolvemos [])
  const data = Array.isArray(resp) ? resp : Array.isArray(resp?.data) ? resp.data : [];

  // Normalizamos y ordenamos por 'orden'
  return data
    .map(({ id, nombre, orden }) => ({ id, nombre, orden }))
    .sort((a, b) => a.orden - b.orden);
};
