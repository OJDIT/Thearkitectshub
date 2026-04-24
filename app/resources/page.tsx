import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileText, Package, Wrench, BookOpen } from "lucide-react"

export const metadata = {
  title: "Resources - TheArkitecktsHub",
  description: "Access guides, templates, and tools to support your architectural practice.",
}

const resourceTypeIcons = {
  Guide: BookOpen,
  Template: FileText,
  Tool: Wrench,
  Article: Package,
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from("resources")
    .select("id, title, description, resource_type, category, url, thumbnail_url, tags, featured")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })

  // Apply filters
  if (params.type) {
    query = query.eq("resource_type", params.type)
  }
  if (params.category) {
    query = query.eq("category", params.category)
  }

  const { data: resources } = await query

  // Get unique types and categories
  const { data: allResources } = await supabase.from("resources").select("resource_type, category")

  const types = Array.from(new Set(allResources?.map((r) => r.resource_type).filter(Boolean)))
  const categories = Array.from(new Set(allResources?.map((r) => r.category).filter(Boolean)))

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Resources</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Practical guides, templates, and tools to support your architectural practice and design process.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-y border-border bg-card py-8">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-foreground">Type:</span>
              <Button variant={!params.type ? "default" : "outline"} size="sm" asChild>
                <Link href="/resources">All</Link>
              </Button>
              {types.map((type) => (
                <Button key={type} variant={params.type === type ? "default" : "outline"} size="sm" asChild>
                  <Link href={`/resources?type=${type}`}>{type}</Link>
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-foreground">Category:</span>
              <Button variant={!params.category ? "default" : "outline"} size="sm" asChild>
                <Link href={`/resources${params.type ? `?type=${params.type}` : ""}`}>All</Link>
              </Button>
              {categories.map((category) => (
                <Button key={category} variant={params.category === category ? "default" : "outline"} size="sm" asChild>
                  <Link href={`/resources?${params.type ? `type=${params.type}&` : ""}category=${category}`}>
                    {category}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          {resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => {
                const IconComponent =
                  resourceTypeIcons[resource.resource_type as keyof typeof resourceTypeIcons] || Package
                return (
                  <Card key={resource.id} className="overflow-hidden transition-all hover:shadow-lg">
                    {resource.thumbnail_url && (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={resource.thumbnail_url || "/placeholder.svg"}
                          alt={resource.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-primary/5 p-2">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {resource.resource_type}
                          </Badge>
                        </div>
                        {resource.featured && (
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {resource.description}
                      </p>
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {resource.tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Access Resource
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-lg text-muted-foreground">No resources found matching your filters.</p>
              <Button variant="outline" className="mt-6 bg-transparent" asChild>
                <Link href="/resources">Clear Filters</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
