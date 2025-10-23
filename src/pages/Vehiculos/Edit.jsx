import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getVehiculoById } from '../../services/Vehiculos/getVehiculoById'
import { updateVehiculo } from '../../services/Vehiculos/updateVehiculos'

export default function EditarVehiculo() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({ marca: '', modelo: '', anio: '', precio: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setError(null)
    setLoading(true)
    getVehiculoById(id)
      .then((v) => {
        if (!mounted) return
        setForm({
          marca: v.marca ?? '',
          modelo: v.modelo ?? '',
          anio: v.anio ?? '',
          precio: v.precio ?? '',
        })
      })
      .catch((e) => setError(e.message || 'No se pudo cargar el vehículo'))
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

    if (!form.marca?.trim()) return setError('La marca es obligatoria')
    if (!form.modelo?.trim()) return setError('El modelo es obligatorio')
    if (form.anio === '' || isNaN(Number(form.anio))) return setError('Año inválido')
    if (form.precio === '' || isNaN(Number(form.precio))) return setError('Precio inválido')

    try {
      setSubmitting(true)
      await updateVehiculo({
        id,
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        anio: Number(form.anio),
        precio: Number(form.precio),
      })
      navigate('/')
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el vehículo')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">Cargando…</div>

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Editar Vehículo</h2>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="marca" className="block text-sm/6 font-medium text-gray-900">Marca</label>
              <input id="marca" name="marca" type="text" value={form.marca} onChange={onChange}
                required className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="modelo" className="block text-sm/6 font-medium text-gray-900">Modelo</label>
              <input id="modelo" name="modelo" type="text" value={form.modelo} onChange={onChange}
                required className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="anio" className="block text-sm/6 font-medium text-gray-900">Año</label>
              <input id="anio" name="anio" type="number" value={form.anio} onChange={onChange}
                required className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="precio" className="block text-sm/6 font-medium text-gray-900">Precio</label>
              <input id="precio" name="precio" type="number" step="0.01" value={form.precio} onChange={onChange}
                required className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-2">
        <Link to="/" className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">Cancelar</Link>
        <button type="submit" disabled={submitting}
          className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50">
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
