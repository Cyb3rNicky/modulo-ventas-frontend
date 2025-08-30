export const getClientes = async () => {
  const url = 'https://web-service-ventas-api.onrender.com/api/Clientes';
  const resp = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try { msg += ` - ${await resp.text()}`; } catch {}
    throw new Error(msg);
  }

  const json = await resp.json();
  const data = Array.isArray(json?.data) ? json.data : [];
  return data.map(c => ({
    id: c.id,
    nombre: c.nombre,
    nit: c.nit,
    direccion: c.direccion,
  }));
};
