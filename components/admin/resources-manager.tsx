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

interface Resource {
  id: string
  title: string
  description: string
  resource_type: string
  category: string
  url: string
  thumbnail_url: string | null
  tags: string[] | null
  featured: boolean
}

const defaultForm = {
  title: "",
  description: "",
  resource_type: "Guide",
  category: "",
  url: "",
  thumbnail_url: "",
  tags: "",
  featured: false,
}

const resourceTypes = ["Guide", "Template", "Tool", "Article"]

export function ResourcesManager({ resources }: { resources: Resource[] }) {
  const [formData, setFormData] = useState(defaultForm)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const resetForm = () => {
    setFormData(defaultForm)
    setThumbnailFile(null)
    setThumbnailPreview("")
    setEditingId(null)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Thumbnail image must be less than 5MB.")
      return
    }

    setError(null)
    setThumbnailFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id)
    setFormData({
      title: resource.title,
      description: resource.description,
      resource_type: resource.resource_type,
      category: resource.category,
      url: resource.url,
      thumbnail_url: resource.thumbnail_url || "",
      tags: resource.tags?.join(", ") || "",
      featured: resource.featured,
    })
    setThumbnailFile(null)
    setThumbnailPreview(resource.thumbnail_url || "")
    setError(null)
    setSuccess(null)
  }

  const uploadThumbnailIfNeeded = async () => {
    if (!thumbnailFile) {
      return formData.thumbnail_url
    }

    const fileName = createSafeStoragePath("resources/admin", thumbnailFile.name, "thumbnail")
    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, thumbnailFile, { upsert: true })

    if (uploadError) {
      throw new Error(`Thumbnail upload failed: ${uploadError.message}`)
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
      const thumbnailUrl = await uploadThumbnailIfNeeded()

      const response = await fetch(editingId ? `/api/admin/resources/${editingId}` : "/api/admin/resources", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          thumbnail_url: thumbnailUrl,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save resource.")
      }

      setSuccess(editingId ? "Resource updated." : "Resource created.")
      resetForm()
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save resource.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resource?")) {
      return
    }

    setDeletingId(id)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/admin/resources/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete resource.")
      }

      setSuccess("Resource deleted.")
      if (editingId === id) {
        resetForm()
      }
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete resource.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Resource" : "Add Resource"}</CardTitle>
          <CardDescription>Publish guides, templates, tools, and reading material from the admin dashboard.</CardDescription>
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
              <Label htmlFor="resource-title">Title</Label>
              <Input id="resource-title" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource-description">Description</Label>
              <textarea
                id="resource-description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="resource-type">Type</Label>
                <select
                  id="resource-type"
                  value={formData.resource_type}
                  onChange={(e) => setFormData((p) => ({ ...p, resource_type: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-category">Category</Label>
                <Input id="resource-category" value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource-url">Resource URL</Label>
              <Input id="resource-url" value={formData.url} onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource-thumbnail">Thumbnail URL</Label>
              <Input id="resource-thumbnail" value={formData.thumbnail_url} onChange={(e) => setFormData((p) => ({ ...p, thumbnail_url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource-thumbnail-file">Thumbnail Image</Label>
              <Input id="resource-thumbnail-file" type="file" accept="image/*" onChange={handleThumbnailChange} />
              <p className="text-xs text-muted-foreground">Upload a thumbnail image up to 5MB, or keep using a direct image URL above.</p>
            </div>
            {(thumbnailPreview || formData.thumbnail_url) && (
              <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={thumbnailPreview || formData.thumbnail_url}
                    alt="Resource thumbnail preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground">Thumbnail preview</p>
                  <p className="text-xs text-muted-foreground">This image will appear on the public resources page.</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="resource-tags">Tags</Label>
              <Input id="resource-tags" value={formData.tags} onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))} placeholder="materials, sustainability, workflow" />
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium">
              <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))} className="h-4 w-4" />
              Feature this resource
            </label>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingId ? "Save Changes" : "Create Resource"}
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
          <CardTitle>All Resources</CardTitle>
          <CardDescription>Edit or remove resources from the public library.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resources.map((resource) => (
            <div key={resource.id} className="rounded-2xl border border-border/60 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{resource.title}</p>
                    <Badge variant="secondary">{resource.resource_type}</Badge>
                    {resource.featured && <Badge>Featured</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{resource.category}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{resource.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(resource)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(resource.id)} disabled={deletingId === resource.id}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deletingId === resource.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {resources.length === 0 && <p className="text-sm text-muted-foreground">No resources yet.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
