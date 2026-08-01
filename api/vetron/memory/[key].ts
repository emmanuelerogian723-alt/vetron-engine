import type { VercelRequest, VercelResponse } from "@vercel/node";
import { forget } from "../../../lib/memory.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "DELETE only" });
  const key = req.query.key as string;
  const result = await forget(key);
  res.json(result);
}
