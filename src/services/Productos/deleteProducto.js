// src/services/Productos/deleteProducto.js
export const deleteProducto = async (id) => {
  const url = `https://web-service-ventas-api.onrender.com/api/Productos/${id}`;

  const resp = await fetch(url, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try {
      msg += ` - ${await resp.text()}`;
    } catch {}
    throw new Error(msg);
  }

  return true; // DELETE devuelve 204 No Content
};
