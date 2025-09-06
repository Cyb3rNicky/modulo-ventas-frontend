import { useEffect, useState } from 'react'
import { getUsuarios } from '../../services/Usuarios/getUsuario'
import { deleteUsuario } from '../../services/Usuarios/deleteUsuario'
import { Link } from 'react-router-dom'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const cargar = () => {
    setError(null)
    getUsuarios()
      .then(setUsuarios)
      .catch((e) => setError(e.message || 'Error al cargar Usuarios'))
  }

  useEffect(() => {
    cargar()
  }, [])

  const onDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return
    try {
      setLoading(true)
      await deleteUsuario(id)
      // refrescar lista después de eliminar
      cargar()
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Usuarios</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/usuarios/create"
            className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Crear usuario
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Id</th> 
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Usuario</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">E-mail</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Nombre</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Apellido</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Acciones</th>

            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {usuarios.length > 0 ? (
              usuarios.map(p => (
                <tr key={p.id}>
                  <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-0">{p.id}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{p.userName}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{p.email}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{p.nombre}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{p.apellido}</td>
                  <td className="px-3 py-4 text-sm flex gap-2">
                    <Link
                      to={`/usuarios/edit/${p.id}`}
                      className="rounded-md bg-indigo-900 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                      Reset Pass
                    </Link>
                    <button
                      onClick={() => onDelete(p.id)}
                      disabled={loading}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-sm text-gray-500">
                  {error ? '—' : 'No hay productos para mostrar.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
