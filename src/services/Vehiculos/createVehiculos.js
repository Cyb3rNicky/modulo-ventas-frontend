import { apiFetch } from "../../utils/apiFetch";

export const createVehiculo = async ({ marca, modelo, anio, precio }) => {
  const url = "https://web-service-ventas-api.onrender.com/api/vehiculos";

  const payload = {
    marca: String(marca ?? "").trim(),
    modelo: String(modelo ?? "").trim(),
    anio: Number(anio),
    precio: Number(precio),
  };

  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
