// src/services/Ventas/getVentas.js
export const getVentas = async () => {
  const url = 'https://web-service-ventas-api.onrender.com/api/ventas';
  const resp = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try { msg += ` - ${await resp.text()}`; } catch {}
    throw new Error(msg);
  }

  const json = await resp.json();
  const data = Array.isArray(json?.data) ? json.data : [];

  return data.map(v => ({
    id: v.id,
    fecha: v.fecha,            // string "YYYY-MM-DD"
    total: v.total,            // número
    cliente: {
      id: v.cliente?.id,
      nombre: v.cliente?.nombre,
      nit: v.cliente?.nit,
      direccion: v.cliente?.direccion,
    },
    productos: Array.isArray(v.productos) ? v.productos.map(p => ({
      productoId: p.productoId,
      nombre: p.nombre,
      cantidad: p.cantidad,
      precioUnitario: p.precioUnitario,
    })) : [],
  }));
};
