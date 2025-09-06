import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUsuario } from '../../services/Usuarios/createUsuarios'

export default function CrearUsuario() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    userName: '',
    email: '',
    nombre: '',
    apellido: '',
    password: '',
    role: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validaciones rápidas
    if (!form.usuario?.trim()) return setError('El usuario es obligatorio')
    if (!form.email?.trim()) return setError('El e-mail es obligatorio')
    if (!form.nombre?.trim()) return setError('El nombre es obligatorio')
    if (!form.apellido?.trim()) return setError('El apellido es obligatorio')
    if (!form.password?.trim()) return setError('La constraseña es obligatoria')
    if (!form.role?.trim()) return setError('El role es obligatorio')

    

    try {
      setSubmitting(true)
      await createUsuario({
        userName: form.usuario.trim(),
        email: form.email.trim(),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        password: form.password.trim(),
        role: form.role.trim(),
      })
      // listo: volver al listado
      navigate('/usuarios')
    } catch (err) {
      setError(err.message || 'No se pudo crear el usuario')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Crear Usuario</h2>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            {/* Usuario */}
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-900">
                Usuario
              </label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                value={form.usuario}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 sm:text-sm"
                placeholder="Gorge"
              />
            </div>

            <div className="col-col-full">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <textarea
                  id="email"
                  name="email"
                  type= "text"
                  value={form.email}
                  onChange={onChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
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
                  placeholder="Carlos"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="apellido" className="block text-sm/6 font-medium text-gray-900">
                Apellido
              </label>
              <div className="mt-2">
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={form.apellido}
                  onChange={onChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Perez"
                />
              </div>
            </div>
              <div className="sm:col-span-3">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="password"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="role" className="block text-sm/6 font-medium text-gray-900">
                  Role
                </label>
                <div className="mt-2">
                  <input
                    id="role"
                    name="role"
                    type="text"
                    value={form.role}
                    onChange={onChange}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="admin o vendedor"
                  />
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-2">
        <Link
          to="/usuarios"
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
