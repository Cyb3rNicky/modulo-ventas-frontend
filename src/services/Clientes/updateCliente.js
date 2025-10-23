import { apiFetch } from "../../utils/apiFetch";

export const updateCliente = async ({ id, nombre, nit, direccion }) => {
  const url = `https://web-service-ventas-api.onrender.com/api/clientes/${id}`;

  const payload = {
    id,
    nombre: String(nombre ?? "").trim(),
    nit: String(nit ?? "").trim(),
    direccion: String(direccion ?? "").trim(),
  };

  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
