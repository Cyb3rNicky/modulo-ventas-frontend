import { apiFetch } from "../../utils/apiFetch";
import { isAdmin, getAuth } from "../../utils/auth";

const toNum = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export const getOportunidades = async () => {
  const admin = !!isAdmin();
  const authUserId = toNum(getAuth()?.user?.id);

  const base = "https://web-service-ventas-api.onrender.com/api/oportunidades";
  // Siempre traemos todas; filtramos si no es admin
  const json = await apiFetch(base, { method: "GET" });
  const data = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

  // Si no es admin, nos quedamos solo con las suyas
  const filtered = (!admin && authUserId)
    ? data.filter(o => {
        const vendedorId = toNum(o?.vendedor?.id ?? o?.usuario?.id ?? o?.usuarioId);
        return vendedorId === authUserId;
      })
    : data;

  // Mapeo para UI (igual que antes, con pequeños fallbacks)
  return filtered.map(o => {
    const clienteId = toNum(o?.cliente?.id ?? o?.clienteId);
    const usuarioIdResp = toNum(o?.vendedor?.id ?? o?.usuario?.id ?? o?.usuarioId);
    const etapaId = toNum(o?.etapa?.id ?? o?.etapaId);

    const clienteLabel = o?.cliente?.nombre ?? (clienteId ? `Cliente #${clienteId}` : "Cliente");
    const asesorLabel  = [o?.vendedor?.nombre ?? o?.usuario?.nombre, o?.vendedor?.apellido ?? o?.usuario?.apellido]
      .filter(Boolean).join(" ")
      || (usuarioIdResp ? `Usuario #${usuarioIdResp}` : "Usuario");
    const vehiculoLabel = [o?.vehiculo?.marca ?? o?.vehiculoMarca, o?.vehiculo?.modelo ?? o?.vehiculoModelo]
      .filter(Boolean).join(" ")
      || "Vehículo";

    return {
      id: toNum(o.id),
      activa: o?.activa === undefined ? true : !!o.activa,
      clienteId,
      usuarioId: usuarioIdResp,
      etapaId,
      clienteLabel,
      asesorLabel,
      vehiculoLabel,
      total: Number(o?.total ?? 0),
    };
  });
};
