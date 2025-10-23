import { apiFetch } from "../../utils/apiFetch";

export const getClientes = async () => {
  const url = "https://web-service-ventas-api.onrender.com/api/clientes";
  const json = await apiFetch(url, { method: "GET" });

  const data = Array.isArray(json) ? json
            : Array.isArray(json?.data) ? json.data
            : [];

  return data.map(c => ({
    id: c.id,
    nombre: c.nombre,
    nit: c.nit,
    direccion: c.direccion,
  }));
};
