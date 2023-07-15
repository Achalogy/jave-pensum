import { useState, useEffect } from "react"
import DragableGrid from "src/components/DragableGrid"
import { ICareer } from "src/models/career"

export default () => {
  const [careers, setCareers] = useState<{ _id: string, name: string, updated: string }[]>([])

  const getCareers = async () => {
    const response = await (await fetch('/api/getCareers')).json()
    if (response.length > 0) setCareers(response)
  }

  useEffect(() => {
    getCareers()
  }, [])

  return (
    <div className="flex flex-col xl:flex-row gap-2 h-screen">
      <div className="flex flex-col gap-2 flex-1 bg-slate-100 p-4">
        <h1 className="font-semibold text-xl">Carreras</h1>
        <div className="flex flex-col gap-2">
          {careers.map(career => {

            return <div className="flex flex-col gap-2 p-4 rounded-md bg-white cursor-pointer">
              <h3 className="font-semibold">{career.name}</h3>
              <p className="text-xs text-end text-slate-400">Actualizado: {new Date(career.updated).toLocaleDateString("es-CO")}</p>
            </div>
          })
          }
          <div className="flex flex-col gap-2 text-center text-slate-700 bg-red-200 bg-opacity-50 py-2 rounded-md">
            <b>PROYECTO EN CONTRUCCIÓN</b>
            <p>Por favor usar computador por ahora, y reportarme cualquier cosita :D</p>
          </div>
        </div>
      </div>
      <div className="flex flex-[4] p-4">
        <DragableGrid />
      </div>
    </div>
  )
}