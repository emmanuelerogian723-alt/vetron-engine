import type { VercelRequest, VercelResponse } from "@vercel/node";
import { remember } from "../../../lib/memory.ts";
import { getBody } from "../../../lib/http.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const body = await getBody(req);
  const { key, value, category } = body;
  if (!key) return res.status(400).json({ error: "Key required" });
  const result = await remember(key, value || "", category || "general");
  res.json(result);
}
