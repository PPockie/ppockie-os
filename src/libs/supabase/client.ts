import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
  );
}

// Content is public and read-only, so a plain anon client is enough (no cookies/auth).
// Responses are cached by Next.js and revalidated hourly, so pages keep rendering
// from cache even if the free-tier database is paused.
// In development it is 0 so an edit made in the dashboard shows up on the next refresh.
export const REVALIDATE_SECONDS = process.env.NODE_ENV === "development" ? 0 : 3600;

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (input, init) =>
      fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS } }),
  },
});
