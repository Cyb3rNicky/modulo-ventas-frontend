import { apiFetch } from "../../utils/apiFetch";

export const getOportunidadById = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/oportunidades/${id}`;
  const json = await apiFetch(url, { method: "GET" });
  const o = json?.data ?? json;

  const clienteId = o?.cliente?.id ?? o?.clienteId ?? null;
  const usuarioId = o?.vendedor?.id ?? o?.usuarioId ?? null;
  const vehiculoId = o?.vehiculo?.id ?? o?.vehiculoId ?? null;
  const etapaId    = o?.etapa?.id ?? o?.etapaId ?? null;

  return {
    id: o.id,
    clienteId,
    usuarioId,
    vehiculoId,
    etapaId,
    activa: !!o.activa,
  };
};
