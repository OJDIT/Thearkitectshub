import Link from "next/link"
import { BlogsManager } from "@/components/admin/blogs-manager"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Blogs | Admin | TheArkitecktsHub",
  description: "Create, edit, and delete blog posts.",
}

export default async function AdminBlogsPage() {
  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, cover_image_url, category, tags, read_time_minutes, published, published_at, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Blog Management</h2>
          <p className="mt-1 text-muted-foreground">Create, update, publish, and delete blog posts from one place.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>
      <BlogsManager posts={posts || []} />
    </div>
  )
}
