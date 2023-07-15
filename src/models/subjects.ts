import { Model, Schema, Types, model, models } from 'mongoose'
import { ICore, IType } from 'src/types';


export interface ISubject {
  _id: string | Types.ObjectId,
  name: string,
  code: number,
  credits: number,
  type?: IType,
  core?: ICore,
  requirements?: {
    core?: {
      core_name: "Basics" | "Applied engineering" | "Socio-humanistic",
      credits: number
    },
    subjects?: number[]
  },
  corequirements?: number[]
}

const SubjectSchema = new Schema<ISubject>({}, { strict: false });

const Subjects: Model<ISubject> = models.subject || model<ISubject>("subject", SubjectSchema);

export {
  Subjects
}