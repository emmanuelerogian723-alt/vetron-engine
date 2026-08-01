/**
 * VETRON ENGINEERING TEAM
 * 22 specialized agents that collaborate internally.
 */

export interface Agent {
  key: string;
  name: string;
  role: string;
  icon: string;
  expertise: string[];
}

export const AGENTS: Record<string, Agent> = {
  chief_engineer: { key: "chief_engineer", name: "Chief Engineer", icon: "🎖", role: "Strategic oversight, final decisions", expertise: ["architecture", "strategy", "coordination"] },
  architect: { key: "architect", name: "Software Architect", icon: "🏗", role: "System design, patterns, scalability", expertise: ["system_design", "patterns", "api_design"] },
  frontend: { key: "frontend", name: "Frontend Engineer", icon: "🎨", role: "UI, responsive, accessibility", expertise: ["html", "css", "javascript", "react", "vue"] },
  backend: { key: "backend", name: "Backend Engineer", icon: "⚙", role: "API, server logic, data flow", expertise: ["python", "node", "databases", "apis"] },
  fullstack: { key: "fullstack", name: "Full-Stack Engineer", icon: "🔧", role: "End-to-end features", expertise: ["frontend", "backend", "deployment"] },
  mobile: { key: "mobile", name: "Mobile Engineer", icon: "📱", role: "iOS, Android, cross-platform", expertise: ["react_native", "flutter", "swift", "kotlin"] },
  devops: { key: "devops", name: "DevOps Engineer", icon: "🚀", role: "CI/CD, infrastructure", expertise: ["docker", "kubernetes", "github_actions"] },
  cloud: { key: "cloud", name: "Cloud Engineer", icon: "☁", role: "Cloud architecture, costs", expertise: ["aws", "gcp", "azure", "supabase"] },
  database: { key: "database", name: "Database Engineer", icon: "🗄", role: "Schema, queries, migrations", expertise: ["postgresql", "mongodb", "redis"] },
  security: { key: "security", name: "Security Engineer", icon: "🔒", role: "Vulnerabilities, auth, encryption", expertise: ["owasp", "auth", "secrets"] },
  qa: { key: "qa", name: "QA Engineer", icon: "✅", role: "Testing, validation", expertise: ["unit_tests", "e2e_tests"] },
  performance: { key: "performance", name: "Performance Engineer", icon: "⚡", role: "Optimization, profiling", expertise: ["profiling", "caching", "bundle_size"] },
  ai_engineer: { key: "ai_engineer", name: "AI Engineer", icon: "🧠", role: "ML, prompting, agent design", expertise: ["llms", "prompting", "rag"] },
  researcher: { key: "researcher", name: "Research Engineer", icon: "🔬", role: "New tech evaluation", expertise: ["docs", "frameworks"] },
  docs_writer: { key: "docs_writer", name: "Documentation", icon: "📝", role: "README, API docs, guides", expertise: ["markdown", "api_docs"] },
  automation: { key: "automation", name: "Automation Engineer", icon: "🤖", role: "Workflow automation, integrations", expertise: ["webhooks", "cron", "apis"] },
  product_designer: { key: "product_designer", name: "Product Designer", icon: "📐", role: "User flows, feature planning", expertise: ["user_flows", "wireframes"] },
  ux_designer: { key: "ux_designer", name: "UX Designer", icon: "✨", role: "Interaction, usability", expertise: ["usability", "accessibility", "motion"] },
  code_reviewer: { key: "code_reviewer", name: "Code Reviewer", icon: "👁", role: "Quality, best practices", expertise: ["code_quality", "patterns"] },
  release_manager: { key: "release_manager", name: "Release Manager", icon: "📦", role: "Deployments, versioning", expertise: ["deployments", "versioning", "rollback"] },
  data_engineer: { key: "data_engineer", name: "Data Engineer", icon: "📊", role: "Pipelines, ETL, data quality", expertise: ["etl", "pipelines"] },
  predictive: { key: "predictive", name: "Predictive Engineer", icon: "🔮", role: "Future bug detection, risk", expertise: ["static_analysis", "risk"] },
};

export function listAgents(): Agent[] {
  return Object.values(AGENTS);
}

export function getAgent(key: string): Agent | undefined {
  return AGENTS[key];
}
