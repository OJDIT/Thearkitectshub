"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Trash2, AlertCircle } from "lucide-react"

interface Author {
  id: string
  display_name: string
  avatar_url: string | null
}

interface PendingBlog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string
  category: string
  read_time_minutes: number
  created_at: string
  author: Author
  published: boolean
}

export function PendingBlogRow({ blog }: { blog: PendingBlog }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleApprove = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          published: true,
          published_at: new Date().toISOString(),
        })
        .eq("id", blog.id)

      if (updateError) {
        throw new Error(`Failed to approve blog: ${updateError.message}`)
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post? This cannot be undone.")) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Delete the cover image from storage
      if (blog.cover_image_url) {
        const fileName = blog.cover_image_url.split("/").pop()
        if (fileName) {
          await supabase.storage.from("project-images").remove([fileName])
        }
      }

      // Delete the blog post
      const { error: deleteError } = await supabase.from("blog_posts").delete().eq("id", blog.id)

      if (deleteError) {
        throw new Error(`Failed to delete blog: ${deleteError.message}`)
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {blog.cover_image_url && (
            <div className="lg:col-span-1">
              <div className="relative h-40 rounded-lg overflow-hidden bg-muted">
                <img
                  src={blog.cover_image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className={blog.cover_image_url ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{blog.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    {blog.author.avatar_url ? (
                      <img
                        src={blog.author.avatar_url}
                        alt={blog.author.display_name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold">
                        {blog.author.display_name.charAt(0)}
                      </div>
                    )}
                    {blog.author.display_name}
                  </span>
                  <span>•</span>
                  <span>{formatDate(blog.created_at)}</span>
                  <span>•</span>
                  <span>{blog.category}</span>
                  <span>•</span>
                  <span>{blog.read_time_minutes} min read</span>
                </div>
              </div>

              <p className="text-muted-foreground line-clamp-2">{blog.excerpt}</p>

              <div className="border-t pt-4">
                <details className="cursor-pointer">
                  <summary className="font-medium hover:text-foreground transition-colors">
                    View Full Content
                  </summary>
                  <div className="mt-3 max-h-64 overflow-y-auto bg-muted rounded p-3 whitespace-pre-wrap text-sm">
                    {blog.content}
                  </div>
                </details>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve & Publish
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1 sm:flex-initial"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
