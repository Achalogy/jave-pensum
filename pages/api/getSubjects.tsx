import connectDB from "middleware/mongoose";
import { NextApiResponse, NextApiRequest } from "next";
import { Careers } from "src/models/career";
import { Subjects } from "src/models/subjects";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != "POST") return res.status(400).end("Bad Request")

  const { query }: { query: number | number[] } = req.body

  const subjects = await Subjects.find({
    code: {
      $in: [query].flat().filter(x => x)
    }
  })

  return res.send(subjects)

})