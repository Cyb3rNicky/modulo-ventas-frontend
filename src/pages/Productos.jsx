'use client'

import { useEffect, useMemo, useState } from 'react'

const API_URL = '/api/productos'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const currency = useMemo(() =>
    new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', maximumFractionDigits: 2 }),
  [])

  async function fetchProductos(signal) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL, { signal, headers: { 'Accept': 'application/json' } })
      if (!res.ok) throw new Error(`Error ${res.status}: no se pudieron cargar los productos`)
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('La respuesta no tiene el formato esperado (array)')
      setProductos(data)
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchProductos(controller.signal)
    return () => controller.abort()
  }, [])

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Productos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Listado de productos consumidos desde <span className="font-mono text-gray-900">/api/productos</span>.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-2">
          <button
            type="button"
            onClick={() => fetchProductos()}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Recargar
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="relative min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3 pr-3 pl-4 text-left text-xs font-medium tracking-wide text-gray-500 uppercase sm:pl-0">ID</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Nombre</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Precio</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Cantidad</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Descripción</th>
                  <th scope="col" className="py-3 pr-4 pl-3 sm:pr-0"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="py-4 pr-3 pl-4 text-sm text-gray-900 sm:pl-0"><div className="h-4 w-8 bg-gray-200 rounded"/></td>
                      <td className="px-3 py-4 text-sm text-gray-500"><div className="h-4 w-40 bg-gray-200 rounded"/></td>
                      <td className="px-3 py-4 text-sm text-gray-500"><div className="h-4 w-24 bg-gray-200 rounded"/></td>
                      <td className="px-3 py-4 text-sm text-gray-500"><div className="h-4 w-10 bg-gray-200 rounded"/></td>
                      <td className="px-3 py-4 text-sm text-gray-500"><div className="h-4 w-64 bg-gray-200 rounded"/></td>
                      <td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                        <div className="h-4 w-12 bg-gray-200 rounded"/>
                      </td>
                    </tr>
                  ))
                ) : (
                  productos.length > 0 ? (
                    productos.map((p) => (
                      <tr key={p.id}>
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">{p.id}</td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-900">{p.nombre}</td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-700">{typeof p.precio === 'number' ? currency.format(p.precio) : p.precio}</td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-700">{p.cantidad}</td>
                        <td className="px-3 py-4 text-sm text-gray-500">{p.descripcion}</td>
                        <td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                          <button className="text-indigo-600 hover:text-indigo-900">Editar<span className="sr-only">, {p.nombre}</span></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-3 py-10 text-center text-sm text-gray-500">
                        No hay productos para mostrar.
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
