import connectDB from "middleware/mongoose";
import { NextApiResponse, NextApiRequest } from "next";
import { Careers } from "src/models/career";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  const { career } = req.query
  if (!career || req.method != "GET") return res.status(400).end("Bad Request")

  const Career = await Careers.findById(career)
  
  if(Career) return res.status(200).send(Career)

  res.status(404).end("Not Found")
})