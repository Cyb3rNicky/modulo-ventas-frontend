import { apiFetch } from "../../utils/apiFetch";

export const getUsuarios = async () => {
  
  const url = 'https://web-service-ventas-api.onrender.com/api/admin/usuarios';
  
  const usuarios = await apiFetch(url);

  return usuarios.map(usuario => ({
    id:          usuario.id,
    userName:    usuario.userName,  
    email:      usuario.email,
    nombre:    usuario.nombre,
    apellido: usuario.apellido,
  }));
};
