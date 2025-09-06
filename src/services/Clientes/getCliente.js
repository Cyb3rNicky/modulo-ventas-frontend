// src/services/Clientes/getClientes.js
import { apiFetch } from "../../utils/apiFetch";

export const getClientes = async () => {
  const url = 'https://web-service-ventas-api.onrender.com/api/Clientes';

  const json = await apiFetch(url);

  // Aseguramos que siempre sea un array
  const data = Array.isArray(json?.data) ? json.data : [];

  return data.map(c => ({
    id: c.id,
    nombre: c.nombre,
    nit: c.nit,
    direccion: c.direccion,
  }));
};
