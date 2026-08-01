import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getEngineState } from "../../lib/core.ts";
import { learningStatus } from "../../lib/learning.ts";
import { hasAI, getProviderInfo } from "../../lib/ai.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    state: "idle",
    agents: getEngineState().agents,
    agent_names: getEngineState().agent_names,
    ai_connected: hasAI(),
    ai_provider: getProviderInfo(),
    learning: learningStatus(),
    timestamp: Date.now(),
  });
}
