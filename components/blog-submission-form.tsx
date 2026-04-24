"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { createSafeStoragePath } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

const CATEGORIES = ["Design Theory", "Case Study", "Industry News", "Interview", "Tutorial", "Opinion", "Other"]

interface FormData {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string
  coverImage: File | null
}

export function BlogSubmissionForm({ userId }: { userId: string }) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    excerpt: "",
    content: "",
    category: "Case Study",
    tags: "",
    coverImage: null,
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required")
      }
      if (!formData.excerpt.trim()) {
        throw new Error("Excerpt is required")
      }
      if (!formData.content.trim()) {
        throw new Error("Content is required")
      }
      if (!formData.coverImage) {
        throw new Error("Cover image is required")
      }

      let coverImageUrl = ""

      // Upload cover image
      const fileName = createSafeStoragePath(`blogs/${userId}`, formData.coverImage.name, "blog")
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, formData.coverImage, { upsert: true })

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`)
      }

      const { data: publicUrlData } = supabase.storage.from("project-images").getPublicUrl(fileName)
      coverImageUrl = publicUrlData.publicUrl

      // Calculate read time (assuming 200 words per minute)
      const wordCount = formData.content.split(/\s+/).length
      const readTimeMinutes = Math.ceil(wordCount / 200)

      // Generate slug from title
      const slug = `${generateSlug(formData.title)}-${Date.now()}`

      // Parse tags
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      // Insert blog post
      const { error: insertError } = await supabase.from("blog_posts").insert({
        author_id: userId,
        title: formData.title,
        slug: slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image_url: coverImageUrl,
        category: formData.category,
        tags: tags.length > 0 ? tags : null,
        read_time_minutes: readTimeMinutes,
        published: false,
      })

      if (insertError) {
        throw new Error(`Failed to submit blog post: ${insertError.message}`)
      }

      setSuccess(true)
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "Case Study",
        tags: "",
        coverImage: null,
      })
      setImagePreview("")

      // Redirect to success page
      setTimeout(() => {
        router.push("/submit-blog/success")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Blog post submitted successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Blog Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., The Future of Sustainable Architecture"
              maxLength={120}
              required
            />
            <p className="text-xs text-muted-foreground">{formData.title.length}/120 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="A brief summary of your blog post (shown in listings)"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
              maxLength={300}
              required
            />
            <p className="text-xs text-muted-foreground">{formData.excerpt.length}/300 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your full blog post content here..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono text-sm"
              rows={12}
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.content.split(/\s+/).length} words
              {formData.content.split(/\s+/).length > 0 && ` • ~${Math.ceil(formData.content.split(/\s+/).length / 200)} min read`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., sustainability, design, innovation"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">Recommended: 1200x800px. Max 5MB.</p>
              </div>
              {imagePreview && (
                <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              {isLoading ? "Submitting..." : "Submit Blog Post"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground border-t pt-4">
            By submitting, you agree that your content will be reviewed by our team before publication. We reserve the right to edit or reject submissions that don't meet our quality standards.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
