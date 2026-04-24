import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Manage projects and content</p>
        </div>
        {children}
      </div>
    </div>
  )
}
