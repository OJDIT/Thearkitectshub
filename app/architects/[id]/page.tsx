import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Globe, Instagram, Linkedin, ArrowLeft, Calendar } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: architect } = await supabase.from("architects").select("name, bio").eq("id", id).single()

  if (!architect) {
    return {
      title: "Architect Not Found - TheArkitecktsHub",
    }
  }

  return {
    title: `${architect.name} - Architects - TheArkitecktsHub`,
    description: architect.bio,
  }
}

export default async function ArchitectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: architect } = await supabase.from("architects").select("*").eq("id", id).single()

  if (!architect) {
    notFound()
  }

  // Fetch architect's projects
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, location, category, cover_image_url, year_completed")
    .eq("architect_id", id)
    .eq("published", true)
    .order("year_completed", { ascending: false })

  return (
    <div className="flex flex-col">
      {/* Back Navigation */}
      <div className="bg-background py-6">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/architects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Architects
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <section className="bg-background py-16 sm:py-20 border-b border-border">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="h-40 w-40 overflow-hidden rounded-full bg-muted">
                    {architect.avatar_url ? (
                      <img
                        src={architect.avatar_url || "/placeholder.svg"}
                        alt={architect.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary text-5xl font-semibold text-secondary-foreground">
                        {architect.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-2">{architect.name}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{architect.title}</p>
                  {architect.location && (
                    <div className="flex items-center gap-2 text-muted-foreground mb-6">
                      <MapPin className="h-4 w-4" />
                      <span>{architect.location}</span>
                    </div>
                  )}
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{architect.bio}</p>
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Specialties */}
                {architect.specialties && architect.specialties.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {architect.specialties.map((specialty: string) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {architect.years_of_experience && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Experience</h3>
                    <p className="text-sm text-muted-foreground">{architect.years_of_experience} years</p>
                  </div>
                )}

                {/* Links */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Connect</h3>
                  <div className="space-y-2">
                    {architect.website_url && (
                      <a
                        href={architect.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}
                    {architect.instagram_url && (
                      <a
                        href={architect.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {architect.linkedin_url && (
                      <a
                        href={architect.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="bg-card py-16 sm:py-20">
          <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-12">Projects</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={project.cover_image_url || "/placeholder.svg"}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{project.title}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {project.location && <span>{project.location}</span>}
                        {project.year_completed && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.year_completed}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
