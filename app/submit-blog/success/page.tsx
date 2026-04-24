import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Blog Submitted | TheArkitecktsHub",
  description: "Your blog post has been successfully submitted for review",
}

export default function BlogSubmitSuccessPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-900">Blog Post Submitted Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-3">
              <p className="text-lg text-green-800">
                Thank you for submitting your blog post. Our team will review it shortly.
              </p>
              <p className="text-muted-foreground">
                You'll be notified via email once your post has been approved and published on the website.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200 space-y-2">
              <h3 className="font-semibold text-foreground">What happens next?</h3>
              <ol className="text-sm text-muted-foreground space-y-1 text-left">
                <li className="flex gap-3">
                  <span className="font-semibold text-green-600 min-w-fit">1.</span>
                  <span>Our editorial team reviews your content</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-green-600 min-w-fit">2.</span>
                  <span>We may request minor edits or improvements</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-green-600 min-w-fit">3.</span>
                  <span>Once approved, your post goes live on the website</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-green-600 min-w-fit">4.</span>
                  <span>Share with your network and engage with readers!</span>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild>
                <Link href="/blog">
                  View Blog <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
