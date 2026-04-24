import { getUser, createClient } from "@/lib/supabase/server"

export async function requireAdmin() {
  const user = await getUser()

  if (!user) {
    return { error: "Unauthorized", status: 401 as const }
  }

  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (error || !profile?.is_admin) {
    return { error: "Forbidden", status: 403 as const }
  }

  return { user }
}
