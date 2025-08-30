import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createVenta } from '../../services/Ventas/createVenta'
import { getClientes } from '../../services/Clientes/getCliente'

export default function CrearVentas() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [items, setItems] = useState([{ productoId: '', cantidad: '' }])

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setError(null)
    setLoading(true)
    getClientes()
      .then((cs) => { if (mounted) setClientes(cs) })
      .catch((e) => setError(e.message || 'No se pudieron cargar clientes'))
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [])

  const addItem = () => setItems(arr => [...arr, { productoId: '', cantidad: '' }])
  const removeItem = (idx) => setItems(arr => arr.length === 1 ? arr : arr.filter((_, i) => i !== idx))
  const onChangeItem = (idx, field, value) => {
    setItems(arr => arr.map((it, i) => i === idx ? { ...it, [field]: value } : it))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!clienteId) return setError('Selecciona un cliente')

    const limpios = items
      .map(it => ({ productoId: Number(it.productoId), cantidad: Number(it.cantidad) }))
      .filter(it => it.productoId > 0 && it.cantidad > 0)

    if (limpios.length === 0) return setError('Agrega al menos un producto con cantidad > 0')

    try {
      setSubmitting(true)
      await createVenta({ clienteId: Number(clienteId), productos: limpios })
      navigate('/ventas')
    } catch (err) {
      setError(err.message || 'No se pudo crear la venta')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">Cargando clientes…</div>

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Crear Venta</h2>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          {/* Cliente */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="clienteId" className="block text-sm font-medium text-gray-900">
                Cliente
              </label>
              <div className="mt-2">
                <select
                  id="clienteId"
                  name="clienteId"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  required
                >
                  <option value="">— Selecciona —</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} (NIT: {c.nit})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Productos (solo id y cantidad) */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Productos</h3>
              <button
                type="button"
                onClick={addItem}
                className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-gray-300"
              >
                + Agregar producto
              </button>
            </div>

            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-7">
                    <label className="block text-sm font-medium text-gray-900">Producto ID</label>
                    <input
                      type="number"
                      min={1}
                      value={it.productoId}
                      onChange={(e) => onChangeItem(idx, 'productoId', e.target.value)}
                      className="mt-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="Ej. 3"
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-900">Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      value={it.cantidad}
                      onChange={(e) => onChangeItem(idx, 'cantidad', e.target.value)}
                      className="mt-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="1"
                      required
                    />
                  </div>
                  <div className="sm:col-span-12">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-sm text-red-600 hover:text-red-700"
                      disabled={items.length === 1}
                    >
                      Eliminar línea
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-2">
        <Link to="/ventas" className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50"
        >
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
