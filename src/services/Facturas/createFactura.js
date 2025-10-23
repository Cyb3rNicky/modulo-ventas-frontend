import { apiFetch } from "../../utils/apiFetch";

export const createFactura = async ({ cotizacionId, numero, estado, total }) => {
  const url = "https://web-service-ventas-api.onrender.com/api/facturas";
  const payload = {
    cotizacionId: Number(cotizacionId),
    numero: String(numero ?? "").trim(),
    estado: String(estado ?? "Borrador"),
    total: Number(total ?? 0),
  };
  return apiFetch(url, { method: "POST", body: JSON.stringify(payload) });
};
