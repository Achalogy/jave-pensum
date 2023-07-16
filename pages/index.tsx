import { useState, useEffect } from "react"
import DragableGrid from "src/components/DragableGrid"
import { ICareerDetails } from "src/interfaces"
import { BiCheck, BiChevronDown, BiChevronRight } from 'react-icons/bi'

export default () => {
  const [careers, setCareers] = useState<ICareerDetails[]>([])
  const [selectedCareerId, setSelectedCareerId] = useState<string>()
  const [showCareerSelector, setShowCareerSelector] = useState<boolean>(true)

  const getCareers = async () => {
    const response: ICareerDetails[] = await (await fetch('/api/getCareers')).json()
    if (response.length > 0) setCareers(response)
    if (!selectedCareerId) setSelectedCareerId(response[0]._id ?? null)
  }

  useEffect(() => {
    getCareers()
  }, [])

  return (
    <div className="flex flex-col">
      <p className="p-2 bg-orange-100 text-xs">
        <span><b className="text-indigo-600">¡NO FUNCIONA EN MOVIL!</b> - NO TE CONFIES, <b className="text-indigo-600">revisa tu horario! </b></span>
        <a className="text-red-600 font-semibold" href="https://github.com/achalogy/jave-pensum">Código fuente / Reportar errores</a>
      </p>
      <div className="flex flex-row portrait:flex-col gap-2 h-screen px-1">
        <div className={`flex flex-col gap-2 ${showCareerSelector ? "flex-1" : ""} bg-slate-100 p-2 xl:p-4`}>
          <div className="flex justify-between cursor-pointer" onClick={() => setShowCareerSelector(prev => !prev)}>
            <h1 className={`font-semibold text-xl ${showCareerSelector ? "" : "hidden"} portrait:flex`}>Seleccionar Carrera</h1>
            {showCareerSelector ? <BiChevronDown size={25} /> : <BiChevronRight size={25} />}
          </div>
          {showCareerSelector && <div className="flex flex-col gap-2">
            {careers.map(career => {

              return <div className="flex-1 flex rounded-md bg-white cursor-pointer overflow-hidden">
                {career._id === selectedCareerId && <div className="flex px-2 bg-indigo-300 text-2xl items-center justify-center">
                  <BiCheck color="#fff" strokeWidth={1} />
                </div>}
                <div className="flex-1 flex flex-col gap-2 p-4">
                  <h3 className="font-semibold">{career.name}</h3>
                  <p className="text-xs text-end text-slate-400">Actualizado: {new Date(career.updated).toLocaleDateString("es-CO")}</p>
                </div>
              </div>
            })
            }

          </div>}
        </div>
        <div className="flex flex-[4] p2 xl:p-4">
          {selectedCareerId && <DragableGrid key={selectedCareerId} careerId={selectedCareerId} />}
        </div>
      </div>
    </div >
  )
}