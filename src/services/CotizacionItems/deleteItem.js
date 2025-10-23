import { apiFetch } from "../../utils/apiFetch";

export const deleteItem = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/cotizacion-items/${id}`;
  await apiFetch(url, { method: "DELETE" });
  return true;
};
