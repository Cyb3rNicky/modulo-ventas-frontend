import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getVentas } from '../../services/Ventas/getVentas'

export default function Ventas() {
  const [ventas, setVentas] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const cargar = () => {
    setError(null)
    setLoading(true)
    getVentas()
      .then(setVentas)
      .catch((e) => setError(e.message || 'Error al cargar ventas'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargar()
  }, [])

  const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', maximumFractionDigits: 2 })

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Ventas</h1>
          <p className="mt-2 text-sm text-gray-700">Listado de ventas registradas.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-2">
          <Link
            to="/ventas/create"
            className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Crear venta
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
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Fecha</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Cliente</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">NIT</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Total</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Productos</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  <td className="py-4 pr-3 pl-4 sm:pl-0"><div className="h-4 w-8 bg-gray-200 rounded"/></td>
                  <td className="px-3 py-4"><div className="h-4 w-24 bg-gray-200 rounded"/></td>
                  <td className="px-3 py-4"><div className="h-4 w-40 bg-gray-200 rounded"/></td>
                  <td className="px-3 py-4"><div className="h-4 w-24 bg-gray-200 rounded"/></td>
                  <td className="px-3 py-4"><div className="h-4 w-16 bg-gray-200 rounded"/></td>
                  <td className="px-3 py-4"><div className="h-4 w-48 bg-gray-200 rounded"/></td>
                  <td className="px-3 py-4"><div className="h-8 w-24 bg-gray-200 rounded"/></td>
                </tr>
              ))
            ) : ventas.length > 0 ? (
              ventas.map(v => (
                <tr key={v.id}>
                  <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-0">{v.id}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{v.fecha}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{v.cliente?.nombre}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{v.cliente?.nit}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{currency.format(v.total)}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">
                    {v.productos.length ? (
                      <ul className="list-disc list-inside space-y-1">
                        {v.productos.map(item => (
                          <li key={`${v.id}-${item.productoId}`}>
                            {item.nombre} × {item.cantidad} @ {currency.format(item.precioUnitario)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm flex gap-2">
                    {/* <Link
                      to={`/ventas/edit/${v.id}`}
                      className="rounded-md bg-indigo-900 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                      Editar
                    </Link> */}
                    {/* Botón eliminar venta si luego expones DELETE /api/Ventas/{id} */}
                    {/* <button className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-500">Eliminar</button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-gray-500">
                  {error ? '—' : 'No hay ventas para mostrar.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
