import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getClienteById } from "../../services/Clientes/getClienteById";
import { updateCliente } from "../../services/Clientes/updateCliente";

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: "", nit: "", direccion: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setError(null);
    setLoading(true);
    getClienteById(id)
      .then((c) => {
        if (!mounted) return;
        setForm({
          nombre: c.nombre ?? "",
          nit: c.nit ?? "",
          direccion: c.direccion ?? "",
        });
      })
      .catch((e) => setError(e.message || "No se pudo cargar el cliente"))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre?.trim()) return setError("El nombre es obligatorio");
    if (!form.nit?.trim()) return setError("El NIT es obligatorio");
    if (!form.direccion?.trim()) return setError("La dirección es obligatoria");

    try {
      setSubmitting(true);
      await updateCliente({
        id,
        nombre: form.nombre.trim(),
        nit: form.nit.trim(),
        direccion: form.direccion.trim(),
      });
      navigate("/clientes");
    } catch (err) {
      setError(err.message || "No se pudo actualizar el cliente");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-600">Cargando…</div>;

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Editar Cliente</h2>

          {error && <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">{error}</div>}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="nombre" className="block text-sm/6 font-medium text-gray-900">Nombre</label>
              <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={onChange}
                required className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="nit" className="block text-sm/6 font-medium text-gray-900">NIT</label>
              <input id="nit" name="nit" type="text" value={form.nit} onChange={onChange}
                required className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
            </div>
            <div className="col-span-full">
              <label htmlFor="direccion" className="block text-sm/6 font-medium text-gray-900">Dirección</label>
              <textarea id="direccion" name="direccion" rows={3} value={form.direccion} onChange={onChange}
                required className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-2">
        <Link to="/clientes" className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">Cancelar</Link>
        <button type="submit" disabled={submitting}
          className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50">
          {submitting ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
