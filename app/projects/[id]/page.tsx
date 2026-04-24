import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Ruler, ArrowLeft } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: project } = await supabase.from("projects").select("title, description").eq("id", id).single()

  if (!project) {
    return {
      title: "Project Not Found - TheArkitecktsHub",
    }
  }

  return {
    title: `${project.title} - TheArkitecktsHub`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from("projects")
    .select("*, architects(id, name, title, avatar_url)")
    .eq("id", id)
    .eq("published", true)
    .single()

  if (!project) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      {/* Back Navigation */}
      <div className="bg-background py-6">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <section className="bg-muted">
        <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-8">
          <div className="aspect-[16/9] overflow-hidden rounded-lg bg-muted">
            <img
              src={project.cover_image_url || "/placeholder.svg"}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {project.category}
                </Badge>
                {project.style && (
                  <Badge variant="outline" className="text-sm">
                    {project.style}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">{project.description}</p>

              {/* Additional Images */}
              {project.image_urls && project.image_urls.length > 0 && (
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {project.image_urls.map((url: string, index: number) => (
                    <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`${project.title} - Image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Project Info */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Project Information</h3>
                  <div className="space-y-4">
                    {project.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Location</p>
                          <p className="text-sm text-muted-foreground">{project.location}</p>
                        </div>
                      </div>
                    )}
                    {project.year_completed && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Completed</p>
                          <p className="text-sm text-muted-foreground">{project.year_completed}</p>
                        </div>
                      </div>
                    )}
                    {project.area_sqm && (
                      <div className="flex items-start gap-3">
                        <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Area</p>
                          <p className="text-sm text-muted-foreground">{project.area_sqm} m²</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Architect Info */}
                {project.architects && (
                  <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Architect</h3>
                    <Link href={`/architects/${project.architects.id}`} className="flex items-center gap-4 group">
                      <div className="h-16 w-16 overflow-hidden rounded-full bg-muted flex-shrink-0">
                        {project.architects.avatar_url ? (
                          <img
                            src={project.architects.avatar_url || "/placeholder.svg"}
                            alt={project.architects.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-secondary text-xl font-semibold text-secondary-foreground">
                            {project.architects.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground group-hover:underline">
                          {project.architects.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{project.architects.title}</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
