import { useState } from "react"

const initial = [
  { id:1, nombre:"Prospección", orden:1 },
  { id:2, nombre:"Calificación", orden:2 },
  { id:3, nombre:"Propuesta", orden:3 },
  { id:4, nombre:"Negociación", orden:4 },
  { id:5, nombre:"Cierre", orden:5 },
]

export default function Etapas() {
  const [etapas, setEtapas] = useState(initial)
  const move = (idx, dir) => {
    const target = idx + dir
    if (target < 0 || target >= etapas.length) return
    const copy = [...etapas]
    const tmp = copy[idx]; copy[idx] = copy[target]; copy[target] = tmp
    setEtapas(copy.map((e, i) => ({...e, orden: i+1})))
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-base font-semibold text-gray-900">Etapas del embudo</h1>
      <p className="mt-2 text-sm text-gray-700">Solo admin. Reordena para cambiar el flujo.</p>

      <div className="mt-6 rounded-lg bg-white shadow-sm ring-1 ring-gray-200 divide-y divide-gray-200">
        {etapas.map((e, i) => (
          <div key={e.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-700">{e.orden}</span>
              <span className="text-sm font-medium text-gray-900">{e.nombre}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>move(i,-1)} className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700 hover:bg-gray-200">↑</button>
              <button onClick={()=>move(i, 1)} className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700 hover:bg-gray-200">↓</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button className="rounded-md bg-indigo-900 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Guardar cambios (demo)</button>
      </div>
    </div>
  )
}
