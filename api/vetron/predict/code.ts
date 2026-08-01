import type { VercelRequest, VercelResponse } from "@vercel/node";
import { analyzeCode } from "../../../lib/predictive.ts";
import { getBody } from "../../../lib/http.ts";

export const config = { maxDuration: 30 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const body = await getBody(req);
  const { code, language } = body;
  if (!code) return res.status(400).json({ error: "No code provided" });
  const result = await analyzeCode(code, language || "auto");
  res.json(result);
}
