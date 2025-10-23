import { apiFetch } from "../../utils/apiFetch";

export const deleteVehiculo = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/vehiculos/${id}`;
  await apiFetch(url, { method: "DELETE" });
  return true;
};
