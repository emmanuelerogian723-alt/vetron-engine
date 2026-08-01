import type { VercelRequest, VercelResponse } from "@vercel/node";
import { learnFromReleases } from "../../../lib/learning.ts";
import { getBody } from "../../../lib/http.ts";

export const config = { maxDuration: 30 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const body = await getBody(req);
  const framework = body.framework || "";
  if (!framework) return res.status(400).json({ error: "Framework required" });
  const result = await learnFromReleases(framework);
  res.json(result);
}
