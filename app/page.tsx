import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeroImageCarousel } from "@/components/hero-image-carousel"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const featuredVideos = [
    {
      id: "-vXXUSkNLt4",
      href: "https://youtu.be/-vXXUSkNLt4?si=Qx5aVACLbUNbPqvm",
      title: "Housing and Young People in Nigeria",
    },
    {
      id: "Dm__H2wozFU",
      href: "https://youtu.be/Dm__H2wozFU?si=wW9xJxDOZB0_Islm",
      title: "The Struggles of the Young Architect",
    },
    {
      id: "Dic6aTpHwfs",
      href: "https://youtu.be/Dic6aTpHwfs?si=5a15j2J2WsPhzbe8",
      title: "What Exactly is Real Estate Becoming",
    },
  ]

  const teamMembers = [
    {
      name: "Team Member 1",
      role: "Founder",
      imageUrl: "/placeholder-user.jpg",
    },
    {
      name: "Team Member 2",
      role: "Editorial Lead",
      imageUrl: "/placeholder-user.jpg",
    },
    {
      name: "Team Member 3",
      role: "Community Manager",
      imageUrl: "/placeholder-user.jpg",
    },
    {
      name: "Team Member 4",
      role: "Project Curator",
      imageUrl: "/placeholder-user.jpg",
    },
    {
      name: "Team Member 5",
      role: "Design Strategist",
      imageUrl: "/placeholder-user.jpg",
    },
  ]

  // Fetch featured projects with error handling
  let featuredProjects = null
  let projectsError = null
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, location, category, cover_image_url, architects(name)")
      .eq("featured", true)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3)
    
    if (error) {
      projectsError = error.message
    } else {
      featuredProjects = data
    }
  } catch (err) {
    projectsError = "Failed to load featured projects. Please try again later."
  }

  let heroImages: string[] = []
  try {
    const { data: heroProjects } = await supabase
      .from("projects")
      .select("cover_image_url")
      .eq("published", true)
      .not("cover_image_url", "is", null)
      .limit(12)

    heroImages = (heroProjects || [])
      .map((project) => project.cover_image_url)
      .filter((url): url is string => typeof url === "string" && url.length > 0)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
  } catch (err) {
    heroImages = []
  }

  // Fetch featured architects with error handling
  let featuredArchitects = null
  let architectsError = null
  try {
    const { data, error } = await supabase
      .from("architects")
      .select("id, name, title, location, avatar_url")
      .eq("featured", true)
      .limit(4)
    
    if (error) {
      architectsError = error.message
    } else {
      featuredArchitects = data
    }
  } catch (err) {
    architectsError = "Failed to load featured architects. Please try again later."
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16 sm:py-24 lg:py-32">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground text-balance leading-tight">
                Where Architecture Meets Inspiration
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty max-w-lg">
                Discover contemporary architectural projects, connect with visionary architects, and explore design resources that shape the built environment.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-x-4">
                <Button size="lg" asChild>
                  <Link href="/projects" className="w-full sm:w-auto">
                    Explore Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about" className="w-full sm:w-auto">Learn More</Link>
                </Button>
              </div>
            </div>
            
            {/* Image */}
            <HeroImageCarousel images={heroImages} />
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="bg-card py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Featured Projects</h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Exceptional architectural works that push boundaries and inspire innovation.
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-3 lg:max-w-none">
            {featuredProjects && featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
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
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{project.category}</span>
                        {project.location && (
                          <>
                            <span>·</span>
                            <span>{project.location}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                      {project.architects && <p className="text-sm text-muted-foreground">by {(project.architects as { name?: string }[])[0]?.name}</p>}
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                {projectsError ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">Unable to load featured projects at this time.</p>
                    <p className="text-xs text-muted-foreground/70">Our service is temporarily unavailable. Please try again in a few moments.</p>
                  </div>
                ) : (
                  <p>No featured projects available yet.</p>
                )}
              </div>
            )}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" asChild>
              <Link href="/projects">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Everything You Need to Explore Architecture
            </h2>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 max-w-2xl lg:max-w-none">
            {featuredVideos.map((video) => (
              <a
                key={video.id}
                href={video.href}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground">{video.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Watch on YouTube
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Architects Section */}
      {featuredArchitects && featuredArchitects.length > 0 && (
        <section className="bg-card py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Featured Architects</h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Meet the visionary designers behind exceptional architectural works.
              </p>
            </div>
            <div className="mx-auto mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:max-w-none">
              {featuredArchitects.map((architect) => (
                <Link key={architect.id} href={`/architects/${architect.id}`} className="group">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-muted">
                      {architect.avatar_url ? (
                        <img
                          src={architect.avatar_url || "/placeholder.svg"}
                          alt={architect.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-2xl font-semibold text-secondary-foreground">
                          {architect.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{architect.name}</h3>
                    <p className="text-sm text-muted-foreground">{architect.title}</p>
                    {architect.location && <p className="mt-1 text-xs text-muted-foreground">{architect.location}</p>}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link href="/architects">
                  View All Architects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-background py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-balance">
              Join Our Community
            </h2>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty">
              Create an account to save your favorite projects, follow architects, and get personalized recommendations.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-4">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up" className="w-full sm:w-auto">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-card py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Meet the Team
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              The people shaping TheArkitecktsHub into a stronger home for architecture, design, and community.
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-none lg:grid-cols-5">
            {teamMembers.map((member) => (
              <Card key={member.name} className="overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="flex h-full flex-col items-center p-6 text-center">
                  <div className="mb-5 h-28 w-28 overflow-hidden rounded-full bg-muted">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
