import Link from "next/link"
import { ArchitectsManager } from "@/components/admin/architects-manager"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Architects | Admin | TheArkitecktsHub",
  description: "Add and remove architect profiles",
}

export default async function AdminArchitectsPage() {
  const supabase = await createClient()
  const { data: architects, error } = await supabase
    .from("architects")
    .select(
      "id, name, title, bio, avatar_url, location, website_url, instagram_url, linkedin_url, specialties, years_of_experience, featured"
    )
    .order("featured", { ascending: false })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching architects:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Architect Management</h2>
          <p className="mt-1 text-muted-foreground">Create or remove architect profiles from the public directory.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

      <ArchitectsManager architects={architects || []} />
    </div>
  )
}
