# VETRON Engine

Autonomous AI Software Engineering Agent Backend.

Philosophy: *Think. Reason. Build. Verify. Improve. Repeat.*

## Deploy to Vercel

1. Import this repo into Vercel
2. Add environment variables:
   - `GROQ_API_KEY` — Get from https://console.groq.com
   - `SUPABASE_URL` — Your Supabase project URL
   - `SUPABASE_SERVICE_KEY` — Supabase service role key
3. Deploy

## API Endpoints

- `GET /` — Engine info
- `GET /vetron/state` — Current state
- `GET /vetron/agents` — List 22 engineering agents
- `POST /vetron/think` — Main pipeline (supports SSE streaming)
- `POST /vetron/quick-build` — Quick build task
- `POST /vetron/predict/code` — Analyze code for issues
- `POST /vetron/predict/dependencies` — Check dependency risks
- `POST /vetron/memory/remember` — Store memory
- `GET /vetron/memory/recall?q=` — Recall memories
- `GET /vetron/memory/all` — List all memories
- `DELETE /vetron/memory/:key` — Forget memory
- `POST /vetron/learn/docs` — Learn from documentation
- `POST /vetron/learn/releases` — Learn from release notes
- `GET /vetron/learn/status` — Learning status
- `GET /vetron/learn/search?topic=` — Search knowledge base
