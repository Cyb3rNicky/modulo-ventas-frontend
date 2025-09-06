import { apiFetch } from "../../utils/apiFetch";

export const getProductos = async () => {
  
  const url = 'https://web-service-ventas-api.onrender.com/api/productos';
  
  const { data } = await apiFetch(url);

  return data.map(producto => ({
    id:          producto.id,
    nombre:      producto.nombre,
    precio:      producto.precio,
    cantidad:    producto.cantidad,
    descripcion: producto.descripcion,
  }));
};
