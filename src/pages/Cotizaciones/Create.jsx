import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"

const fakeOportunidades = [
  { id: 101, cliente: { id: 1, nombre: "ACME S.A.", nit: "1234567-8" } },
  { id: 102, cliente: { id: 2, nombre: "Beta Ltd.", nit: "222222-3" } },
]

const fakeVehiculos = [
  { id: 1, marca: "Toyota", modelo: "Yaris", anio: "2022", precio: 75000 },
  { id: 2, marca: "Kia", modelo: "Rio", anio: "2023", precio: 68000 },
  { id: 3, marca: "Hyundai", modelo: "Tucson", anio: "2024", precio: 165000 },
]

export default function CreateCotizacion() {
  const { oportunidadId } = useParams()
  const [oportunidad, setOportunidad] = useState(
    oportunidadId ? fakeOportunidades.find(o => String(o.id) === String(oportunidadId)) : null
  )
  const [items, setItems] = useState([])
  const [estado, setEstado] = useState(true)

  const currency = new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ", maximumFractionDigits: 2 })

  const totales = useMemo(() => {
    const subtotal = items.reduce((acc, it) => acc + (it.cantidad * it.precio_unitario), 0)
    const desc = items.reduce((acc, it) => acc + (it.descuento || 0), 0)
    const total = items.reduce((acc, it) => acc + (it.cantidad * it.precio_unitario) - (it.descuento || 0), 0)
    return { subtotal, desc, total }
  }, [items])

  const addItem = () => {
    const vehiculo = fakeVehiculos[0]
    setItems(prev => [...prev, {
      id: Date.now(), vehiculo_id: vehiculo.id,
      descripcion: `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`,
      cantidad: 1, precio_unitario: vehiculo.precio, descuento: 0
    }])
  }

  const updateItem = (id, patch) => setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it))
  const removeItem = (id) => setItems(prev => prev.filter(it => it.id !== id))

  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: POST /api/cotizaciones
    alert("Cotización creada (demo). Datos se muestran en consola.")
    console.log({
      oportunidad_id: oportunidad?.id ?? null,
      estado, total: totales.total,
      items: items.map(({id, ...rest}) => rest)
    })
  }

  return (
    <form onSubmit={onSubmit} className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Crear cotización</h1>
          <p className="mt-2 text-sm text-gray-700">Asocia una oportunidad y agrega ítems con precios y descuentos.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/cotizaciones" className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200">
            Volver
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Oportunidad</label>
              <select value={oportunidad?.id || ""} onChange={(e)=>{
                const op = fakeOportunidades.find(o=>String(o.id)===e.target.value) || null
                setOportunidad(op)
              }} className="mt-1 block w-full rounded-md border-gray-300">
                <option value="">— Seleccione —</option>
                {fakeOportunidades.map(o => (
                  <option key={o.id} value={o.id}>#{o.id} — {o.cliente.nombre}</option>
                ))}
              </select>
              {oportunidad && (
                <p className="mt-2 text-xs text-gray-600">Cliente: {oportunidad.cliente.nombre} | NIT: {oportunidad.cliente.nit}</p>
              )}
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select value={estado ? "1" : "0"} onChange={(e)=>setEstado(e.target.value==="1")} className="mt-1 block w-full rounded-md border-gray-300">
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
                <th className="py-2 pr-3 pl-4 text-left text-xs font-medium tracking-wide text-gray-500 uppercase sm:pl-0">Vehículo</th>
                <th className="px-3 py-2 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Descripción</th>
                <th className="px-3 py-2 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Cantidad</th>
                <th className="px-3 py-2 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Precio unitario</th>
                <th className="px-3 py-2 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Descuento</th>
                <th className="px-3 py-2 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Total</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {items.length ? items.map(it => (
                <tr key={it.id}>
                  <td className="py-3 pr-3 pl-4 sm:pl-0">
                    <select value={it.vehiculo_id} onChange={(e)=>{
                      const v = fakeVehiculos.find(v=>String(v.id)===e.target.value)
                      updateItem(it.id, {
                        vehiculo_id: v.id,
                        descripcion: `${v.marca} ${v.modelo} ${v.anio}`,
                        precio_unitario: v.precio
                      })
                    }} className="block w-44 rounded-md border-gray-300">
                      {fakeVehiculos.map(v=>(
                        <option key={v.id} value={v.id}>{v.marca} {v.modelo}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <input value={it.descripcion} onChange={(e)=>updateItem(it.id,{descripcion:e.target.value})}
                           className="block w-72 rounded-md border-gray-300"/>
                  </td>
                  <td className="px-3 py-3">
                    <input type="number" min={1} value={it.cantidad} onChange={(e)=>updateItem(it.id,{cantidad:Number(e.target.value)})}
                           className="block w-24 rounded-md border-gray-300"/>
                  </td>
                  <td className="px-3 py-3">
                    <input type="number" min={0} value={it.precio_unitario} onChange={(e)=>updateItem(it.id,{precio_unitario:Number(e.target.value)})}
                           className="block w-28 rounded-md border-gray-300"/>
                  </td>
                  <td className="px-3 py-3">
                    <input type="number" min={0} value={it.descuento} onChange={(e)=>updateItem(it.id,{descuento:Number(e.target.value)})}
                           className="block w-24 rounded-md border-gray-300"/>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">
                    {currency.format(it.cantidad * it.precio_unitario - (it.descuento || 0))}
                  </td>
                  <td className="px-3 py-3">
                    <button type="button" onClick={()=>removeItem(it.id)} className="text-sm text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-3 py-10 text-center text-sm text-gray-500">Agrega ítems para calcular la cotización.</td></tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex flex-col items-end gap-1">
            <div className="text-sm text-gray-600">Subtotal: <span className="font-semibold text-gray-900">{currency.format(totales.subtotal)}</span></div>
            <div className="text-sm text-gray-600">Descuentos: <span className="font-semibold text-gray-900">- {currency.format(totales.desc)}</span></div>
            <div className="text-base font-semibold text-gray-900">Total: {currency.format(totales.total)}</div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="rounded-md bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Guardar cotización (demo)
          </button>
        </div>
      </div>
    </form>
  )
}
