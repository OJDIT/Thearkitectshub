import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile-form"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Profile Settings | TheArkitecktsHub",
  description: "Manage your profile and settings",
}

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-foreground">Profile Settings</h1>
          <p className="mt-4 text-lg text-muted-foreground">Manage your account and profile information</p>
        </div>

        <ProfileForm profile={profile} userEmail={user.email || ""} userId={user.id} />
      </div>
    </main>
  )
}
