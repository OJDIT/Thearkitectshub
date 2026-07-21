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
      role: "Team Member",
      imageUrl: "/IMG_2931.PNG",
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
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 items-end gap-10 border-b border-border py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
            {/* Content */}
            <div className="flex flex-col justify-center">
              <p className="editorial-label mb-6">Architecture / Culture / City</p>
              <h1 className="font-display text-5xl font-semibold tracking-[-0.065em] text-foreground text-balance leading-[0.91] sm:text-6xl lg:text-7xl xl:text-[5.6rem]">
                Where Architecture Meets Inspiration
              </h1>
              <p className="mt-7 max-w-md text-[15px] leading-7 text-muted-foreground text-pretty">
                Discover contemporary architectural projects, connect with visionary architects, and explore design resources that shape the built environment.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
      <section className="bg-card py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
          <div className="grid max-w-4xl gap-5 border-t border-border pt-5 lg:grid-cols-[0.35fr_1fr]">
            <p className="editorial-label">Selected work</p>
            <div>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-5xl">Featured Projects</h2>
            <p className="mt-3 text-[15px] text-muted-foreground leading-7">
              Exceptional architectural works that push boundaries and inspire innovation.
            </p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects && featuredProjects.length > 0 ? (
              featuredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="group">
                  <Card className="overflow-hidden border-x-0 border-t-0 border-b border-border bg-transparent py-0 transition-colors hover:border-primary">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={project.cover_image_url || "/placeholder.svg"}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="px-0 py-5">
                      <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        <span>{project.category}</span>
                        {project.location && (
                          <>
                            <span>·</span>
                            <span>{project.location}</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground mb-2">{project.title}</h3>
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
          <div className="mt-10">
            <Button variant="outline" asChild>
              <Link href="/projects">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 max-w-2xl border-t border-border pt-5 sm:mb-16">
            <p className="editorial-label mb-5">Conversations</p>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-5xl">
              Everything You Need to Explore Architecture
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {featuredVideos.map((video) => (
              <a
                key={video.id}
                href={video.href}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden border-b border-border bg-transparent pb-5 transition-colors hover:border-primary"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="pt-5">
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{video.title}</h3>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
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
        <section className="bg-card py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl border-t border-border pt-5">
              <p className="editorial-label mb-5">Practices & people</p>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-5xl">Featured Architects</h2>
              <p className="mt-3 text-[15px] text-muted-foreground leading-7">
                Meet the visionary designers behind exceptional architectural works.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {featuredArchitects.map((architect) => (
                <Link key={architect.id} href={`/architects/${architect.id}`} className="group">
                  <div className="flex flex-col border-t border-border pt-4">
                    <div className="mb-4 aspect-square w-full overflow-hidden bg-muted">
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
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{architect.name}</h3>
                    <p className="text-sm text-muted-foreground">{architect.title}</p>
                    {architect.location && <p className="mt-1 text-xs text-muted-foreground">{architect.location}</p>}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10">
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
      <section className="bg-primary py-16 text-primary-foreground sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
          <div className="grid max-w-5xl gap-7 lg:grid-cols-[0.35fr_1fr]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">The common ground</p>
            <div>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.055em] text-primary-foreground text-balance sm:text-5xl">
              Join Our Community
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-primary-foreground/75 text-pretty">
              Create an account to save your favorite projects, follow architects, and get personalized recommendations.
            </p>
            <div className="mt-8 flex flex-col items-start sm:flex-row">
              <Button size="lg" variant="outline" className="border-primary-foreground bg-primary-foreground text-primary hover:bg-transparent hover:text-primary-foreground" asChild>
                <Link href="/auth/sign-up" className="w-full sm:w-auto">Get Started</Link>
              </Button>
            </div></div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-card py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl border-t border-border pt-5">
            <p className="editorial-label mb-5">The editorial office</p>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-5xl">
              Meet the Team
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground leading-7">
              The people shaping TheArkitecktsHub into a stronger home for architecture, design, and community.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {teamMembers.map((member) => (
              <Card key={member.name} className="overflow-hidden border-x-0 border-t-0 border-b border-border bg-transparent py-0">
                <CardContent className="flex h-full flex-col px-0 py-5">
                  <div className="mb-5 aspect-square w-full overflow-hidden bg-muted">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">{member.name}</h3>
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
