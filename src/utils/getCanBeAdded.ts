import { ISubject } from "src/models/subjects"

export default ({ pensum, subject}: {
  pensum: ISubject[][],
  subject: ISubject
}) => {

  const subjectReqs = subject.requirements?.subjects ?? []
  const coreReqs = subject.requirements?.core ?? []

  let ocurrencies: number[] = []

  const passSubjectsReq = subjectReqs?.every((x) => {
    return pensum.slice(0, -1).some((y, i) => {
      ocurrencies.push(i)
      return y.map(x => x.code).includes(x)
    })
  })

  const passCoreReq = coreReqs?.every((core) => {
    let total = 0;
    pensum.slice(0, -1).map((semester, semesterIndex) => {
      semester.map(subject => {
        if(subject.core == core.core_name) {
          total += subject.credits
          ocurrencies.push(semesterIndex)
        }
      })
    })

    return total >= core.credits
  })

  const reqSemester = Math.max(...ocurrencies)

  return {
    details: {
      passSubjectsReq,
      passCoreReq
    },
    canBeAdded: passSubjectsReq && passCoreReq,
    reqSemester
  }

}