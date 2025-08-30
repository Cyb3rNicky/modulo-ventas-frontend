// src/services/Productos/updateProducto.js
export const updateProducto = async ({ id, nombre, descripcion, precio, cantidad }) => {
  const url = `https://web-service-ventas-api.onrender.com/api/Productos/${id}`;

  const payload = {
    id: Number(id), // el backend valida que id del body == id de la ruta
    nombre,
    descripcion,
    precio: Number(precio),
    cantidad: Number(cantidad),
  };

  const resp = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try { msg += ` - ${await resp.text()}`; } catch {}
    throw new Error(msg);
  }

  // El PUT devuelve 204 No Content en tu API; no hay JSON que leer
  return true;
};
