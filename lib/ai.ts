/**
 * AI caller — supports Groq, OpenRouter, or any OpenAI-compatible API.
 * Vetron automatically picks the best available model.
 */

interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

function getConfig(): AIConfig | null {
  // Try Groq first (fastest)
  if (process.env.GROQ_API_KEY) {
    return {
      apiKey: process.env.GROQ_API_KEY,
      baseUrl: "https://api.groq.com/openai/v1",
      model: process.env.VETRON_MODEL || "llama-3.3-70b-versatile",
    };
  }
  // Try OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    return {
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: "https://openrouter.ai/api/v1",
      model: process.env.VETRON_MODEL || "anthropic/claude-3.5-sonnet",
    };
  }
  // Try OpenAI
  if (process.env.OPENAI_API_KEY) {
    return {
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: "https://api.openai.com/v1",
      model: "gpt-4o-mini",
    };
  }
  return null;
}

export async function aiComplete(prompt: string, system: string = ""): Promise<string> {
  const config = getConfig();
  if (!config) {
    return JSON.stringify({
      intent: "build",
      type: "general",
      complexity: "medium",
      required_agents: ["fullstack", "qa"],
      key_challenges: ["No AI provider configured"],
      success_criteria: ["Configure an AI provider"],
    });
  }

  try {
    const messages = [];
    if (system) messages.push({ role: "system", content: system });
    messages.push({ role: "user", content: prompt });

    const resp = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!resp.ok) {
      throw new Error(`AI API error: ${resp.status}`);
    }

    const data = await resp.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (e) {
    return `Error: ${(e as Error).message}`;
  }
}

export async function aiJSON(prompt: string, system: string = ""): Promise<any> {
  const result = await aiComplete(prompt, system);
  try {
    // Try to parse JSON from the response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return JSON.parse(result);
  } catch {
    return null;
  }
}

export function hasAI(): boolean {
  return getConfig() !== null;
}

export function getProviderInfo(): { provider: string; model: string } | null {
  const config = getConfig();
  if (!config) return null;
  const provider = config.baseUrl.includes("groq") ? "Groq" :
                   config.baseUrl.includes("openrouter") ? "OpenRouter" :
                   config.baseUrl.includes("openai") ? "OpenAI" : "Unknown";
  return { provider, model: config.model };
}
