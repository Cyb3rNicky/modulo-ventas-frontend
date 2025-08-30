import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductoById } from '../../services/Productos/getProductoById'
import { updateProducto } from '../../services/Productos/updateProducto'

export default function EditarProducto() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setError(null)
    setLoading(true)
    getProductoById(id)
      .then((p) => {
        if (!mounted) return
        setForm({
          nombre: p.nombre ?? '',
          descripcion: p.descripcion ?? '',
          precio: p.precio ?? '',
          cantidad: p.cantidad ?? '',
        })
      })
      .catch((e) => setError(e.message || 'No se pudo cargar el producto'))
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [id])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.nombre?.trim()) return setError('El nombre es obligatorio')
    if (form.precio === '' || isNaN(Number(form.precio))) return setError('Precio inválido')
    if (form.cantidad === '' || isNaN(Number(form.cantidad))) return setError('Cantidad inválida')

    try {
      setSubmitting(true)
      await updateProducto({
        id,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        cantidad: Number(form.cantidad),
      })
      navigate('/') // volver al listado
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el producto')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">Cargando…</div>
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Editar Producto</h2>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="nombre" className="block text-sm/6 font-medium text-gray-900">
                Nombre
              </label>
              <div className="mt-2">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={onChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Computadora portátil"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="descripcion" className="block text-sm/6 font-medium text-gray-900">
                Descripción
              </label>
              <div className="mt-2">
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={3}
                  value={form.descripcion}
                  onChange={onChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Laptop de oficina Core i7"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="precio" className="block text-sm/6 font-medium text-gray-900">
                Precio
              </label>
              <div className="mt-2">
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  value={form.precio}
                  onChange={onChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="7500"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="cantidad" className="block text-sm/6 font-medium text-gray-900">
                Cantidad
              </label>
              <div className="mt-2">
                <input
                  id="cantidad"
                  name="cantidad"
                  type="number"
                  value={form.cantidad}
                  onChange={onChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-2">
        <Link
          to="/"
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
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
