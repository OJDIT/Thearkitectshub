"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"

interface Architect {
  id: string
  name: string
  avatar_url: string | null
}

interface PublishedProject {
  id: string
  title: string
  location: string
  category: string
  style: string
  cover_image_url: string
  created_at: string
  architect: Architect
}

export function PublishedProjectRow({ project }: { project: PublishedProject }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this published project? This cannot be undone.")) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete project")
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
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="mt-2">{project.location}</CardDescription>
          </div>
          <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
            Published
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

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium text-foreground">{project.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Style</p>
              <p className="font-medium text-foreground">{project.style}</p>
            </div>
          </div>

          {project.cover_image_url && (
            <div className="relative h-48 rounded-lg overflow-hidden bg-muted">
              <img
                src={project.cover_image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link href={`/projects/${project.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View on Site
              </Button>
            </Link>
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
      </CardContent>
    </Card>
  )
}
