import { useEffect, useRef, useState } from "react"
import { ICareer } from "src/models/career"
import { ISubject } from "src/models/subjects"
import { IType } from "src/types"

export default () => {
  const dragItem: any = useRef()
  const dragOverItem: any = useRef()

  const [semesters, setSemesters] = useState(8)

  const [subjects, setSubjects] = useState<any[][]>(() => {
    const _s = []
    for (let i = 0; i <= semesters; i++) {
      _s.push([])
    }
    return _s
  })

  const getSubjects = async () => {

    const { pensum }: ICareer = await (await fetch('/api/getCareer?career=64aeb9010820de8718449067')).json()

    const _subjectsData: ISubject[] = await (await fetch('/api/getSubjects', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: pensum.map(x => x.code)
      })
    })).json()

    let _subjects: any[] = pensum.map(sub => {
      const i = _subjectsData.findIndex(x => x.code == sub.code)

      if (i > -1) {
        return {
          ...sub,
          ..._subjectsData[i]
        }
      }
      return sub
    })

    let newList = subjects.slice()

    newList[subjects.length - 1] = _subjects

    setSubjects(newList)
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

  const drop = (e: any) => {
    e.stopPropagation()
    let newList = subjects.slice();

    const dragItemContent: ISubject = newList[dragItem?.current[0]][dragItem?.current[1]]
    const requirements = dragItemContent.requirements?.subjects ?? []

    const canBeAdded = requirements?.every(x => newList.slice(0, dragOverItem.current[0]).flat().map(y => y.code).includes(x))

    if (!canBeAdded) return

    newList[dragItem?.current[0]].splice(dragItem?.current[1], 1)
    newList[dragOverItem?.current[0]].splice(dragOverItem?.current[1], 0, dragItemContent)

    dragItem.current = null
    dragOverItem.current = null

    setSubjects(newList.map(x => x.filter(y => y)));
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
      drop(e)
    }}
    draggable={id == "item"} className={`cursor-pointer ${className}`}> {children} </div>

  const SubjectComponent = ({ index, subject }: { index: number[], subject: ISubject }) => {

    const requirements = subject.requirements?.subjects ?? []

    const canBeAdded = requirements?.every(x => subjects.slice(0, -1).flat().map(y => y.code).includes(x))

    return <DragableDiv id="item" index={index} className={`flex flex-col items-center justify-center p-2 rounded-md text-center text-xs h-full flex-1 ${subject.type == "elective" ? "bg-green-300" : subject.type == "complementary" ? "bg-blue-300" : subject.type == "emphasis" ? "bg-purple-400" : subject.type == "subject" ? "bg-orange-300" : subject.type == "basics_elective" ? "bg-yellow-300" : "bg-slate-200"} ${canBeAdded ? "saturate-100" : "saturate-0"}`}>
      <b>{subject.name ?? subject.type}</b>
      <p>{subject.code}</p>
      <p>{subject.credits}</p>
    </DragableDiv>
  }

  return <div className="flex flex-col flex-1 max-w-full max-h-[100vh]">
    <div className="flex gap-1 p-2 h-[75%] overflow-x-scroll">
      {subjects.slice(0, -1).map((grupo, grupoindex) => {
        const credits = grupo.reduce((acc, curr) => {
          return acc + (isNaN(curr.credits) ? 0 : curr.credits)
        }, 0)

        return <div className="flex flex-col flex-1 gap-2">
          <p className="text-center bg-indigo-200 rounded-md font-semibold py-1">
            Semestre {grupoindex + 1}
          </p>
          <DragableDiv id="column" index={[grupoindex, grupo.length]} className={`flex flex-col flex-1 p-2 gap-2 overflow-scroll rounded-md ${grupoindex % 2 == 0 ? "bg-slate-200" : "bg-slate-100"}`}>
            {grupo.map((subject, subjectIndex) => <SubjectComponent index={[grupoindex, subjectIndex]} subject={subject} />)}
          </DragableDiv>
          <p className={`text-center ${credits < 10 ? "bg-green-300" : credits < 14 ? "bg-indigo-300" : credits < 18 ? "bg-blue-300": credits < 20 ? "bg-orange-300" : "bg-red-300" } rounded-md font-semibold py-1`}>
            Creditos {credits}
          </p>
        </div>
      })}
    </div>
    <div className="flex flex-wrap gap-2 p-4 h-[25%] bg-white overflow-scroll">
      {subjects.at(-1)?.map((subject, subjectIndex) => <div>
        <SubjectComponent index={[subjects.length - 1, subjectIndex]} subject={subject} />
      </div>)}
    </div>
  </div>
}