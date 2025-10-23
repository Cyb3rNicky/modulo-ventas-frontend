import { apiFetch } from "../../utils/apiFetch";

export const deleteCliente = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/clientes/${id}`;
  await apiFetch(url, { method: "DELETE" });
  return true; // 204 esperado
};
