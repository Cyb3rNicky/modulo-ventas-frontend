import { apiFetch } from "../../utils/apiFetch";

export const getVehiculoById = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/vehiculos/${id}`;
  const json = await apiFetch(url, { method: "GET" });
  const v = json?.data ?? json; // por si el byId viene directo

  return {
    id: v.id,
    marca: v.marca ?? "",
    modelo: v.modelo ?? "",
    anio: v.anio ?? "",
    precio: v.precio ?? "",
  };
};
