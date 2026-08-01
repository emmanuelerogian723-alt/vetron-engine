import type { VercelRequest, VercelResponse } from "@vercel/node";
import { learningStatus } from "../../../lib/learning.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json(learningStatus());
}
