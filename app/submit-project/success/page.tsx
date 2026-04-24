import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "Project Submitted | TheArkitecktsHub",
  description: "Your project has been submitted for review",
}

export default function SubmitProjectSuccess() {
  return (
    <main className="min-h-screen bg-background py-16 sm:py-24 flex items-center">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 w-full">
        <Card>
          <CardContent className="pt-12 pb-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-center text-foreground mb-4">
              Project Submitted!
            </h1>

            <p className="text-center text-muted-foreground mb-8">
              Thank you for sharing your architectural work. Our team will review your project and notify you once it's been approved or if we need additional information.
            </p>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/projects">View Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
