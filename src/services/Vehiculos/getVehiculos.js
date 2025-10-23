import { apiFetch } from "../../utils/apiFetch";

export const getVehiculos = async () => {
  const url = "https://web-service-ventas-api.onrender.com/api/vehiculos";
  const resp = await apiFetch(url, { method: "GET" });

  // El endpoint devuelve un array; si no, devolvemos []
  const data = Array.isArray(resp) ? resp : [];

  return data.map(({ id, marca, modelo, anio, precio }) => ({
    id, marca, modelo, anio, precio,
  }));
};
