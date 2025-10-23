// src/pages/Facturas/Index.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFacturas } from "../../services/Facturas/getFacturas";

const currency = new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" });

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFacturas();
      setFacturas(data);
    } catch (e) {
      setError(e.message || "No se pudo cargar el listado de facturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Facturas</h1>
          <p className="mt-2 text-sm text-gray-700">Listado de facturas generadas desde cotizaciones.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex gap-2">
          <button
            onClick={cargar}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
          >
            Recargar
          </button>
          <Link
            to="/facturas/create"
            className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Crear factura
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-sm text-gray-600">Cargando…</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3 pr-3 pl-4 text-left text-xs font-medium tracking-wide text-gray-500 uppercase sm:pl-0">
                  ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Número
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Cotización
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {facturas.length ? (
                facturas.map((f) => (
                  <tr key={f.id}>
                    <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-0">{f.id}</td>
                    <td className="px-3 py-4 text-sm text-gray-900">{f.numero || "—"}</td>
                    <td className="px-3 py-4 text-sm text-gray-900">#{f.cotizacionId}</td>
                    <td className="px-3 py-4 text-sm text-gray-900">{currency.format(f.total ?? 0)}</td>
                    <td className="px-3 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                          (f.estado || "").toLowerCase() === "emitida"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {f.estado || "Borrador"}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm flex gap-2">
                      <Link
                        to={`/facturas/${f.id}`}
                        className="rounded-md bg-indigo-900 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-500"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-sm text-gray-500">
                    No hay facturas para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
