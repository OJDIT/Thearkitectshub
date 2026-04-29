import { createBrowserClient } from "@supabase/ssr"
import { getRequiredEnvValue } from "@/lib/supabase/env"

export function createClient() {
  return createBrowserClient(
    getRequiredEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  )
}
