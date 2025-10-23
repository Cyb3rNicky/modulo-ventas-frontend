import { apiFetch } from "../../utils/apiFetch";

export const updateOportunidad = async ({ id, clienteId, usuarioId, vehiculoId, etapaId, activa }) => {
  const url = `https://web-service-ventas-api.onrender.com/api/oportunidades/${id}`;

  const payload = {
    id: Number(id),
    clienteId: Number(clienteId),
    usuarioId: Number(usuarioId),
    vehiculoId: Number(vehiculoId),
    etapaId: Number(etapaId),
    activa: !!activa,
  };

  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
