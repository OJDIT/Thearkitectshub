import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get pending projects count
  const { count: pendingCount } = await supabase
    .from("pending_projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  // Get published projects count
  const { count: publishedCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("published", true)

  // Get pending blog posts count
  const { count: pendingBlogsCount } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("published", false)

  // Get published blog posts count
  const { count: publishedBlogsCount } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Pending Projects</CardTitle>
          <CardDescription>Submissions awaiting review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{pendingCount || 0}</p>
              <p className="text-sm text-muted-foreground mt-2">Projects waiting for approval</p>
            </div>
            <Button asChild>
              <Link href="/admin/pending-projects">Review</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Published Projects</CardTitle>
          <CardDescription>Approved and live projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{publishedCount || 0}</p>
              <p className="text-sm text-muted-foreground mt-2">Currently visible on site</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/projects">View</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Blog Posts</CardTitle>
          <CardDescription>Blog submissions awaiting review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{pendingBlogsCount || 0}</p>
              <p className="text-sm text-muted-foreground mt-2">Blog posts waiting for approval</p>
            </div>
            <Button asChild>
              <Link href="/admin/pending-blogs">Review</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Published Blog Posts</CardTitle>
          <CardDescription>Approved, live, and admin-managed blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{publishedBlogsCount || 0}</p>
              <p className="text-sm text-muted-foreground mt-2">Currently visible on site</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/blogs">Manage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>Manage architects and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/architects">Manage Architects</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/resources">Manage Resources</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/blogs">Manage Blog Posts</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
