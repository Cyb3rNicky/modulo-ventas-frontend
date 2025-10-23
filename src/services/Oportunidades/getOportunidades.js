import { apiFetch } from "../../utils/apiFetch";
import { isAdmin, getAuth } from "../../utils/auth";

export const getOportunidades = async () => {
  const admin = isAdmin();
  const usuarioId = getAuth()?.user?.id;

  const base = "https://web-service-ventas-api.onrender.com/api/oportunidades";
  const url = (admin || !usuarioId) ? base : `${base}/usuario/${usuarioId}`;

  const json = await apiFetch(url, { method: "GET" });
  const data = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

  return data.map(o => {
    const clienteId = o.cliente?.id ?? null;
    const usuarioIdResp = o.vendedor?.id ?? null;
    const etapaId = o.etapa?.id ?? null;

    const clienteLabel = o.cliente?.nombre ?? (clienteId ? `Cliente #${clienteId}` : "Cliente");
    const asesorLabel  = [o.vendedor?.nombre, o.vendedor?.apellido].filter(Boolean).join(" ") || (usuarioIdResp ? `Usuario #${usuarioIdResp}` : "Usuario");
    const vehiculoLabel = [o.vehiculo?.marca, o.vehiculo?.modelo].filter(Boolean).join(" ") || "Vehículo";

    return {
      id: o.id,
      activa: !!o.activa,

      // ids (cuando existan en la respuesta)
      clienteId,
      usuarioId: usuarioIdResp,
      etapaId,

      // etiquetas listas para UI
      clienteLabel,
      asesorLabel,
      vehiculoLabel,

      // si llegara a venir el precio en el futuro
      total: Number(o.total ?? 0),
    };
  });
};
