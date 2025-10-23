import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOportunidadById } from "../../services/Oportunidades/getOportunidadById";
import { updateOportunidad } from "../../services/Oportunidades/updateOportunidad";
import { setOportunidadEstado } from "../../services/Oportunidades/setOportunidadEstado";
import { getEtapas } from "../../services/Etapas/getEtapas";

export default function ShowOportunidad() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [op, setOp] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const etapaActual = useMemo(() => etapas.find(e => e.id === Number(stage)), [stage, etapas]);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const [o, es] = await Promise.all([getOportunidadById(id), getEtapas()]);
      setOp(o);
      setEtapas(es.sort((a,b)=>a.orden-b.orden));
      setStage(String(o.etapaId));
    } catch (e) {
      setError(e.message || "No se pudo cargar la oportunidad");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [id]); // eslint-disable-line

  const onGuardarEtapa = async () => {
    if (!op) return;
    try {
      setSaving(true);
      await updateOportunidad({
        id: op.id,
        clienteId: op.clienteId,
        usuarioId: op.usuarioId,
        vehiculoId: op.vehiculoId,
        etapaId: Number(stage),
        activa: op.activa,
      });
      await cargar();
    } catch (e) {
      setError(e.message || "No se pudo actualizar la etapa");
    } finally {
      setSaving(false);
    }
  };

  const onToggleActiva = async () => {
    if (!op) return;
    try {
      setSaving(true);
      await setOportunidadEstado({ id: op.id, activa: !op.activa });
      await cargar();
    } catch (e) {
      setError(e.message || "No se pudo actualizar el estado");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-600">Cargando…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Oportunidad #{op?.id}</h2>
        <div className="flex gap-2">
          <button onClick={onToggleActiva} disabled={saving}
            className={`rounded-md px-3 py-2 text-sm font-semibold text-white ${op?.activa ? "bg-red-600 hover:bg-red-500" : "bg-green-600 hover:bg-green-500"} disabled:opacity-50`}>
            {op?.activa ? "Desactivar" : "Activar"}
          </button>
          <Link to="/oportunidades/kanban"
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
            Volver
          </Link>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}

      <div className="rounded-lg bg-white shadow ring-1 ring-gray-200 p-4 space-y-2">
        <div className="text-sm">Cliente ID: <strong>{op?.clienteId}</strong></div>
        <div className="text-sm">Vendedor ID: <strong>{op?.usuarioId}</strong></div>
        <div className="text-sm">Vehículo ID: <strong>{op?.vehiculoId}</strong></div>
        <div className="text-sm">Estado: <strong>{op?.activa ? "Activa" : "Inactiva"}</strong></div>
      </div>

      <div className="rounded-lg bg-white shadow ring-1 ring-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700">Etapa</label>
        <div className="mt-2 flex items-center gap-3">
          <select value={stage} onChange={e => setStage(e.target.value)}
            className="block rounded-md border-gray-300 text-sm">
            {etapas.map(e => <option key={e.id} value={e.id}>{e.orden}. {e.nombre}</option>)}
          </select>
          <button onClick={onGuardarEtapa} disabled={saving}
            className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50">
            {saving ? "Guardando…" : "Guardar etapa"}
          </button>
        </div>
        {etapaActual && <p className="mt-2 text-xs text-gray-500">Etapa seleccionada: {etapaActual.nombre}</p>}
      </div>
    </div>
  );
}
