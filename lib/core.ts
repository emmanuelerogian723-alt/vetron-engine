/**
 * VETRON CORE — The Engineering Brain
 *
 * Philosophy: Think. Reason. Build. Verify. Improve. Repeat.
 *
 * Vetron never rushes to an answer. It:
 * 1. Understands the request
 * 2. Researches solutions
 * 3. Creates a plan
 * 4. Selects the best tools/agents
 * 5. Executes the plan
 * 6. Tests and verifies results
 * 7. Learns and improves
 */

import { aiComplete, aiJSON } from "./ai.ts";
import { AGENTS, listAgents } from "./agents.ts";
import type { Agent } from "./agents.ts";

export interface Phase {
  phase: string;
  status: "active" | "complete";
  message: string;
  result?: any;
}

export interface ThinkResult {
  status: string;
  phases: Phase[];
  summary: string;
  agents_used: string[];
}

const SYSTEM_PROMPT = `You are Vetron, an autonomous AI software engineering agent. You think like the best senior engineer, architect, DevOps engineer, and product designer combined. You are calm, intelligent, honest, and thorough. You explain complex things simply. You challenge poor decisions respectfully and suggest better approaches.`;

export async function think(
  request: string,
  context: Record<string, any> = {},
  onPhase?: (phase: Phase) => void
): Promise<ThinkResult> {
  const phases: Phase[] = [];

  // Phase 1: UNDERSTAND
  const p1: Phase = { phase: "understand", status: "active", message: "Analyzing request..." };
  phases.push(p1);
  onPhase?.(p1);

  const understanding = await aiJSON(
    `Analyze this software engineering request and return JSON:
{
  "intent": "build|fix|improve|review|deploy|research|design|automate",
  "type": "website|api|app|script|infrastructure|bug_fix|refactor|review|deployment",
  "languages": ["detected"],
  "frameworks": ["detected"],
  "complexity": "low|medium|high|expert",
  "estimated_time": "rough estimate",
  "required_agents": ["keys from: ${Object.keys(AGENTS).join(", ")}"],
  "key_challenges": ["list"],
  "success_criteria": ["how to verify"]
}
Request: ${request}`,
    SYSTEM_PROMPT
  ) || { intent: "build", type: "general", complexity: "medium", required_agents: ["fullstack", "qa"], key_challenges: [], success_criteria: [] };

  p1.status = "complete";
  p1.result = understanding;
  onPhase?.(p1);

  // Phase 2: RESEARCH
  const p2: Phase = { phase: "research", status: "active", message: "Researching solutions..." };
  phases.push(p2);
  onPhase?.(p2);

  const research = await aiJSON(
    `Research the best approach for a ${understanding.intent} task of type ${understanding.type}.
Return JSON:
{
  "recommended_stack": ["technologies"],
  "architecture_pattern": "pattern name",
  "best_practices": ["list"],
  "potential_pitfalls": ["list"],
  "alternative_approaches": ["list"]
}`,
    SYSTEM_PROMPT
  ) || { recommended_stack: [], best_practices: [], potential_pitfalls: [] };

  p2.status = "complete";
  p2.result = research;
  onPhase?.(p2);

  // Phase 3: PLAN
  const p3: Phase = { phase: "plan", status: "active", message: "Creating engineering plan..." };
  phases.push(p3);
  onPhase?.(p3);

  const plan = await aiJSON(
    `Create a detailed step-by-step engineering plan.
Return JSON:
{
  "steps": [
    {"id": 1, "agent": "agent_key", "action": "what to do", "depends_on": [], "estimated_time": "X min", "risk": "low|medium|high"}
  ],
  "total_estimated_time": "X min",
  "critical_path": [step ids]
}
Understanding: ${JSON.stringify(understanding).slice(0, 500)}
Research: ${JSON.stringify(research).slice(0, 500)}`,
    SYSTEM_PROMPT
  ) || { steps: [{ id: 1, agent: "fullstack", action: "Execute task", risk: "low" }], total_estimated_time: "5 min" };

  p3.status = "complete";
  p3.result = plan;
  onPhase?.(p3);

  // Phase 4: SELECT TOOLS
  const p4: Phase = { phase: "tools", status: "active", message: "Selecting agents and tools..." };
  phases.push(p4);
  onPhase?.(p4);

  const selectedAgents: string[] = [];
  for (const step of plan.steps || []) {
    const agentKey = step.agent || "fullstack";
    if (!selectedAgents.includes(agentKey)) selectedAgents.push(agentKey);
  }
  // Also include agents from understanding
  for (const a of understanding.required_agents || []) {
    if (!selectedAgents.includes(a)) selectedAgents.push(a);
  }

  p4.status = "complete";
  p4.result = { selected: selectedAgents, total: selectedAgents.length };
  onPhase?.(p4);

  // Phase 5: EXECUTE
  const p5: Phase = { phase: "execute", status: "active", message: "Executing plan..." };
  phases.push(p5);
  onPhase?.(p5);

  // Generate actual code/solution
  const executionResult = await aiComplete(
    `You are executing an engineering task. Provide a complete, working solution.

Task: ${request}

Plan: ${JSON.stringify(plan).slice(0, 800)}
Research: ${JSON.stringify(research).slice(0, 500)}

Provide:
1. The actual code or solution (in code blocks with language tags)
2. Step-by-step implementation instructions
3. Any configuration needed (env vars, dependencies)
4. How to test/verify the solution works

Be thorough and practical. Write production-quality code.`,
    SYSTEM_PROMPT
  );

  p5.status = "complete";
  p5.result = { output: executionResult.slice(0, 500), full_length: executionResult.length };
  onPhase?.(p5);

  // Phase 6: VERIFY
  const p6: Phase = { phase: "verify", status: "active", message: "Testing and validating..." };
  phases.push(p6);
  onPhase?.(p6);

  const verification = await aiJSON(
    `Verify this solution against the success criteria.
Return JSON:
{
  "all_passed": true/false,
  "checks": [
    {"criterion": "what was checked", "passed": true/false, "notes": ""}
  ],
  "issues_found": ["list"],
  "confidence": "high|medium|low"
}
Success criteria: ${JSON.stringify(understanding.success_criteria)}
Solution preview: ${executionResult.slice(0, 1000)}`,
    SYSTEM_PROMPT
  ) || { all_passed: true, checks: [], issues_found: [], confidence: "medium" };

  p6.status = "complete";
  p6.result = verification;
  onPhase?.(p6);

  // Phase 7: IMPROVE
  const p7: Phase = { phase: "improve", status: "active", message: "Optimizing and learning..." };
  phases.push(p7);
  onPhase?.(p7);

  const improvements = await aiJSON(
    `Suggest improvements for this solution.
Return JSON:
{
  "improvements": [
    {"type": "performance|security|maintainability|scalability", "suggestion": "what to improve", "priority": "high|medium|low"}
  ],
  "learnings": ["what Vetron learned from this task"],
  "next_steps": ["recommended follow-up actions"]
}`,
    SYSTEM_PROMPT
  ) || { improvements: [], learnings: [], next_steps: [] };

  p7.status = "complete";
  p7.result = improvements;
  onPhase?.(p7);

  // Build summary
  const summary = phases.map(p => `${p.status === "complete" ? "✅" : "⏳"} ${p.phase}: ${p.message}`).join("\n");

  return {
    status: "complete",
    phases,
    summary,
    agents_used: selectedAgents,
    execution: executionResult,
    understanding,
    research,
    plan,
    verification,
    improvements,
  };
}

export function getEngineState() {
  return {
    state: "idle",
    agents: listAgents().length,
    agent_names: listAgents().map(a => a.name),
  };
}
