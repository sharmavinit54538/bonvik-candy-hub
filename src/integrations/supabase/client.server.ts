// Server-side Supabase client with service role key - bypasses RLS.
// Use this for admin operations in server functions and server routes only.
// For user-authenticated queries (with RLS), use the auth middleware instead.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function createSupabaseAdminClient(): SupabaseClient<Database> {
  const SUPABASE_URL =
    (typeof process !== "undefined" &&
      (process.env?.SUPABASE_URL || process.env?.VITE_SUPABASE_URL)) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
    "";

  const SUPABASE_SERVICE_ROLE_KEY =
    (typeof process !== "undefined" &&
      (process.env?.SUPABASE_SERVICE_ROLE_KEY ||
        process.env?.SUPABASE_PUBLISHABLE_KEY ||
        process.env?.VITE_SUPABASE_PUBLISHABLE_KEY)) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
    "";

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
      "[Supabase Admin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
    return createClient<Database>(
      "https://placeholder-url.supabase.co",
      "placeholder-service-key",
      {
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseAdmin: SupabaseClient<Database> | undefined;

// Server-side Supabase client with service role - bypasses RLS
// SECURITY: Only use this for trusted server-side operations, never expose to client code
// Import like: import { supabaseAdmin } from "@/integrations/supabase/client.server";
export const supabaseAdmin = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
