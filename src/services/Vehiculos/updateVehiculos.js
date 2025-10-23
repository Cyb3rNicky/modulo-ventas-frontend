import { apiFetch } from "../../utils/apiFetch";

export const updateVehiculo = async ({ id, marca, modelo, anio, precio }) => {
  const url = `https://web-service-ventas-api.onrender.com/api/vehiculos/${id}`;

  const payload = {
    id,
    marca: String(marca ?? "").trim(),
    modelo: String(modelo ?? "").trim(),
    anio: Number(anio),
    precio: Number(precio),
  };

  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
