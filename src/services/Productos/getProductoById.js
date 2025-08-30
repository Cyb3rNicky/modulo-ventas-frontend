// src/services/Productos/getProductoById.js
export const getProductoById = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/Productos/${id}`;
  const resp = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try { msg += ` - ${await resp.text()}`; } catch {}
    throw new Error(msg);
  }

  // Este endpoint devuelve el objeto directo (no envuelto en { data })
  const p = await resp.json();
  return {
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    cantidad: p.cantidad,
  };
};
