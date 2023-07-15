import { Model, Schema, Types, model, models } from 'mongoose'
import { ICore, IType } from 'src/types';

export interface ICareer {
  _id: string | Types.ObjectId,
  name: string,
  total_credits: number,
  credits: {
    fundamental: number,
    emphasis: number,
    complementary: number,
    elective: number
  },
  requirements: {
    english: string | undefined,
  },
  pensum: {
    type: IType,
    core?: ICore,
    code?: number,
    credits?: number
  }[]
}

const CareerSchema = new Schema<ICareer>({}, { strict: false });

const Careers: Model<ICareer> = models.career || model<ICareer>("career", CareerSchema);

export {
  Careers
}