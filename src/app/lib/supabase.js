import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client.
//
// This uses the secret key (sb_secret_...), not the publishable one. The secret
// key bypasses RLS, so it must never be imported into a Client Component --
// every caller is a route handler or a Server Component that has already
// checked the session. The publishable key would be blocked by RLS and every
// query would come back empty.
//
// Created lazily: `next build` evaluates modules while collecting page data, and
// a missing env var should fail the request, not the build.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

let client = null;

export function supabase() {
  if (client) return client;

  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  }

  client = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}
