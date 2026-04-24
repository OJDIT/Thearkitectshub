import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Heart } from "lucide-react"

export const metadata = {
  title: "About - TheArkitecktsHub",
  description:
    "Learn about TheArkitecktsHub's mission to celebrate contemporary architecture and connect visionary architects with those who appreciate thoughtful design.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl text-balance">
              About TheArkitecktsHub
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              We are a curated platform dedicated to celebrating contemporary architecture and fostering connections
              between visionary architects and those who appreciate thoughtful, innovative design.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-card py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-6">Our Story</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                TheArkitecktsHub was founded with a simple belief: exceptional architecture deserves to be seen,
                understood, and celebrated. In a world where design shapes our daily experiences, we recognized the need
                for a platform that bridges the gap between architectural professionals and design enthusiasts.
              </p>
              <p>
                Our platform serves as a digital gallery and knowledge hub, showcasing projects that push creative
                boundaries while maintaining functional excellence. We carefully curate each project, ensuring that our
                collection represents diverse styles, approaches, and philosophies in contemporary architecture.
              </p>
              <p>
                Beyond showcasing projects, we aim to build a community where architects can share their vision,
                homeowners can find inspiration, and students can learn from real-world examples. Through our editorial
                content and resource library, we provide context and insight into the creative process behind
                exceptional architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Our Values</h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              The principles that guide everything we do
            </p>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            <Card className="border-none shadow-none">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex rounded-lg bg-primary/5 p-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Quality Over Quantity</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We carefully curate every project and resource, prioritizing exceptional design and thoughtful
                  execution over volume. Each piece of content is selected for its ability to inspire and inform.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex rounded-lg bg-primary/5 p-3">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Accessibility & Clarity</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Architecture should be understood and appreciated by everyone. We present complex design concepts in
                  clear, accessible language without sacrificing depth or nuance.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none">
              <CardContent className="p-8">
                <div className="mb-4 inline-flex rounded-lg bg-primary/5 p-3">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Community & Connection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We believe in the power of shared inspiration. By connecting architects, students, and enthusiasts, we
                  create a space for dialogue, learning, and mutual appreciation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="bg-card py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-12">What We Offer</h2>
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Curated Project Gallery</h3>
              <p className="text-muted-foreground leading-relaxed">
                Explore an ever-growing collection of contemporary architectural projects, each accompanied by detailed
                descriptions, high-quality imagery, and contextual information about the design process and philosophy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Architect Profiles</h3>
              <p className="text-muted-foreground leading-relaxed">
                Discover talented architects and designers from around the world. Learn about their approach to design,
                view their portfolio, and connect with professionals whose work resonates with you.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Editorial Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                Read thoughtful articles that explore design theory, showcase case studies, and examine industry trends.
                Our editorial team provides context and analysis that deepens your understanding of architecture.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Resource Library</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access practical guides, templates, and tools designed to support architectural practice. From building
                code checklists to material libraries, we provide resources that help turn inspiration into reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-6 text-balance">
            Join Us in Celebrating Great Design
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
            Whether you're an architect looking to share your work, a student seeking inspiration, or simply someone who
            appreciates beautiful spaces, TheArkitecktsHub is your platform for discovery and connection.
          </p>
        </div>
      </section>
    </div>
  )
}
