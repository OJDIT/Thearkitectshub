"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Edit2, Loader2, Plus, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { createSafeStoragePath } from "@/lib/storage"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string
  category: string
  tags: string[] | null
  read_time_minutes: number | null
  published: boolean
  published_at: string | null
  created_at: string
}

const defaultForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "Case Study",
  tags: "",
  cover_image_url: "",
  published: true,
}

const categories = ["Design Theory", "Case Study", "Industry News", "Interview", "Tutorial", "Opinion", "Other"]

export function BlogsManager({ posts }: { posts: BlogPost[] }) {
  const [formData, setFormData] = useState(defaultForm)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const resetForm = () => {
    setFormData(defaultForm)
    setCoverFile(null)
    setPreviewUrl("")
    setEditingId(null)
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image must be less than 5MB.")
      return
    }

    setCoverFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags?.join(", ") || "",
      cover_image_url: post.cover_image_url,
      published: post.published,
    })
    setPreviewUrl(post.cover_image_url)
    setCoverFile(null)
    setError(null)
    setSuccess(null)
  }

  const uploadCoverIfNeeded = async () => {
    if (!coverFile) {
      return formData.cover_image_url
    }

    const fileName = createSafeStoragePath("blogs/admin", coverFile.name, "cover")
    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, coverFile, { upsert: true })

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`)
    }

    const { data } = supabase.storage.from("project-images").getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const coverImageUrl = await uploadCoverIfNeeded()

      const response = await fetch(editingId ? `/api/admin/blogs/${editingId}` : "/api/admin/blogs", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cover_image_url: coverImageUrl,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to save blog post.")
      }

      setSuccess(editingId ? "Blog post updated." : "Blog post created.")
      resetForm()
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save blog post.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) {
      return
    }

    setDeletingId(id)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete blog post.")
      }

      setSuccess("Blog post deleted.")
      if (editingId === id) {
        resetForm()
      }
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete blog post.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Blog Post" : "Create Blog Post"}</CardTitle>
          <CardDescription>Publish directly from admin with cover image, content, and tags.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input id="blog-title" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-excerpt">Excerpt</Label>
              <textarea
                id="blog-excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="blog-category">Category</Label>
                <select
                  id="blog-category"
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-tags">Tags</Label>
                <Input id="blog-tags" value={formData.tags} onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))} placeholder="design, sustainability, case-study" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-cover">Cover Image</Label>
              <Input id="blog-cover" type="file" accept="image/*" onChange={handleCoverChange} />
              {(previewUrl || formData.cover_image_url) && (
                <div className="mt-3 h-40 overflow-hidden rounded-xl bg-muted">
                  <img src={previewUrl || formData.cover_image_url} alt="Cover preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-content">Content</Label>
              <textarea
                id="blog-content"
                value={formData.content}
                onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                rows={12}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData((p) => ({ ...p, published: e.target.checked }))}
                className="h-4 w-4"
              />
              Publish immediately
            </label>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingId ? "Save Changes" : "Create Blog Post"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>Review, edit, and remove published or draft posts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-2xl border border-border/60 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{post.title}</p>
                    <Badge variant={post.published ? "default" : "secondary"}>{post.published ? "Published" : "Draft"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{post.category}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)} disabled={deletingId === post.id}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deletingId === post.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="text-sm text-muted-foreground">No blog posts yet.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
