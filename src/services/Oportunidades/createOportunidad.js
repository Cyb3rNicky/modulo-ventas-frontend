import { apiFetch } from "../../utils/apiFetch";

export const createOportunidad = async ({ clienteId, usuarioId, vehiculoId, etapaId }) => {
  const url = "https://web-service-ventas-api.onrender.com/api/oportunidades";
  const payload = {
    clienteId: Number(clienteId),
    usuarioId: Number(usuarioId),
    vehiculoId: Number(vehiculoId),
    etapaId: Number(etapaId),
    activa: true,
  };

  return apiFetch(url, { method: "POST", body: JSON.stringify(payload) });
};
