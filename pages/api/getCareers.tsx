import connectDB from "middleware/mongoose";
import { NextApiResponse, NextApiRequest } from "next";
import { Careers } from "src/models/career";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method != "GET") return res.status(400).end("Bad Request")
  const careers = await Careers.aggregate([
    {
      $project: { name: 1 }
    },
    {
      $addFields: {
        updated: {
          $toDate: "$_id"
        }
      }
    }
  ])
  res.status(200).send(careers)
})