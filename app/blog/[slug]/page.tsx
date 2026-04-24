import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from("blog_posts").select("title, excerpt").eq("slug", slug).single()

  if (!post) {
    return {
      title: "Article Not Found - TheArkitecktsHub",
    }
  }

  return {
    title: `${post.title} - Blog - TheArkitecktsHub`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, profiles(id, display_name, avatar_url, bio)")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      {/* Back Navigation */}
      <div className="bg-background py-6">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <article className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-6">
            <Badge variant="secondary" className="text-sm">
              {post.category}
            </Badge>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6 text-balance">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8 text-pretty">{post.excerpt}</p>

          {/* Author & Meta */}
          <div className="flex items-center gap-6 py-6 border-y border-border">
            {post.profiles && (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                  {post.profiles.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url || "/placeholder.svg"}
                      alt={post.profiles.display_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-lg font-semibold text-secondary-foreground">
                      {post.profiles.display_name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{post.profiles.display_name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {post.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {post.read_time_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.read_time_minutes} min read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="my-12 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
            <img
              src={post.cover_image_url || "/placeholder.svg"}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-line">{post.content}</div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.profiles && post.profiles.bio && (
            <div className="mt-12 rounded-lg border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">About the Author</h3>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-muted flex-shrink-0">
                  {post.profiles.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url || "/placeholder.svg"}
                      alt={post.profiles.display_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-xl font-semibold text-secondary-foreground">
                      {post.profiles.display_name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-2">{post.profiles.display_name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.profiles.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
