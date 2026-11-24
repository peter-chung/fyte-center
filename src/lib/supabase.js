import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set (see .env.example)."
  );
}

// Read-only: the publishable key maps to the `anon` role, which only has
// SELECT on the fightcenter schema (RLS "public read" policies). Data is
// written by mma-scrape's nightly sync, never from the browser.
export const supabase = createClient(url, publishableKey, {
  db: { schema: "fightcenter" },
  auth: { persistSession: false, autoRefreshToken: false },
});
