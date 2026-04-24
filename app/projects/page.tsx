import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"

export const metadata = {
  title: "Projects - TheArkitecktsHub",
  description: "Explore contemporary architectural projects from visionary architects around the world.",
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; style?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from("projects")
    .select("id, title, description, location, category, style, cover_image_url, year_completed, architects(id, name)")
    .eq("published", true)
    .order("created_at", { ascending: false })

  // Apply filters
  if (params.category) {
    query = query.eq("category", params.category)
  }
  if (params.style) {
    query = query.eq("style", params.style)
  }

  const { data: projects } = await query

  // Get unique categories and styles for filter options
  const { data: allProjects } = await supabase.from("projects").select("category, style").eq("published", true)

  const categories = Array.from(new Set(allProjects?.map((p) => p.category).filter(Boolean)))
  const styles = Array.from(new Set(allProjects?.map((p) => p.style).filter(Boolean)))

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Projects</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Explore exceptional architectural works that push creative boundaries and demonstrate innovative design
              thinking.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-y border-border bg-card py-8">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter by:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant={!params.category && !params.style ? "default" : "outline"} size="sm" asChild>
                <Link href="/projects">All</Link>
              </Button>
              {categories.map((category) => (
                <Button key={category} variant={params.category === category ? "default" : "outline"} size="sm" asChild>
                  <Link href={`/projects?category=${category}`}>{category}</Link>
                </Button>
              ))}
            </div>
            {styles.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Style:</span>
                {styles.map((style) => (
                  <Button key={style} variant={params.style === style ? "default" : "outline"} size="sm" asChild>
                    <Link href={`/projects?style=${style}`}>{style}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          {projects && projects.length > 0 ? (
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
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{project.category}</Badge>
                        {project.style && <Badge variant="outline">{project.style}</Badge>}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {project.architects && <span>by {(project.architects as { name?: string }[])[0]?.name}</span>}
                        {project.location && <span>{project.location}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-lg text-muted-foreground">No projects found matching your filters.</p>
              <Button variant="outline" className="mt-6 bg-transparent" asChild>
                <Link href="/projects">Clear Filters</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
