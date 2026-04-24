import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PendingBlogRow } from "@/components/admin/pending-blog-row"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"

export const metadata = {
  title: "Pending Blog Posts | Admin | TheArkitecktsHub",
  description: "Review and manage pending blog post submissions",
}

export default async function PendingBlogsPage() {
  const supabase = await createClient()

  const { data: pendingBlogs, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      category,
      read_time_minutes,
      created_at,
      author:author_id(id, display_name, avatar_url),
      published
    `
    )
    .eq("published", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending blogs:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Pending Blog Posts</h2>
        <p className="mt-2 text-muted-foreground">Review and approve blog submissions from authors</p>
      </div>

      {!pendingBlogs || pendingBlogs.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No Pending Blog Posts</EmptyTitle>
            <EmptyDescription>All blog submissions have been reviewed. Check back later for new submissions!</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {pendingBlogs.map((blog) => (
            <PendingBlogRow
              key={blog.id}
              blog={{
                ...blog,
                author: Array.isArray(blog.author) ? blog.author[0] : blog.author,
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
