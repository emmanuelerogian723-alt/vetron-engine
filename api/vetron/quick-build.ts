import type { VercelRequest, VercelResponse } from "@vercel/node";
import { think } from "../../lib/core.ts";
import { getBody } from "../../lib/http.ts";

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const body = await getBody(req);
  const task = body.task || "";
  if (!task) return res.status(400).json({ error: "Task required" });

  try {
    const result = await think(task, body.context || {});
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
