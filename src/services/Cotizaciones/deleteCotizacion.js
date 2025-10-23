import { apiFetch } from "../../utils/apiFetch";

export const deleteCotizacion = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/cotizaciones/${id}`;
  await apiFetch(url, { method: "DELETE" });
  return true;
};
