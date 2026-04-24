import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"

export const metadata = {
  title: "Blog - TheArkitecktsHub",
  description: "Read insightful articles about architecture, design theory, case studies, and industry trends.",
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, cover_image_url, category, read_time_minutes, published_at, profiles(display_name)",
    )
    .eq("published", true)
    .order("published_at", { ascending: false })

  // Apply category filter
  if (params.category) {
    query = query.eq("category", params.category)
  }

  const { data: posts } = await query

  // Get unique categories
  const { data: allPosts } = await supabase.from("blog_posts").select("category").eq("published", true)

  const categories = Array.from(new Set(allPosts?.map((p) => p.category).filter(Boolean)))

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Blog</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Explore design theory, case studies, and insights into contemporary architectural practice.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-y border-border bg-card py-6">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant={!params.category ? "default" : "outline"} size="sm" asChild>
              <Link href="/blog">All Articles</Link>
            </Button>
            {categories.map((category) => (
              <Button key={category} variant={params.category === category ? "default" : "outline"} size="sm" asChild>
                <Link href={`/blog?category=${category}`}>{category}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <Card className="overflow-hidden border-none shadow-none transition-all hover:shadow-lg">
                    <div className="aspect-[16/9] overflow-hidden bg-muted rounded-lg">
                      <img
                        src={post.cover_image_url || "/placeholder.svg"}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6 pl-0">
                      <div className="mb-3">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3 group-hover:underline">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {post.profiles && <span>{(post.profiles as { display_name?: string }[])[0]?.display_name}</span>}
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(post.published_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        {post.read_time_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {post.read_time_minutes} min read
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-lg text-muted-foreground">No articles found in this category.</p>
              <Button variant="outline" className="mt-6 bg-transparent" asChild>
                <Link href="/blog">View All Articles</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
