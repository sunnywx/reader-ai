import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  const resp=await fetch(`http://localhost:3001/llms`)
  const data=await resp.json()

  res.json({llms: data.llms})
}