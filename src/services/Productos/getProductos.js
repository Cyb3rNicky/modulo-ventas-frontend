// src/services/Productos/getProductos.js
export const getProductos = async () => {
  const url = "https://web-service-ventas-api.onrender.com/api/productos";

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Solo mandar token si existe
      Authorization: `Bearer ${localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : ""}`,
    },
  });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try {
      const text = await resp.text();
      msg += ` - ${text}`;
    } catch {}
    throw new Error(msg);
  }

  const json = await resp.json();
  const data = Array.isArray(json?.data) ? json.data : [];
  return data.map((producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    cantidad: producto.cantidad,
    descripcion: producto.descripcion,
  }));
};
