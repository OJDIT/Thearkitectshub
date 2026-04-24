import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PublishedBlogRow } from "@/components/admin/published-blog-row"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"

export const metadata = {
  title: "Published Blog Posts | Admin | TheArkitecktsHub",
  description: "Manage and edit published blog posts",
}

export default async function PublishedBlogsPage() {
  const supabase = await createClient()

  const { data: blogs, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      cover_image_url,
      category,
      read_time_minutes,
      published_at,
      author:author_id(id, display_name, avatar_url)
    `
    )
    .eq("published", true)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching published blogs:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Published Blog Posts</h2>
        <p className="mt-2 text-muted-foreground">Edit or delete published blog posts</p>
      </div>

      {!blogs || blogs.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No Published Blog Posts</EmptyTitle>
            <EmptyDescription>There are no published blog posts yet.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <PublishedBlogRow
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
