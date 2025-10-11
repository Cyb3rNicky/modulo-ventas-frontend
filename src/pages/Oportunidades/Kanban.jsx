import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

const fakeEtapas = [
  { id: 1, nombre: "Prospección", orden: 1 },
  { id: 2, nombre: "Calificación", orden: 2 },
  { id: 3, nombre: "Propuesta", orden: 3 },
  { id: 4, nombre: "Negociación", orden: 4 },
  { id: 5, nombre: "Cierre", orden: 5 },
]

const fakeOportunidades = [
  { id: 101, cliente: "ACME S.A.", usuario: "María", vehiculo: "Toyota Yaris", total: 75000, etapa_id: 1, estado: true },
  { id: 102, cliente: "Beta Ltd.", usuario: "Luis", vehiculo: "Kia Rio", total: 68000, etapa_id: 2, estado: true },
  { id: 103, cliente: "Café Colonial", usuario: "Ana", vehiculo: "Hyundai Tucson", total: 165000, etapa_id: 3, estado: true },
  { id: 104, cliente: "Distri X", usuario: "José", vehiculo: "Nissan Versa", total: 84000, etapa_id: 1, estado: true },
  { id: 105, cliente: "Electro GUA", usuario: "María", vehiculo: "Mazda 3", total: 132000, etapa_id: 4, estado: true },
]

export default function Kanban() {
  const [etapas] = useState(fakeEtapas)
  const [items, setItems] = useState(fakeOportunidades)

  const porEtapa = useMemo(() => {
    const map = Object.fromEntries(etapas.map(e => [e.id, []]))
    for (const it of items) map[it.etapa_id]?.push(it)
    return map
  }, [items, etapas])

  const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' })

  // drag & drop sencillo
  const onDragStart = (e, id) => e.dataTransfer.setData("text/plain", String(id))
  const onDrop = (e, etapaId) => {
    const id = Number(e.dataTransfer.getData("text/plain"))
    setItems(prev => prev.map(o => (o.id === id ? { ...o, etapa_id: etapaId } : o)))
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Embudo de oportunidades</h1>
          <p className="mt-2 text-sm text-gray-700">Arrastra tarjetas entre columnas para simular el flujo.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link to="/oportunidades/create" className="rounded-md bg-indigo-900 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Crear oportunidad
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {etapas.sort((a,b)=>a.orden-b.orden).map(et => (
          <div key={et.id}
               onDragOver={e=>e.preventDefault()}
               onDrop={(e)=>onDrop(e, et.id)}
               className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center justify-between">
                {et.nombre}
                <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {porEtapa[et.id]?.length || 0}
                </span>
              </h3>
            </div>
            <div className="p-3 space-y-3 min-h-40">
              {porEtapa[et.id]?.map(card => (
                <div key={card.id} draggable onDragStart={(e)=>onDragStart(e, card.id)}
                  className="rounded-md border border-gray-200 p-3 hover:border-indigo-300 cursor-grab active:cursor-grabbing">
                  <div className="text-sm font-medium text-gray-900">{card.cliente}</div>
                  <div className="text-xs text-gray-600">{card.vehiculo}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-700">{currency.format(card.total)}</span>
                    <span className="text-xs text-gray-500">Asesor: {card.usuario}</span>
                  </div>
                  <div className="mt-2">
                    <Link to={`/oportunidades/${card.id}`} className="text-xs font-semibold text-indigo-700 hover:underline">Ver</Link>
                  </div>
                </div>
              ))}
              {!porEtapa[et.id]?.length && (
                <div className="text-xs text-gray-400 text-center py-6">Sin oportunidades</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
