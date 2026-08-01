import type { VercelRequest, VercelResponse } from "@vercel/node";
import { hasAI, getProviderInfo } from "../lib/ai.ts";
import { listAgents } from "../lib/agents.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    name: "VETRON Engine",
    version: "1.0.0",
    status: "running",
    philosophy: "Think. Reason. Build. Verify. Improve. Repeat.",
    ai_provider: getProviderInfo(),
    agents: listAgents().length,
    endpoints: {
      "GET /": "This info",
      "GET /vetron/state": "Current Vetron state",
      "GET /vetron/agents": "List all 22 engineering agents",
      "POST /vetron/think": "Main pipeline (stream or return)",
      "POST /vetron/quick-build": "Quick build task",
      "POST /vetron/predict/code": "Analyze code for issues",
      "POST /vetron/predict/dependencies": "Check dependency risks",
      "POST /vetron/memory/remember": "Store a memory",
      "GET /vetron/memory/recall?q=": "Recall memories",
      "GET /vetron/memory/all": "List all memories",
      "DELETE /vetron/memory/:key": "Forget a memory",
      "POST /vetron/learn/docs": "Learn from documentation URL",
      "POST /vetron/learn/releases": "Learn from release notes",
      "GET /vetron/learn/status": "Learning system status",
      "GET /vetron/learn/search?topic=": "Search knowledge base",
    },
  });
}
