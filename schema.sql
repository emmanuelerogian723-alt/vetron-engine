-- VETRON MEMORY SCHEMA
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS vetron_memory (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  category TEXT DEFAULT 'general',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vetron_tasks (
  id BIGSERIAL PRIMARY KEY,
  request TEXT NOT NULL,
  result JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  agents_used TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vetron_knowledge (
  id BIGSERIAL PRIMARY KEY,
  topic TEXT NOT NULL,
  source TEXT,
  content TEXT,
  concepts TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT TRUE,
  learned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vetron_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetron_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetron_knowledge ENABLE ROW LEVEL SECURITY;

-- Service role access
CREATE POLICY "Service role full access" ON vetron_memory FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON vetron_tasks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON vetron_knowledge FOR ALL USING (auth.role() = 'service_role');
