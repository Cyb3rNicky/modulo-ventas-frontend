// src/services/Productos/createProducto.js
export const createProducto = async ({ nombre, descripcion, precio, cantidad }) => {
  const url = 'https://web-service-ventas-api.onrender.com/api/Productos';

  // Si el API autogenera el ID, puedes omitir "id"
  const payload = {
    id: 0,
    nombre,
    descripcion,
    precio: Number(precio),
    cantidad: Number(cantidad),
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    // intenta leer JSON de error; si no se puede, lanza el texto
    let msg = `HTTP ${resp.status}`;
    try {
      const err = await resp.json();
      msg += ` - ${err?.title || err?.error || ''}`;
    } catch {
      msg += ` - ${await resp.text()}`;
    }
    throw new Error(msg);
  }

  return resp.json(); // devuelve el producto creado (según imple del API)
};
