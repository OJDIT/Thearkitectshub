import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { PendingProjectRow } from "@/components/admin/pending-project-row"

export default async function PendingProjectsPage() {
  const supabase = await createClient()

  const { data: pendingProjects, error } = await supabase
    .from("pending_projects")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending projects:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Pending Project Submissions</h2>
          <p className="text-muted-foreground mt-1">Review and approve user-submitted projects</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

      {!pendingProjects || pendingProjects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">No pending projects</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingProjects.map((project) => (
            <PendingProjectRow key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
