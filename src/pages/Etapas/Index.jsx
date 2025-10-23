import { useEffect, useState } from "react";
import { getEtapas } from "../../services/Etapas/getEtapas";
import { createEtapa } from "../../services/Etapas/createEtapa";
import { updateEtapa } from "../../services/Etapas/updateEtapa";
import { deleteEtapa } from "../../services/Etapas/deleteEtapa";

export default function Etapas() {
  const [etapas, setEtapas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [nueva, setNueva] = useState("");

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEtapas();
      setEtapas(data);
    } catch (e) {
      setError(e.message || "No se pudieron cargar las etapas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const renumerar = (arr) =>
    arr.map((e, i) => ({ ...e, orden: i + 1 }));

  const move = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= etapas.length) return;
    const copy = [...etapas];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setEtapas(renumerar(copy));
  };

  const onSaveOrder = async () => {
    try {
      setSaving(true);
      setError(null);
      // Guardamos TODOS los cambios de orden (funciona como "editar")
      await Promise.all(
        etapas.map((e) =>
          updateEtapa({ id: e.id, nombre: e.nombre, orden: e.orden })
        )
      );
    } catch (e) {
      setError(e.message || "No se pudo guardar el orden");
    } finally {
      setSaving(false);
    }
  };

  const onCreate = async (e) => {
    e.preventDefault();
    if (!nueva.trim()) return;
    try {
      setSaving(true);
      setError(null);
      const orden = etapas.length + 1;
      await createEtapa({ nombre: nueva.trim(), orden });
      setNueva("");
      await cargar();
    } catch (e2) {
      setError(e2.message || "No se pudo crear la etapa");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta etapa?")) return;
    try {
      setSaving(true);
      setError(null);
      await deleteEtapa(id);
      // Volvemos a cargar y luego persistimos el reorden
      const fresh = (await getEtapas()).sort((a, b) => a.orden - b.orden);
      const renum = renumerar(fresh);
      setEtapas(renum);
      // Persistir la renumeración para no dejar huecos
      await Promise.all(
        renum.map((e) => updateEtapa({ id: e.id, nombre: e.nombre, orden: e.orden }))
      );
    } catch (e) {
      setError(e.message || "No se pudo eliminar la etapa");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-base font-semibold text-gray-900">Etapas del embudo</h1>
      <p className="mt-2 text-sm text-gray-700">Solo admin. Reordena para cambiar el flujo.</p>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Crear nueva */}
      <form onSubmit={onCreate} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Nombre de la etapa"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        />
        <button
          type="submit"
          disabled={saving || loading}
          className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Crear
        </button>
      </form>

      {/* Lista */}
      <div className="mt-6 rounded-lg bg-white shadow-sm ring-1 ring-gray-200 divide-y divide-gray-200">
        {loading ? (
          <div className="px-4 py-3 text-sm text-gray-600">Cargando…</div>
        ) : etapas.length === 0 ? (
          <div className="px-4 py-8 text-sm text-gray-500 text-center">
            No hay etapas para mostrar.
          </div>
        ) : (
          etapas.map((e, i) => (
            <div key={e.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-700">
                  {e.orden}
                </span>
                <span className="text-sm font-medium text-gray-900">{e.nombre}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => move(i, -1)}
                  className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700 hover:bg-gray-200"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700 hover:bg-gray-200"
                >
                  ↓
                </button>
                <button
                  onClick={() => onDelete(e.id)}
                  disabled={saving}
                  className="rounded-md bg-red-600 px-2 py-1 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onSaveOrder}
          disabled={saving || loading || etapas.length === 0}
          className="rounded-md bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
