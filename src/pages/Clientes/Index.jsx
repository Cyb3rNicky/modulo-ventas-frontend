import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClientes } from "../../services/Clientes/getClientes";
import { deleteCliente } from "../../services/Clientes/deleteCliente";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClientes();
      setClientes(data);
    } catch (e) {
      setError(e.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    try {
      setBusy(true);
      await deleteCliente(id);
      await cargar();
    } catch (e) {
      setError(e.message || "No se pudo eliminar el cliente");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Clientes</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/clientes/create"
            className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Crear cliente
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">{error}</div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-3 pr-3 pl-4 text-left text-xs font-medium tracking-wide text-gray-500 uppercase sm:pl-0">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Nombre</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">NIT</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Dirección</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-500">Cargando…</td></tr>
            ) : clientes.length > 0 ? (
              clientes.map(c => (
                <tr key={c.id}>
                  <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-0">{c.id}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{c.nombre}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{c.nit}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{c.direccion}</td>
                  <td className="px-3 py-4 text-sm flex gap-2">
                    <Link to={`/clientes/edit/${c.id}`}
                      className="rounded-md bg-indigo-900 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-500">
                      Editar
                    </Link>
                    <button onClick={() => onDelete(c.id)} disabled={busy}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-3 py-10 text-center text-sm text-gray-500">No hay clientes para mostrar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
