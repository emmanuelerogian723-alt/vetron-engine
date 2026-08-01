import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getKnowledge } from "../../../lib/learning.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const topic = (req.query.topic as string) || "";
  res.json(getKnowledge(topic));
}
