import { apiFetch } from "../../utils/apiFetch";

export const createEtapa = async ({ nombre, orden }) => {
  const url = "https://web-service-ventas-api.onrender.com/api/etapas";
  const payload = {
    nombre: String(nombre ?? "").trim(),
    orden: Number(orden ?? 0),
    anio: 0,
    precio: 0,
  };

  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
