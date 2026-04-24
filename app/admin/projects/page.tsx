import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PublishedProjectRow } from "@/components/admin/published-project-row"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"

export const metadata = {
  title: "Published Projects | Admin | TheArkitecktsHub",
  description: "Manage and edit published projects",
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      title,
      location,
      category,
      style,
      cover_image_url,
      created_at,
      architect:architect_id(id, name, avatar_url)
    `
    )
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Published Projects</h2>
        <p className="mt-2 text-muted-foreground">Edit or delete published projects</p>
      </div>

      {!projects || projects.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No Published Projects</EmptyTitle>
            <EmptyDescription>There are no published projects yet.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <PublishedProjectRow
              key={project.id}
              project={{
                ...project,
                architect: Array.isArray(project.architect) ? project.architect[0] : project.architect,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
