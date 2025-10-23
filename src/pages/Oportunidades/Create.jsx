import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getClientes } from "../../services/Clientes/getClientes";
import { getVehiculos } from "../../services/Vehiculos/getVehiculos";
import { getEtapas } from "../../services/Etapas/getEtapas";
import { createOportunidad } from "../../services/Oportunidades/createOportunidad";
import { getAuth, isAdmin } from "../../utils/auth";

export default function CrearOportunidad() {
  const navigate = useNavigate();
  const current = getAuth()?.user;
  const admin = isAdmin();

  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [form, setForm] = useState({
    clienteId: "",
    usuarioId: current?.id || "",
    vehiculoId: "",
    etapaId: "",   // <- lo fijamos justo después de cargar etapas
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [cs, vs, esRaw] = await Promise.all([getClientes(), getVehiculos(), getEtapas()]);
        const es = [...esRaw].sort((a, b) => a.orden - b.orden);
        const firstStageId = es[0]?.id ?? "";

        setClientes(cs);
        setVehiculos(vs);
        setEtapas(es);
        setForm(f => ({
          ...f,
          usuarioId: current?.id || "",
          etapaId: String(firstStageId), // 👈 fijamos aquí mismo
        }));
      } catch (e) {
        setError(e.message || "No se pudieron cargar datos");
      } finally {
        setLoading(false);
      }
    })();
  }, []); // eslint-disable-line

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.clienteId) return setError("Selecciona un cliente");
    if (!form.vehiculoId) return setError("Selecciona un vehículo");
    if (!form.usuarioId) return setError("Falta usuario asignado");
    if (!form.etapaId)   return setError("Selecciona una etapa");

    try {
      setSubmitting(true);
      await createOportunidad({
        clienteId: Number(form.clienteId),
        usuarioId: Number(form.usuarioId),
        vehiculoId: Number(form.vehiculoId),
        etapaId: Number(form.etapaId),
      });
      navigate("/oportunidades/kanban");
    } catch (err) {
      setError(err.message || "No se pudo crear la oportunidad");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-600">Cargando…</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-base font-semibold text-gray-900">Crear oportunidad</h2>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente</label>
          <select name="clienteId" value={form.clienteId} onChange={onChange}
            className="mt-2 block w-full rounded-md border-gray-300 text-sm">
            <option value="">— Selecciona —</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} (NIT {c.nit})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vehículo</label>
          <select name="vehiculoId" value={form.vehiculoId} onChange={onChange}
            className="mt-2 block w-full rounded-md border-gray-300 text-sm">
            <option value="">— Selecciona —</option>
            {vehiculos.map(v => <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.anio})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vendedor</label>
          <input
            name="usuarioId"
            value={form.usuarioId}
            onChange={onChange}
            disabled={!admin}
            className="mt-2 block w-full rounded-md border-gray-300 text-sm"
          />
          {!admin && <p className="mt-1 text-xs text-gray-500">Se asigna al usuario actual.</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Etapa inicial</label>
          <select name="etapaId" value={form.etapaId} onChange={onChange}
            className="mt-2 block w-full rounded-md border-gray-300 text-sm">
            {etapas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Link to="/oportunidades/kanban" className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">
          Cancelar
        </Link>
        <button type="submit" disabled={submitting}
          className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50">
          {submitting ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
