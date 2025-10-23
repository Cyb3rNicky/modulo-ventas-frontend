import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCotizacionById } from "../../services/Cotizaciones/getCotizacionById";
import { updateCotizacionEstado } from "../../services/Cotizaciones/updateCotizacionEstado";
import { getItemsByCotizacionId } from "../../services/CotizacionItems/getItemsByCotizacionId";
import { getVehiculos } from "../../services/Vehiculos/getVehiculos";
import { createItem } from "../../services/CotizacionItems/createItem";
import { updateItem } from "../../services/CotizacionItems/updateItem";
import { deleteItem } from "../../services/CotizacionItems/deleteItem";

const currency = new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ", maximumFractionDigits: 2 });
const toNumber = (v) => {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export default function EditCotizacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cotizacion, setCotizacion] = useState(null);
  const [activa, setActiva] = useState(true);
  const [vehiculos, setVehiculos] = useState([]);
  const [items, setItems] = useState([]); // descuento como string

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [c, its, vhs] = await Promise.all([getCotizacionById(id), getItemsByCotizacionId(id), getVehiculos()]);
        setCotizacion(c);
        setActiva(!!c.activa);
        setItems(its.map((x) => ({ ...x, _tmp: false, descuento: String(x.descuento ?? "") })));
        setVehiculos(vhs);
      } catch (e) {
        setError(e.message || "No se pudo cargar la cotización");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const addItem = () => {
    if (!vehiculos.length) return;
    const v = vehiculos[0];
    setItems((prev) => [
      ...prev,
      {
        id: `tmp-${Date.now()}`,
        _tmp: true,
        vehiculoId: v.id,
        descripcion: `${v.marca} ${v.modelo} (${v.anio})`,
        cantidad: 1,
        precioUnitario: toNumber(v.precio),
        descuento: "", // string
      },
    ]);
  };

  const updateRow = (rowId, patch) => setItems((prev) => prev.map((it) => (it.id === rowId ? { ...it, ...patch } : it)));
  const removeRow = (rowId) => setItems((prev) => prev.filter((it) => it.id !== rowId));

  // Totales: solo descuentos por ítem
  const totales = useMemo(() => {
    const subtotal = items.reduce((acc, it) => acc + it.cantidad * it.precioUnitario, 0);
    const descItems = items.reduce((acc, it) => acc + toNumber(it.descuento), 0);
    const total = Math.max(0, subtotal - descItems);
    return { subtotal, descItems, total };
  }, [items]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setSaving(true);

      const creates = items.filter((it) => it._tmp === true);
      const updates = items.filter((it) => it._tmp !== true);

      await Promise.all([
        ...creates.map((it) =>
          createItem({
            cotizacionId: Number(id),
            vehiculoId: Number(it.vehiculoId),
            descripcion: it.descripcion,
            cantidad: Number(it.cantidad),
            precioUnitario: Number(it.precioUnitario),
            descuento: toNumber(it.descuento),
          })
        ),
        ...updates.map((it) =>
          updateItem({
            id: it.id,
            vehiculoId: Number(it.vehiculoId),
            descripcion: it.descripcion,
            cantidad: Number(it.cantidad),
            precioUnitario: Number(it.precioUnitario),
            descuento: toNumber(it.descuento),
          })
        ),
      ]);

      // Actualizamos estado y total (sin descuento global)
      await updateCotizacionEstado({ id: Number(id), activa, total: totales.total });

      navigate(`/cotizaciones/${id}`);
    } catch (err) {
      setError(err.message || "No se pudo guardar la cotización");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteItem = async (itemId) => {
    if (String(itemId).startsWith("tmp-")) {
      removeRow(itemId);
      return;
    }
    if (!window.confirm("¿Eliminar ítem?")) return;
    try {
      await deleteItem(itemId);
      removeRow(itemId);
    } catch (e) {
      setError(e.message || "No se pudo eliminar el ítem");
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-600">Cargando…</div>;

  return (
    <form onSubmit={onSubmit} className="px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Editar cotización #{cotizacion?.id}</h1>
          <p className="mt-2 text-sm text-gray-700">Oportunidad #{cotizacion?.oportunidadId}</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to={`/cotizaciones/${id}`} className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200">
            Volver
          </Link>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select value={activa ? "1" : "0"} onChange={(e) => setActiva(e.target.value === "1")} className="mt-1 block w-full rounded-md border-gray-300">
              <option value="1">Activa</option>
              <option value="0">Inactiva</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 p-4 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Ítems</h2>
          <button type="button" onClick={addItem} className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Agregar ítem
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-2 pr-3 pl-4 text-left text-xs font-medium text-gray-500 uppercase sm:pl-0">Vehículo</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio unitario</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descuento</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.length ? (
              items.map((it) => (
                <tr key={it.id}>
                  <td className="py-3 pr-3 pl-4 sm:pl-0">
                    <select
                      value={it.vehiculoId}
                      onChange={(e) => {
                        const v = vehiculos.find((v) => String(v.id) === e.target.value);
                        updateRow(it.id, {
                          vehiculoId: v.id,
                          descripcion: `${v.marca} ${v.modelo} (${v.anio})`,
                          precioUnitario: toNumber(v.precio),
                        });
                      }}
                      className="block w-44 rounded-md border-gray-300"
                    >
                      {vehiculos.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.marca} {v.modelo}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <input value={it.descripcion} onChange={(e) => updateRow(it.id, { descripcion: e.target.value })} className="block w-72 rounded-md border-gray-300" />
                  </td>
                  <td className="px-3 py-3">
                    <input type="number" min={1} value={it.cantidad} onChange={(e) => updateRow(it.id, { cantidad: toNumber(e.target.value) || 1 })} className="block w-24 rounded-md border-gray-300" />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      value={it.precioUnitario}
                      onChange={(e) => updateRow(it.id, { precioUnitario: toNumber(e.target.value) })}
                      className="block w-28 rounded-md border-gray-300"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      value={it.descuento} // string
                      onChange={(e) => updateRow(it.id, { descuento: e.target.value })}
                      className="block w-24 rounded-md border-gray-300"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">
                    {currency.format(it.cantidad * it.precioUnitario - toNumber(it.descuento))}
                  </td>
                  <td className="px-3 py-3">
                    <button type="button" onClick={() => onDeleteItem(it.id)} className="text-sm text-red-600 hover:underline">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-gray-500">
                  Sin ítems.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex flex-col items-end gap-1">
          <div className="text-sm text-gray-600">
            Subtotal: <span className="font-semibold text-gray-900">{currency.format(totales.subtotal)}</span>
          </div>
          <div className="text-sm text-gray-600">
            Descuentos (ítems): <span className="font-semibold text-gray-900">- {currency.format(totales.descItems)}</span>
          </div>
          <div className="text-base font-semibold text-gray-900">Total: {currency.format(totales.total)}</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="rounded-md bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
