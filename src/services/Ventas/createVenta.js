export const createVenta = async ({ clienteId, productos }) => {
  const url = 'https://web-service-ventas-api.onrender.com/api/Ventas';

  const payload = {
    clienteId: Number(clienteId),
    productos: productos.map(p => ({
      productoId: Number(p.productoId),
      cantidad: Number(p.cantidad),
    })),
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try { msg += ` - ${await resp.text()}`; } catch {}
    throw new Error(msg);
  }

  return resp.json();
};
