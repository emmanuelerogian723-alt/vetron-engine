/**
 * VETRON PREDICTIVE ENGINE
 * Proactively identifies future bugs, security issues, performance bottlenecks.
 */

interface Finding {
  category: string;
  risk: string;
  pattern: string;
  description: string;
  recommendation: string;
  line?: number;
}

const RISK_PATTERNS: Record<string, Finding[]> = {
  security: [
    { category: "security", risk: "critical", pattern: "eval(", description: "Code injection via eval()", recommendation: "Replace with JSON.parse() or safe alternatives" },
    { category: "security", risk: "high", pattern: "innerHTML", description: "XSS via innerHTML", recommendation: "Use textContent or DOMPurify.sanitize()" },
    { category: "security", risk: "high", pattern: "api_key", description: "Exposed API key", recommendation: "Move to environment variables" },
    { category: "security", risk: "high", pattern: "password =", description: "Hardcoded password", recommendation: "Use environment variables or secret manager" },
    { category: "security", risk: "medium", pattern: "secret", description: "Exposed secret", recommendation: "Use .env files, never commit secrets" },
    { category: "security", risk: "medium", pattern: "SELECT *", description: "Unparameterized SQL query", recommendation: "Use parameterized queries" },
    { category: "security", risk: "low", pattern: "http://", description: "Insecure HTTP URL", recommendation: "Use HTTPS for all external requests" },
  ],
  performance: [
    { category: "performance", risk: "high", pattern: "N+1", description: "N+1 query problem", recommendation: "Use joins or batch loading" },
    { category: "performance", risk: "medium", pattern: "document.write", description: "Blocking DOM write", recommendation: "Use DOM manipulation methods" },
    { category: "performance", risk: "medium", pattern: "setTimeout(0)", description: "Potential blocking call", recommendation: "Use requestAnimationFrame or proper async" },
  ],
  scalability: [
    { category: "scalability", risk: "medium", pattern: "global ", description: "Global state mutation", recommendation: "Use proper state management" },
    { category: "scalability", risk: "low", pattern: "sync", description: "Synchronous operation in async context", recommendation: "Use async/await properly" },
  ],
};

export async function analyzeCode(code: string, language = "auto"): Promise<any> {
  const findings: Finding[] = [];
  const codeLower = code.toLowerCase();
  
  for (const [, patterns] of Object.entries(RISK_PATTERNS)) {
    for (const p of patterns) {
      if (codeLower.includes(p.pattern.toLowerCase())) {
        // Find line number
        const lines = code.split("\n");
        const lineIdx = lines.findIndex(l => l.toLowerCase().includes(p.pattern.toLowerCase()));
        findings.push({ ...p, line: lineIdx >= 0 ? lineIdx + 1 : undefined });
      }
    }
  }
  
  // Sort by risk
  const riskOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  findings.sort((a, b) => (riskOrder[a.risk] || 4) - (riskOrder[b.risk] || 4));
  
  return {
    total_findings: findings.length,
    critical: findings.filter(f => f.risk === "critical").length,
    high: findings.filter(f => f.risk === "high").length,
    medium: findings.filter(f => f.risk === "medium").length,
    low: findings.filter(f => f.risk === "low").length,
    findings,
    language,
    analyzed_at: Date.now(),
  };
}

export async function checkDependencies(deps: Record<string, string>): Promise<any> {
  const risks: any[] = [];
  for (const [name, version] of Object.entries(deps)) {
    if (version.startsWith("0.")) {
      risks.push({ dependency: name, risk: "medium", reason: "Pre-1.0 version (unstable API)" });
    }
    if (version.includes("alpha") || version.includes("beta")) {
      risks.push({ dependency: name, risk: "high", reason: "Alpha/beta version in production" });
    }
  }
  return { total: Object.keys(deps).length, risks };
}
