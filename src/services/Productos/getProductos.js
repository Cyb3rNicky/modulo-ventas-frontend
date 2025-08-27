export const getProductos = async () => {
  
  const url = 'https://web-service-ventas-api.onrender.com/api/productos';
  const resp = await fetch(url);
  const { data } = await resp.json();

  return data.map(producto => ({
    id:          producto.id,
    nombre:      producto.nombre,
    precio:      producto.precio,
    cantidad:    producto.cantidad,
    descripcion: producto.descripcion,
  }));
};
