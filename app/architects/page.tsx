import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Award } from "lucide-react"

export const metadata = {
  title: "Architects - TheArkitecktsHub",
  description: "Discover talented architects and designers shaping the future of contemporary architecture.",
}

export default async function ArchitectsPage() {
  const supabase = await createClient()

  const { data: architects } = await supabase
    .from("architects")
    .select("id, name, title, bio, avatar_url, location, specialties, years_of_experience, featured")
    .order("featured", { ascending: false })
    .order("name", { ascending: true })

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Architects</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Connect with visionary architects and designers creating exceptional contemporary architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Architects Grid */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          {architects && architects.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {architects.map((architect) => (
                <Link key={architect.id} href={`/architects/${architect.id}`} className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <div className="h-32 w-32 overflow-hidden rounded-full bg-muted">
                            {architect.avatar_url ? (
                              <img
                                src={architect.avatar_url || "/placeholder.svg"}
                                alt={architect.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-secondary text-3xl font-semibold text-secondary-foreground">
                                {architect.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          {architect.featured && (
                            <div className="absolute -top-2 -right-2 rounded-full bg-primary p-2">
                              <Award className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">{architect.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{architect.title}</p>
                        {architect.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{architect.location}</span>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                          {architect.bio}
                        </p>
                        {architect.specialties && architect.specialties.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-2">
                            {architect.specialties.slice(0, 3).map((specialty: string) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-lg text-muted-foreground">No architects found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
