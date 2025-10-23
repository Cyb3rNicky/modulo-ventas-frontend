// src/pages/Facturas/Show.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFacturaById } from "../../services/Facturas/getFacturaById";
import { getCotizacionById } from "../../services/Cotizaciones/getCotizacionById";
import { getItemsByCotizacionId } from "../../services/CotizacionItems/getItemsByCotizacionId";

const currency = new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ", maximumFractionDigits: 2 });

export default function ShowFactura() {
  const { id } = useParams();
  const [fac, setFac] = useState(null);
  const [coti, setCoti] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const f = await getFacturaById(id);
        setFac(f);
        const [c, its] = await Promise.all([
          getCotizacionById(f.cotizacionId),
          getItemsByCotizacionId(f.cotizacionId),
        ]);
        setCoti(c);
        setItems(its);
      } catch (e) {
        setError(e.message || "No se pudo cargar la factura");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const totales = useMemo(() => {
    const subtotal = items.reduce((acc, it)=> acc + it.cantidad*it.precioUnitario, 0);
    const desc = items.reduce((acc, it)=> acc + (it.descuento || 0), 0);
    const total = Math.max(0, subtotal - desc);
    return { subtotal, desc, total };
  }, [items]);

  const onPrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.open();
    w.document.write(`
      <html>
        <head>
          <title>Factura ${fac?.numero || ""}</title>
          <style>
            body{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial; padding: 24px; color:#111827;}
            h1,h2,h3{ margin:0; }
            .muted{ color:#6B7280; }
            table{ width:100%; border-collapse: collapse; }
            th, td{ border-bottom:1px solid #E5E7EB; padding:8px; text-align:left; }
            .totals{ text-align:right; margin-top:12px; }
            .badge{ display:inline-block; padding:2px 8px; border-radius:999px; font-size:12px; }
            .emitida{ background:#DCFCE7; color:#166534; }
            .borrador{ background:#F3F4F6; color:#374151; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
    // w.close(); // (deja la ventana abierta por si el usuario quiere guardar manual)
  };

  if (loading) return <div className="p-6 text-sm text-gray-600">Cargando…</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Factura #{fac?.id}</h1>
          <p className="mt-1 text-sm text-gray-700">
            Número: <strong>{fac?.numero}</strong> — Estado:{" "}
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${fac?.estado === "Emitida" ? "bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>
              {fac?.estado}
            </span>
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex gap-2">
          <button onClick={onPrint} className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Imprimir / PDF
          </button>
          <Link to="/facturas" className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200">
            Volver
          </Link>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}

      {/* Contenido imprimible */}
      <div ref={printRef} className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Factura {fac?.numero}</h2>
            <p className="text-sm text-gray-600">ID: {fac?.id}</p>
            <p className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString()}</p>
            <p className="text-xs text-gray-400">Documento generado desde el sistema</p>
          </div>
          <div className="text-right">
            <div className={`badge ${fac?.estado === "Emitida" ? "bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>{fac?.estado}</div>
            <div className="mt-2 text-sm text-gray-600">Cotización #{coti?.id}</div>
            <div className="text-sm text-gray-600">Oportunidad #{coti?.oportunidadId}</div>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        <table>
          <thead>
            <tr>
              <th>Vehículo</th>
              <th>Descripción</th>
              <th>Cant.</th>
              <th>Precio unitario</th>
              <th>Descuento</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? items.map(it => (
              <tr key={it.id}>
                <td>{it.vehiculoId}</td>
                <td>{it.descripcion}</td>
                <td>{it.cantidad}</td>
                <td>{currency.format(it.precioUnitario)}</td>
                <td>- {currency.format(it.descuento || 0)}</td>
                <td><strong>{currency.format(it.cantidad * it.precioUnitario - (it.descuento || 0))}</strong></td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="text-center text-sm text-gray-500 py-6">Sin ítems.</td></tr>
            )}
          </tbody>
        </table>

        <div className="totals">
          <div>Subtotal: <strong>{currency.format(totales.subtotal)}</strong></div>
          <div>Descuentos: <strong>- {currency.format(totales.desc)}</strong></div>
          <div style={{ fontSize: 18, marginTop: 6 }}>Total: <strong>{currency.format(totales.total)}</strong></div>
          {typeof fac?.total === "number" && (
            <div className="muted" style={{ marginTop: 4 }}>
              Total (guardado): {currency.format(fac.total)}
            </div>
          )}
        </div>

        <hr className="my-4 border-gray-200" />
        <p className="text-xs muted">Gracias por su compra.</p>
      </div>
    </div>
  );
}
