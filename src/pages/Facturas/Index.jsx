import { Link } from "react-router-dom"
const fakeFacturas = [
  { id: 1, numero: "F-0001", estado: true, total: 75000, cotizacion_id: 10 },
  { id: 2, numero: "F-0002", estado: false, total: 134000, cotizacion_id: 11 },
]
export default function Facturas() {
  const currency = new Intl.NumberFormat('es-GT', { style:'currency', currency:'GTQ' })
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Facturas</h1>
          <p className="mt-2 text-sm text-gray-700">Integración de facturación (demo).</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/facturas/create" className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Crear factura</Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-3 pr-3 pl-4 text-left text-xs font-medium tracking-wide text-gray-500 uppercase sm:pl-0">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Número</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Cotización</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Total</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Estado</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {fakeFacturas.map(f=>(
              <tr key={f.id}>
                <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-0">{f.id}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{f.numero}</td>
                <td className="px-3 py-4 text-sm text-gray-900">#{f.cotizacion_id}</td>
                <td className="px-3 py-4 text-sm text-gray-900">{currency.format(f.total)}</td>
                <td className="px-3 py-4 text-sm">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${f.estado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {f.estado ? "Emitida" : "Borrador"}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm flex gap-2">
                  <Link to={`/facturas/${f.id}`} className="rounded-md bg-indigo-900 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-500">Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
