import type { VercelRequest, VercelResponse } from "@vercel/node";
import { listAll } from "../../../lib/memory.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result = await listAll();
  res.json(result);
}
