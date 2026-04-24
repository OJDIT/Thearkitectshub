"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { createSafeStoragePath } from "@/lib/storage"
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Architect {
  id: string
  name: string
  title: string
  bio: string
  avatar_url: string | null
  location: string | null
  website_url: string | null
  instagram_url: string | null
  linkedin_url: string | null
  specialties: string[] | null
  years_of_experience: number | null
  featured: boolean
}

const initialFormState = {
  name: "",
  title: "",
  bio: "",
  avatar_url: "",
  location: "",
  website_url: "",
  instagram_url: "",
  linkedin_url: "",
  specialties: "",
  years_of_experience: "",
  featured: false,
}

export function ArchitectsManager({ architects }: { architects: Architect[] }) {
  const [formData, setFormData] = useState(initialFormState)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Architect image must be less than 5MB.")
      return
    }

    setAvatarFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      let avatarUrl = formData.avatar_url

      if (avatarFile) {
        const fileName = createSafeStoragePath("architects", avatarFile.name, "portrait")
        const { error: uploadError } = await supabase.storage
          .from("profile-avatars")
          .upload(fileName, avatarFile, { upsert: true })

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`)
        }

        const { data: publicUrlData } = supabase.storage.from("profile-avatars").getPublicUrl(fileName)
        avatarUrl = publicUrlData.publicUrl
      }

      const response = await fetch("/api/admin/architects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          avatar_url: avatarUrl,
          specialties: formData.specialties
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          years_of_experience: formData.years_of_experience,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create architect")
      }

      setFormData(initialFormState)
      setAvatarFile(null)
      setAvatarPreview("")
      setSuccess("Architect added successfully.")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create architect")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this architect? Projects linked to them will keep their project records but lose the architect connection.")) {
      return
    }

    setDeletingId(id)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/admin/architects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete architect")
      }

      setSuccess("Architect removed successfully.")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete architect")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Add Architect</CardTitle>
          <CardDescription>Create a new architect profile for the public directory.</CardDescription>
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
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Founding Architect"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Short professional biography"
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Lagos, Nigeria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Architect Image</Label>
                <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
                <p className="text-xs text-muted-foreground">Upload a portrait image up to 5MB.</p>
              </div>
            </div>

            {(avatarPreview || formData.avatar_url) && (
              <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-muted">
                  <img
                    src={avatarPreview || formData.avatar_url}
                    alt="Architect preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Portrait preview</p>
                  <p className="text-xs text-muted-foreground">This image will appear on the public architect profile.</p>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website_url">Website</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website_url: e.target.value }))}
                  placeholder="https://studio.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years_of_experience">Years of Experience</Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  min="0"
                  value={formData.years_of_experience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, years_of_experience: e.target.value }))}
                  placeholder="12"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, instagram_url: e.target.value }))}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties</Label>
              <Input
                id="specialties"
                value={formData.specialties}
                onChange={(e) => setFormData((prev) => ({ ...prev, specialties: e.target.value }))}
                placeholder="Residential, Commercial, Sustainable Design"
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 rounded border-input"
              />
              Feature this architect on the public site
            </label>

            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {isSubmitting ? "Adding..." : "Add Architect"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Architects</CardTitle>
          <CardDescription>Additions and removals update the public architects directory.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {architects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No architects have been added yet.</p>
          ) : (
            architects.map((architect) => (
              <div key={architect.id} className="rounded-2xl border border-border/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{architect.name}</p>
                      {architect.featured && <Badge>Featured</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{architect.title}</p>
                    {architect.location && <p className="mt-1 text-xs text-muted-foreground">{architect.location}</p>}
                    {architect.specialties && architect.specialties.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {architect.specialties.slice(0, 4).map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(architect.id)}
                    disabled={deletingId === architect.id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deletingId === architect.id ? "Removing..." : "Remove"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
