// src/pages/Facturas/Create.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createFactura } from "../../services/Facturas/createFactura";
import { getCotizacionById } from "../../services/Cotizaciones/getCotizacionById";
import { getItemsByCotizacionId } from "../../services/CotizacionItems/getItemsByCotizacionId";
// Si no tienes este servicio, puedes omitir el selector y solo soportar la ruta con :cotizacionId
import { getFacturas } from "../../services/Facturas/getFacturas"; // no se usa, solo ejemplo de import
import { getOportunidades } from "../../services/Oportunidades/getOportunidades"; // para mostrar cliente opcional
import { getCotizaciones } from "../../services/Cotizaciones/getCotizaciones"; // si ya lo tienes

const currency = new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ", maximumFractionDigits: 2 });

export default function CreateFactura() {
  const { cotizacionId } = useParams();
  const navigate = useNavigate();

  const [listCoti, setListCoti] = useState([]); // opcional
  const [selectedCotiId, setSelectedCotiId] = useState(cotizacionId || "");
  const [coti, setCoti] = useState(null);
  const [items, setItems] = useState([]);

  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState("Emitida"); // "Emitida" | "Borrador" (depende de tu backend)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Cargar lista de cotizaciones (si quieres permitir elegir)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!cotizacionId && getCotizaciones) {
          const all = await getCotizaciones();
          setListCoti(all);
        }
      } catch (e) {
        // no crítico
      } finally {
        setLoading(false);
      }
    })();
  }, [cotizacionId]);

  // Cargar cotización seleccionada + ítems
  useEffect(() => {
    if (!selectedCotiId) return;
    (async () => {
      try {
        setLoading(true);
        const [c, its] = await Promise.all([
          getCotizacionById(selectedCotiId),
          getItemsByCotizacionId(selectedCotiId),
        ]);
        setCoti(c);
        setItems(its);
      } catch (e) {
        setError(e.message || "No se pudo cargar la cotización");
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedCotiId]);

  const total = useMemo(() => {
    const subtotal = items.reduce((acc, it) => acc + it.cantidad * it.precioUnitario, 0);
    const desc = items.reduce((acc, it) => acc + (Number(it.descuento) || 0), 0);
    return Math.max(0, subtotal - desc);
  }, [items]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!selectedCotiId) return setError("Selecciona una cotización");

    try {
      setSubmitting(true);
      const created = await createFactura({
        cotizacionId: Number(selectedCotiId),
        numero: numero || `F-${Date.now()}`, // simple fallback
        estado,
        total,
      });
      const id = created?.id ?? created?.data?.id;
      navigate(`/facturas/${id}`);
    } catch (err) {
      setError(err.message || "No se pudo crear la factura");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !coti && !listCoti.length) {
    return <div className="p-6 text-sm text-gray-600">Cargando…</div>;
  }

  return (
    <form onSubmit={onSubmit} className="px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Crear factura</h1>
          <p className="mt-2 text-sm text-gray-700">La factura se genera a partir de una cotización.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/facturas" className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200">Volver</Link>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {!cotizacionId && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Cotización</label>
              <select
                value={selectedCotiId}
                onChange={(e)=>setSelectedCotiId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="">— Selecciona —</option>
                {listCoti.map(ct => (
                  <option key={ct.id} value={ct.id}>#{ct.id} — Total: {currency.format(ct.total ?? 0)}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Número</label>
            <input
              value={numero}
              onChange={(e)=>setNumero(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
              placeholder="F-0001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select value={estado} onChange={(e)=>setEstado(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300">
              <option value="Emitida">Emitida</option>
              <option value="Borrador">Borrador</option>
              {/* agrega más estados válidos si tu API los usa */}
            </select>
          </div>
        </div>

        {coti && (
          <p className="mt-3 text-xs text-gray-600">
            Cotización #{coti.id} — Oportunidad #{coti.oportunidadId} — Total calculado: <strong>{currency.format(total)}</strong>
          </p>
        )}
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 p-4 overflow-x-auto">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">Ítems de la cotización</h2>
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-2 pr-3 pl-4 text-left text-xs font-medium text-gray-500 uppercase sm:pl-0">Vehículo</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cant.</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">P. Unitario</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Desc.</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.length ? items.map(it => (
              <tr key={it.id}>
                <td className="py-3 pr-3 pl-4 sm:pl-0 text-sm">{it.vehiculoId}</td>
                <td className="px-3 py-3 text-sm">{it.descripcion}</td>
                <td className="px-3 py-3 text-sm">{it.cantidad}</td>
                <td className="px-3 py-3 text-sm">{currency.format(it.precioUnitario)}</td>
                <td className="px-3 py-3 text-sm">- {currency.format(it.descuento || 0)}</td>
                <td className="px-3 py-3 text-sm font-medium text-gray-900">
                  {currency.format(it.cantidad * it.precioUnitario - (it.descuento || 0))}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="px-3 py-10 text-center text-sm text-gray-500">Selecciona una cotización para ver sus ítems.</td></tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end text-sm text-gray-700">
          <div className="font-semibold">Total a facturar: {currency.format(total)}</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !selectedCotiId}
          className="rounded-md bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? "Guardando…" : "Crear factura"}
        </button>
      </div>
    </form>
  );
}
