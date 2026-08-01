import type { VercelRequest, VercelResponse } from "@vercel/node";
import { think } from "../../lib/core.ts";
import { getBody } from "../../lib/http.ts";

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const body = await getBody(req);
  const task = body.request || body.task || body.message || "";
  if (!task) return res.status(400).json({ error: "No task provided" });

  const context = body.context || {};
  const stream = body.stream === true;

  if (stream) {
    // SSE stream with live phases
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    res.write(`data: ${JSON.stringify({ type: "state", state: "listening", message: "Request received", ts: new Date().toTimeString().slice(0, 8) })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "state", state: "thinking", message: "Vetron is thinking..." })}\n\n`);

    try {
      const result = await think(task, context, (phase) => {
        res.write(`data: ${JSON.stringify({ type: "phase", phase })}\n\n`);
        
        // Send state changes
        if (phase.phase === "execute") {
          res.write(`data: ${JSON.stringify({ type: "state", state: "coding", message: phase.message })}\n\n`);
        } else if (phase.phase === "verify") {
          res.write(`data: ${JSON.stringify({ type: "state", state: "debugging", message: phase.message })}\n\n`);
        }
      });

      res.write(`data: ${JSON.stringify({ type: "state", state: "success", message: "Task completed" })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "complete", result: {
        status: result.status,
        summary: result.summary,
        agents_used: result.agents_used,
        execution: result.execution,
        understanding: result.understanding,
        plan: result.plan,
        verification: result.verification,
        improvements: result.improvements,
      } })}\n\n`);
    } catch (e) {
      res.write(`data: ${JSON.stringify({ type: "error", message: (e as Error).message })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ type: "state", state: "idle" })}\n\n`);
    res.end();
  } else {
    // Non-streaming
    try {
      const result = await think(task, context);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  }
}
