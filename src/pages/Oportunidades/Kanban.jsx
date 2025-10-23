import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getEtapas } from "../../services/Etapas/getEtapas";
import { getOportunidades } from "../../services/Oportunidades/getOportunidades";
import { getOportunidadById } from "../../services/Oportunidades/getOportunidadById";
import { updateOportunidad } from "../../services/Oportunidades/updateOportunidad";

const currency = new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" });

export default function Kanban() {
  const [etapas, setEtapas] = useState([]);
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ets, ops] = await Promise.all([getEtapas(), getOportunidades()]);
      setEtapas(ets.sort((a, b) => a.orden - b.orden));
      setOportunidades(ops);
    } catch (e) {
      setError(e.message || "No se pudo cargar el embudo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const porEtapa = useMemo(() => {
    const m = Object.fromEntries(etapas.map(e => [e.id, []]));
    for (const o of oportunidades) {
      if (!o.activa) continue;
      if (!o.etapaId || !m[o.etapaId]) continue;
      m[o.etapaId].push(o);
    }
    return m;
  }, [oportunidades, etapas]);

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", String(id));
  };

  const onDrop = async (e, etapaIdDestino) => {
    const id = Number(e.dataTransfer.getData("text/plain"));
    const prev = oportunidades;

    // 1) Optimistic UI
    const next = oportunidades.map(o => (o.id === id ? { ...o, etapaId: etapaIdDestino } : o));
    setOportunidades(next);

    // 2) Persistir con DTO completo
    try {
      setSaving(true);

      // Traemos los ids reales desde el backend
      const full = await getOportunidadById(id);
      if (!full?.clienteId || !full?.usuarioId || !full?.vehiculoId) {
        throw new Error("Información incompleta para actualizar (ids faltantes)");
      }

      await updateOportunidad({
        id: full.id,
        clienteId: full.clienteId,
        usuarioId: full.usuarioId,
        vehiculoId: full.vehiculoId,
        etapaId: etapaIdDestino,
        activa: full.activa,
      });
    } catch (e2) {
      setOportunidades(prev); // rollback
      setError(e2.message || "No se pudo actualizar la etapa");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Embudo de oportunidades</h1>
          <p className="mt-2 text-sm text-gray-700">
            Arrastra tarjetas entre columnas para moverlas de etapa.
            {saving && <span className="ml-2 text-xs text-indigo-700">Guardando cambios…</span>}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/oportunidades/create"
            className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Crear oportunidad
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
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {etapas.map(et => (
            <div
              key={et.id}
              onDragOver={e => e.preventDefault()}
              onDrop={e => onDrop(e, et.id)}
              className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 flex flex-col"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center justify-between">
                  {et.orden}. {et.nombre}
                  <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {porEtapa[et.id]?.length || 0}
                  </span>
                </h3>
              </div>

              <div className="p-3 space-y-3 min-h-40">
                {porEtapa[et.id]?.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={e => onDragStart(e, card.id)}
                    className="rounded-md border border-gray-200 p-3 hover:border-indigo-300 cursor-grab active:cursor-grabbing"
                  >
                    <div className="text-sm font-medium text-gray-900">{card.clienteLabel}</div>
                    <div className="text-xs text-gray-600">{card.vehiculoLabel}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-700">{card.total ? currency.format(card.total) : ""}</span>
                      <span className="text-xs text-gray-500">Asesor: {card.asesorLabel}</span>
                    </div>
                    <div className="mt-2">
                      <Link to={`/oportunidades/${card.id}`} className="text-xs font-semibold text-indigo-700 hover:underline">
                        Ver
                      </Link>
                    </div>
                  </div>
                ))}
                {!porEtapa[et.id]?.length && <div className="text-xs text-gray-400 text-center py-6">Sin oportunidades</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
