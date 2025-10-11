import { Link } from "react-router-dom"

const fakeClientes = [
  { id: 1, nombre: "ACME S.A.", email:"ventas@acme.com", telefono:"5555-1111", direccion:"Zona 10" },
  { id: 2, nombre: "Beta Ltd.", email:"contacto@beta.com", telefono:"5555-2222", direccion:"Zona 4" },
]

export default function Clientes() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Clientes</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/clientes/create" className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Crear cliente</Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-3 pr-3 pl-4 text-left text-xs font-medium tracking-wide text-gray-500 uppercase sm:pl-0">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Nombre</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Email</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Teléfono</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Dirección</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {fakeClientes.map(c=>(
              <tr key={c.id}>
                <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-0">{c.id}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{c.nombre}</td>
                <td className="px-3 py-4 text-sm text-gray-700">{c.email}</td>
                <td className="px-3 py-4 text-sm text-gray-700">{c.telefono}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{c.direccion}</td>
                <td className="px-3 py-4 text-sm flex gap-2">
                  <Link to={`/clientes/edit/${c.id}`} className="rounded-md bg-indigo-900 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-500">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
