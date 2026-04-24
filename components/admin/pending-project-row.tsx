"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PendingProject {
  id: string
  title: string
  description: string
  location: string
  category: string
  style: string
  cover_image_url: string
  image_urls?: string[] | null
  images_urls?: string[] | null
  year_completed: number
  user_id: string
  created_at: string
  status: string
}

export function PendingProjectRow({ project }: { project: PendingProject }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const imageUrls = project.image_urls || project.images_urls || []

  const handleAction = async (action: "approve" | "reject") => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/pending-projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${action} project`)
      }

      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to ${action} project`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this pending project? This cannot be undone.")) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/pending-projects/${project.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete project")
      }

      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="mt-2">{project.location}</CardDescription>
          </div>
          <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            Pending Review
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Category</p>
            <p className="font-medium">{project.category}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Style</p>
            <p className="font-medium">{project.style}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Year Completed</p>
            <p className="font-medium">{project.year_completed}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Submitted</p>
            <p className="font-medium">{new Date(project.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm mb-2">Description</p>
          <p className="text-foreground line-clamp-3">{project.description}</p>
        </div>

        {(imageUrls.length > 0) || project.cover_image_url ? (
          <div>
            <p className="text-muted-foreground text-sm mb-3">Project Images</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {imageUrls.length > 0
                ? imageUrls.map((url, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-muted aspect-square">
                      <img
                        src={url}
                        alt={`${project.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Cover
                        </div>
                      )}
                    </div>
                  ))
                : project.cover_image_url && (
                    <div className="relative rounded-lg overflow-hidden bg-muted aspect-square">
                      <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Cover
                      </div>
                    </div>
                  )}
            </div>
          </div>
        ) : null}

        <div className="flex gap-3 pt-4">
          <Button
            size="sm"
            variant="default"
            onClick={() => handleAction("approve")}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Approve
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleAction("reject")}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
            Reject
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
