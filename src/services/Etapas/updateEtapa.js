import { apiFetch } from "../../utils/apiFetch";

export const updateEtapa = async ({ id, nombre, orden }) => {
  const url = `https://web-service-ventas-api.onrender.com/api/etapas/${id}`;
  const payload = {
    id,
    nombre: String(nombre ?? "").trim(),
    orden: Number(orden ?? 0),
    anio: 0,
    precio: 0,
  };

  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
