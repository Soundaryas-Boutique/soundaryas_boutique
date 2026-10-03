import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client. It holds the service-role key, which bypasses
// RLS, so it must never be imported into a Client Component -- every caller is
// a route handler or a Server Component that has already checked the session.
//
// Created lazily: `next build` evaluates modules while collecting page data, and
// a missing env var should fail the request, not the build.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client = null;

export function supabase() {
  if (client) return client;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}
