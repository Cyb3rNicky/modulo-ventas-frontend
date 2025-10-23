import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCotizacionById } from "../../services/Cotizaciones/getCotizacionById";
import { getItemsByCotizacionId } from "../../services/CotizacionItems/getItemsByCotizacionId";

// Formateador simple a Quetzales
const fmtQ = (n) =>
  `Q${Number(n || 0).toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function ShowCotizacion() {
  const { id } = useParams();
  const [coti, setCoti] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [c, its] = await Promise.all([
          getCotizacionById(id),
          getItemsByCotizacionId(id),
        ]);
        setCoti(c);
        setItems(its);
      } catch (e) {
        setError(e.message || "No se pudo cargar la cotización");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const resumen = useMemo(() => {
    const subtotal = items.reduce(
      (acc, it) => acc + it.cantidad * it.precioUnitario,
      0
    );
    const desc = items.reduce((acc, it) => acc + (it.descuento || 0), 0);
    const total = subtotal - desc; // el total guardado puede incluir desc. global; aquí mostramos la suma de ítems
    return { subtotal, desc, total };
  }, [items]);

  if (loading) return <div className="p-6 text-sm text-gray-600">Cargando…</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">
            Cotización #{coti?.id}
          </h1>
          <p className="mt-1 text-sm text-gray-700">
            Oportunidad: #{coti?.oportunidadId} —{" "}
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                coti?.activa
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {coti?.activa ? "Activa" : "Inactiva"}
            </span>
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to={`/cotizaciones/edit/${coti?.id}`}
            className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Editar
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-2 pr-3 pl-4 text-left text-xs font-medium text-gray-500 uppercase sm:pl-0">
                Vehículo
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Descripción
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Cantidad
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Precio unitario
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Descuento
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.length ? (
              items.map((it) => (
                <tr key={it.id}>
                  <td className="py-3 pr-3 pl-4 sm:pl-0 text-sm">
                    {it.vehiculoId}
                  </td>
                  <td className="px-3 py-3 text-sm">{it.descripcion}</td>
                  <td className="px-3 py-3 text-sm">{it.cantidad}</td>
                  <td className="px-3 py-3 text-sm">{fmtQ(it.precioUnitario)}</td>
                  <td className="px-3 py-3 text-sm">- {fmtQ(it.descuento || 0)}</td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">
                    {fmtQ(it.cantidad * it.precioUnitario - (it.descuento || 0))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-10 text-center text-sm text-gray-500"
                >
                  Sin ítems.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex flex-col items-end gap-1">
          <div className="text-sm text-gray-600">
            Subtotal:{" "}
            <span className="font-semibold text-gray-900">
              {fmtQ(resumen.subtotal)}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Descuentos:{" "}
            <span className="font-semibold text-gray-900">
              - {fmtQ(resumen.desc)}
            </span>
          </div>
          <div className="text-base font-semibold text-gray-900">
            Total (items): {fmtQ(resumen.total)}
          </div>
          {typeof coti?.total === "number" && (
            <div className="text-sm text-gray-500">
              Total guardado: {fmtQ(coti.total)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
