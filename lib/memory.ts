/**
 * VETRON MEMORY SYSTEM
 * Project memory that persists across sessions.
 * Uses Supabase if configured, falls back to in-memory.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;
const _local: Record<string, any> = {};

function getClient(): SupabaseClient | null {
  if (_client !== null) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    _client = createClient(url, key);
    return _client;
  }
  return null;
}

export async function remember(key: string, value: string, category = "general"): Promise<any> {
  const client = getClient();
  if (client) {
    try {
      const { error } = await client.from("vetron_memory").upsert({
        key, value, category, updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    } catch {
      _local[key] = { value, category, timestamp: Date.now() };
    }
  } else {
    _local[key] = { value, category, timestamp: Date.now() };
  }
  return { status: "remembered", key, value, category };
}

export async function recall(query: string): Promise<any[]> {
  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client.from("vetron_memory")
        .select("*")
        .or(`key.ilike.%${query}%,value.ilike.%${query}%`)
        .limit(20);
      if (error) throw error;
      return data || [];
    } catch {
      // fallback
    }
  }
  // Local search
  const results: any[] = [];
  const q = query.toLowerCase();
  for (const [k, v] of Object.entries(_local)) {
    if (k.toLowerCase().includes(q) || String(v.value).toLowerCase().includes(q)) {
      results.push({ key: k, ...v });
    }
  }
  return results.slice(0, 20);
}

export async function listAll(): Promise<any> {
  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client.from("vetron_memory").select("*").limit(100);
      if (error) throw error;
      return { entries: data || [], count: data?.length || 0, storage: "supabase" };
    } catch {
      // fallback
    }
  }
  return { entries: Object.entries(_local).map(([k, v]) => ({ key: k, ...v })), count: Object.keys(_local).length, storage: "local" };
}

export async function forget(key: string): Promise<any> {
  const client = getClient();
  if (client) {
    try {
      await client.from("vetron_memory").delete().eq("key", key);
    } catch {}
  }
  const existed = key in _local;
  delete _local[key];
  return { status: existed ? "forgotten" : "not_found", key };
}
