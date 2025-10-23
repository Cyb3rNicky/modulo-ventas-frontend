import { apiFetch } from "../../utils/apiFetch";

export const createCliente = async ({ nombre, nit, direccion }) => {
  const url = "https://web-service-ventas-api.onrender.com/api/clientes";

  const payload = {
    nombre: String(nombre ?? "").trim(),
    nit: String(nit ?? "").trim(),
    direccion: String(direccion ?? "").trim(),
  };

  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
