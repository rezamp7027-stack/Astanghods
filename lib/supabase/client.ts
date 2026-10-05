import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { supabaseConfig } from "./config";

export function createClient() {
  return createBrowserClient<Database>(
    supabaseConfig.url,
    supabaseConfig.publishableKey
  );
}
