import { apiFetch } from "../../utils/apiFetch";

export const getClienteById = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/clientes/${id}`;
  const json = await apiFetch(url, { method: "GET" });
  const c = json?.data ?? json;

  return {
    id: c.id,
    nombre: c.nombre ?? "",
    nit: c.nit ?? "",
    direccion: c.direccion ?? "",
  };
};
