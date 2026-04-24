import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Careers | TheArkitecktsHub",
  description: "Careers at TheArkitecktsHub are coming soon.",
}

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Card className="rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-3xl">Careers Coming Soon</CardTitle>
            <CardDescription>
              We&apos;re shaping opportunities for editors, curators, writers, designers, and community builders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-muted-foreground">
              The careers hub is on the way. In the meantime, if you&apos;re interested in collaborating with
              TheArkitecktsHub, send your portfolio and a short note to info@thearkitecktshub.com.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href="mailto:info@thearkitecktshub.com">Email Us</a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
