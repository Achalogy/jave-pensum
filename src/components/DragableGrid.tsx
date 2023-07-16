import { useEffect, useRef, useState } from "react"
import colors from "src/constants/colors"
import { ICareer } from "src/models/career"
import { ISubject } from "src/models/subjects"
import getCanBeAdded from "src/utils/getCanBeAdded"
import getCreditsColor from "src/utils/getCreditsColor"
import translateTypes from "src/utils/translateType"

export default () => {
  const dragItem = useRef()
  const dragOverItem = useRef()

  const [showVault, setShowVault] = useState<boolean>(true)
  const [hideCannotBeAdded, setHideCannotBeAdded] = useState<boolean>(false)

  const [semesters, setSemesters] = useState(8)

  const [pensum, setPensum] = useState<ISubject[][]>(() => {
    const _s = []
    for (let i = 0; i <= semesters; i++) {
      _s.push([])
    }
    return _s
  })

  const getSubjects = async () => {

    const response: ICareer = await (await fetch('/api/getCareer?career=64aeb9010820de8718449067')).json()

    const _subjectsData: ISubject[] = await (await fetch('/api/getSubjects', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: response.pensum.map(x => x.code)
      })
    })).json()

    let _subjects: any[] = response.pensum.map(sub => {
      const i = _subjectsData.findIndex(x => x.code == sub.code)

      if (i > -1) {
        return {
          ...sub,
          ..._subjectsData[i]
        }
      }
      return sub
    })

    let newList = pensum.slice()

    newList[pensum.length - 1] = _subjects

    setPensum(newList)
  }

  useEffect(() => {
    getSubjects()
  }, [])

  const dragStart = (position: any) => {
    dragItem.current = position;
  };

  const dragEnd = (position: any) => {
    dragOverItem.current = position;
  };

  const drop = () => {
    if (!dragItem.current || !dragOverItem.current) return
    let newList = pensum.slice();

    const dragItemContent: ISubject = newList[dragItem?.current[0]][dragItem?.current[1]]

    const { canBeAdded } = getCanBeAdded({ pensum: newList, subject: dragItemContent })

    if (!canBeAdded) return

    newList[dragItem?.current[0]].splice(dragItem?.current[1], 1)
    newList[dragOverItem?.current[0]].splice(dragOverItem?.current[1], 0, dragItemContent)

    dragItem.current = undefined
    dragOverItem.current = undefined

    setPensum(newList.map(x => x.filter(y => y)));
  }

  const DragableDiv = ({ children, index = [0, 0], className = "", id }: {
    children: any,
    index?: number[],
    className?: string,
    id: string
  }) => <div
    onDragStart={(e) => {
      e.stopPropagation()
      dragStart(index)
    }}
    onDragEnter={(e) => {
      e.stopPropagation()
      dragEnd(index)
    }}
    onDragEnd={(e) => {
      e.stopPropagation()
      drop()
    }}
    draggable={id == "item"} className={`cursor-pointer ${className}`}> {children} </div>

  const SubjectComponent = ({ index, subject }: { index: number[], subject: ISubject }) => {

    const { canBeAdded, reqSemester } = getCanBeAdded({ pensum, subject })

    return <>
      {hideCannotBeAdded && !canBeAdded ?
        <></>
        :
        <DragableDiv id="item" index={index} className={`flex items-center justify-center rounded-md text-center text-xs h-full overflow-hidden xl:max-h-[8vh] ${colors[subject.core ?? ""] ?? colors[subject.type ?? ""]} ${canBeAdded ? "saturate-100" : "saturate-0"}`}>
          {canBeAdded && <p className="bg-indigo-300 h-full text-center flex items-center px-2 font-semibold">{">"} {(reqSemester >= 0 ? reqSemester + 1 : 0)}</p>}
          <div className="flex flex-col items-center justify-center p-2 flex-1">
            <b>{subject.name ?? translateTypes[subject.type ?? ""]}</b>
            <p>{subject.code}</p>
            <p>{subject.credits}</p>
          </div>
        </DragableDiv>
      }
    </>
  }

  return <div className="flex flex-col flex-1 max-w-full max-h-[100vh]">
    <div className="flex gap-1 p-2 flex-1 overflow-x-scroll">
      {pensum.slice(0, -1).map((semester, semesterIndex) => {
        const credits = semester.reduce((acc, curr) => {
          return acc + (isNaN(curr.credits) ? 0 : curr.credits)
        }, 0)

        return <div className="flex flex-col flex-1 gap-2">
          <p className="text-center bg-indigo-200 rounded-md font-semibold py-1">
            Semestre {semesterIndex + 1}
          </p>
          <DragableDiv id="column" index={[semesterIndex, semester.length]} className={`flex flex-col flex-1 p-2 gap-2 overflow-scroll rounded-md w-[45vw] xl:w-auto ${semesterIndex % 2 == 0 ? "bg-slate-200" : "bg-slate-100"}`}>
            {semester.map((subject, subjectIndex) => <SubjectComponent index={[semesterIndex, subjectIndex]} subject={subject} />)}
          </DragableDiv>
          <p className={`text-center ${getCreditsColor({ credits })} rounded-md font-semibold py-1`}>
            Creditos {credits}
          </p>
        </div>
      })}
    </div>
    <div className="flex flex-col max-h-[25%] bg-white items-end">
      <div className="flex gap-2">
        <button onClick={() => setShowVault(prev => !prev)} className="px-2 bg-slate-200 rounded-md">{showVault ? "Ocultar" : "Mostrar"}</button>
        <button onClick={() => setHideCannotBeAdded(prev => !prev)} className="px-2 bg-slate-200 rounded-md">{hideCannotBeAdded ? "Mostrar si no se puede añadir" : "Ocultar si no se puede añadir"}</button>
      </div>
      {showVault && <div className="flex flex-wrap p-4 gap-2 overflow-scroll">
        {pensum.at(-1)?.map((subject, subjectIndex) =>
          <SubjectComponent index={[pensum.length - 1, subjectIndex]} subject={subject} />
        )}
      </div>}
    </div>
  </div>
}