"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { createSafeStoragePath } from "@/lib/storage"
import { Loader2 } from "lucide-react"

const CATEGORIES = ["Residential", "Commercial", "Institutional", "Mixed-Use", "Infrastructure", "Landscape", "Other"]
const STYLES = ["Modern", "Contemporary", "Traditional", "Minimalist", "Brutalist", "Parametric", "Sustainable", "Other"]

export function ProjectUploadForm({ userId }: { userId: string }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    style: "",
    year_completed: new Date().getFullYear(),
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const MAX_IMAGES = 5

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year_completed" ? parseInt(value) : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalImages = imageFiles.length + files.length

    if (totalImages > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images. You currently have ${imageFiles.length} images.`)
      return
    }

    const newFiles = [...imageFiles, ...files]
    setImageFiles(newFiles)

    // Create previews for new files
    const newPreviews = [...imagePreviews]
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        setImagePreviews([...newPreviews])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImageFiles(newFiles)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.location || !formData.category) {
        setError("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      const imageUrls: string[] = []

      // Upload images if provided
      if (imageFiles.length > 0) {
        for (const imageFile of imageFiles) {
          const fileName = createSafeStoragePath(`projects/${userId}`, imageFile.name, "project")
          const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(fileName, imageFile)

          if (uploadError) {
            throw new Error(`Image upload failed: ${uploadError.message}`)
          }

          const { data: publicUrlData } = supabase.storage.from("project-images").getPublicUrl(fileName)
          imageUrls.push(publicUrlData.publicUrl)
        }
      }

      // Insert into pending_projects
      const { data, error: insertError } = await supabase.from("pending_projects").insert({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        style: formData.style,
        year_completed: formData.year_completed,
        cover_image_url: imageUrls[0] || "",
        image_urls: imageUrls,
        user_id: userId,
        status: "pending",
      })

      if (insertError) {
        throw new Error(`Failed to submit project: ${insertError.message}`)
      }

      // Redirect to success page
      router.push("/submit-project/success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Fill in the information about your project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Modern Glass Tower"
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project, its inspiration, and key features..."
                className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="style">Architectural Style</Label>
              <select
                id="style"
                name="style"
                value={formData.style}
                onChange={handleInputChange}
                className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a style</option>
                {STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="year_completed">Year Completed</Label>
              <Input
                id="year_completed"
                name="year_completed"
                type="number"
                value={formData.year_completed}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
                className="mt-2"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="images">Project Images (Up to {MAX_IMAGES})</Label>
            <div className="mt-2">
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={imageFiles.length >= MAX_IMAGES}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Upload up to {MAX_IMAGES} images. Recommended: 1200x800px each. Max 5MB per image.
              </p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium mb-3">
                  {imagePreviews.length} image{imagePreviews.length !== 1 ? "s" : ""} selected
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        ✕
                      </button>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        {index === 0 ? "Cover" : `Image ${index + 1}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Project for Review"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Your project will be reviewed by our team. You'll be notified once it's been approved or if we need more information.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
