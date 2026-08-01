import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkDependencies } from "../../../lib/predictive.ts";
import { getBody } from "../../../lib/http.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const body = await getBody(req);
  const deps = body.dependencies || {};
  const result = await checkDependencies(deps);
  res.json(result);
}
