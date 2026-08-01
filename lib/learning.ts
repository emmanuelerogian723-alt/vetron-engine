/**
 * VETRON CONTINUOUS INTELLIGENCE
 * Learns from documentation, release notes, and project context.
 */

const knowledgeBase: Record<string, any> = {};

export async function learnFromDocs(url: string, topic = ""): Promise<any> {
  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "Vetron/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    
    if (!resp.ok) {
      return { status: "error", message: `HTTP ${resp.status}` };
    }
    
    const html = await resp.text();
    // Extract text from HTML (basic)
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 8000);
    
    // Extract concepts (headings, key terms)
    const concepts: string[] = [];
    const headingMatches = html.match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gi);
    if (headingMatches) {
      for (const h of headingMatches.slice(0, 20)) {
        const text = h.replace(/<[^>]+>/g, "").trim();
        if (text) concepts.push(text);
      }
    }
    
    const key = topic || url;
    knowledgeBase[key] = {
      content: text.slice(0, 5000),
      concepts,
      source: url,
      verified: true,
      learned_at: Date.now(),
    };
    
    return { status: "learned", topic: key, concepts_count: concepts.length };
  } catch (e) {
    return { status: "error", message: (e as Error).message };
  }
}

export async function learnFromReleases(framework: string): Promise<any> {
  const releaseUrls: Record<string, string> = {
    react: "https://github.com/facebook/react/releases",
    next: "https://github.com/vercel/next.js/releases",
    python: "https://www.python.org/downloads/",
    fastapi: "https://github.com/tiangolo/fastapi/releases",
    supabase: "https://supabase.com/docs/changelog",
    vercel: "https://vercel.com/changelog",
    "node": "https://nodejs.org/en/blog/release",
  };
  const url = releaseUrls[framework.toLowerCase()];
  if (!url) return { status: "no_source", framework };
  return learnFromDocs(url, `${framework}_releases`);
}

export function getKnowledge(topic: string): any {
  const results: any = {};
  for (const [k, v] of Object.entries(knowledgeBase)) {
    if (topic.toLowerCase() in k.toLowerCase() || topic.toLowerCase() in JSON.stringify(v.concepts || []).toLowerCase()) {
      results[k] = v;
    }
  }
  return { topic, results, count: Object.keys(results).length };
}

export function learningStatus(): any {
  return {
    knowledge_entries: Object.keys(knowledgeBase).length,
    last_learn: Math.max(...Object.values(knowledgeBase).map((v: any) => v.learned_at || 0), 0),
  };
}
