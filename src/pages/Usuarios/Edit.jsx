import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getUsuarioById } from '../../services/Usuarios/getUsuariosById'
import { updateUsuario } from '../../services/Usuarios/updateUsuario'

export default function ResetPasswordUsuario() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null)
  const [form, setForm] = useState({
    passwordNueva: '',
    confirmarPasswordNueva: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getUsuarioById(id)
      .then(u => {
        if (!mounted) return
        setUsuario(u)
      })
      .catch(e => setError(e.message || 'No se pudo cargar el usuario'))
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [id])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.passwordNueva.trim()) return setError('La nueva contraseña es obligatoria')
    if (form.passwordNueva !== form.confirmarPasswordNueva) return setError('Las contraseñas no coinciden')

    try {
      setSubmitting(true)
      await updateUsuario({
        id: Number(id),
        passwordNueva: form.passwordNueva.trim(),
        confirmarPasswordNueva: form.confirmarPasswordNueva.trim(),
      })
      navigate('/usuarios') // volver al listado
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la contraseña')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">Cargando…</div>
  }

  return (
    <form onSubmit={onSubmit} className="p-6">
      <h2 className="text-lg font-semibold mb-4">Resetear contraseña</h2>

      {usuario && (
        <p className="mb-4 text-gray-700">Usuario: <strong>{usuario.userName}</strong></p>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="mb-4">
        <label className="block mb-1">Nueva contraseña</label>
        <input
          type="password"
          name="passwordNueva"
          value={form.passwordNueva}
          onChange={onChange}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Confirmar nueva contraseña</label>
        <input
          type="password"
          name="confirmarPasswordNueva"
          value={form.confirmarPasswordNueva}
          onChange={onChange}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex gap-2">
        <Link
          to="/usuarios"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-900 text-white px-4 py-2 rounded hover:bg-indigo-800 disabled:opacity-50"
        >
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
