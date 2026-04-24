import Link from "next/link"
import { ResourcesManager } from "@/components/admin/resources-manager"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Resources | Admin | TheArkitecktsHub",
  description: "Create, edit, and delete resources.",
}

export default async function AdminResourcesPage() {
  const supabase = await createClient()
  const { data: resources, error } = await supabase
    .from("resources")
    .select("id, title, description, resource_type, category, url, thumbnail_url, tags, featured")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching resources:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Resources Management</h2>
          <p className="mt-1 text-muted-foreground">Publish, edit, and remove resources from the public library.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>
      <ResourcesManager resources={resources || []} />
    </div>
  )
}
