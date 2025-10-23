import { useEffect, useState } from 'react'
import { getVehiculos } from '../../services/Vehiculos/getVehiculos'
import { deleteVehiculo } from '../../services/Vehiculos/deleteVehiculo'
import { Link } from 'react-router-dom'

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const cargar = () => {
    setError(null)
    getVehiculos()
      .then(setVehiculos)
      .catch((e) => setError(e.message || 'Error al cargar vehículos'))
  }

  useEffect(() => { cargar() }, [])

  const onDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este vehículo?')) return
    try {
      setLoading(true)
      await deleteVehiculo(id)
      cargar()
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el vehículo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Vehículos</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/vehiculos/create"
            className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Crear vehículo
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
              <th className="py-3 pr-3 pl-4 text-left text-xs font-medium tracking-wide text-gray-500 uppercase sm:pl-0">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Marca</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Modelo</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Año</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Precio</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {vehiculos.length > 0 ? (
              vehiculos.map(v => (
                <tr key={v.id}>
                  <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-0">{v.id}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{v.marca}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{v.modelo}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{v.anio}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">Q{v.precio}</td>
                  <td className="px-3 py-4 text-sm flex gap-2">
                    <Link
                      to={`/vehiculos/edit/${v.id}`}
                      className="rounded-md bg-indigo-900 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => onDelete(v.id)}
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
                  {error ? '—' : 'No hay vehículos para mostrar.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
