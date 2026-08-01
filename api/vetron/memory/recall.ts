import type { VercelRequest, VercelResponse } from "@vercel/node";
import { recall } from "../../../lib/memory.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const q = (req.query.q as string) || "";
  const results = await recall(q);
  res.json({ results, count: results.length });
}
