import type { VercelRequest, VercelResponse } from "@vercel/node";
import { listAgents } from "../../lib/agents.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const agents = listAgents();
  res.json({ total: agents.length, agents });
}
