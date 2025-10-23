import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCotizaciones } from "../../services/Cotizaciones/getCotizaciones";
import { deleteCotizacion } from "../../services/Cotizaciones/deleteCotizacion";

const currency = new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" });

export default function Cotizaciones() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const cs = await getCotizaciones();
      setRows(cs);
    } catch (e) {
      setError(e.message || "No se pudieron cargar cotizaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta cotización?")) return;
    try {
      await deleteCotizacion(id);
      cargar();
    } catch (e) {
      setError(e.message || "No se pudo eliminar la cotización");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Cotizaciones</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/cotizaciones/create" className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Crear cotización
          </Link>
        </div>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}
      {loading ? (
        <div className="mt-6 text-sm text-gray-600">Cargando…</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase sm:pl-0">ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oportunidad</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rows.length ? rows.map(r => (
                <tr key={r.id}>
                  <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{r.id}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">#{r.oportunidadId}</td>
                  <td className="px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${r.activa ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {r.activa ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">{currency.format(r.total)}</td>
                  <td className="px-3 py-4 text-sm flex gap-2">
                    <Link to={`/cotizaciones/${r.id}`} className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50">Ver</Link>
                    <Link to={`/cotizaciones/edit/${r.id}`} className="rounded-md bg-indigo-900 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-500">Editar</Link>
                    <button onClick={() => onDelete(r.id)} className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-500">
                      Eliminar
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-3 py-10 text-center text-sm text-gray-500">No hay cotizaciones para mostrar.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
