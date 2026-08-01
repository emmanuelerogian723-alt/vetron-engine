import type { VercelRequest, VercelResponse } from "@vercel/node";
import { learnFromDocs } from "../../../lib/learning.ts";
import { getBody } from "../../../lib/http.ts";

export const config = { maxDuration: 30 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const body = await getBody(req);
  const { url, topic } = body;
  if (!url) return res.status(400).json({ error: "URL required" });
  const result = await learnFromDocs(url, topic || "");
  res.json(result);
}
