import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlogSubmissionForm } from "@/components/blog-submission-form"

export const metadata = {
  title: "Submit Blog Post | TheArkitecktsHub",
  description: "Submit your architectural blog post for review and publication",
}

export default async function SubmitBlogPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Submit a Blog Post
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Share your architectural insights, case studies, and design reflections with our community. Your submission will be reviewed by our team before publication.
          </p>
        </div>

        <BlogSubmissionForm userId={user.id} />

        <div className="mt-12 border-t pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips for Great Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Write compelling headlines that grab attention</p>
                <p>• Include high-quality cover images (1200x800px)</p>
                <p>• Keep your excerpt concise and engaging</p>
                <p>• Use clear, structured content</p>
                <p>• Add relevant categories and tags</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>1. Submit your blog post</p>
                <p>2. Our team reviews the content</p>
                <p>3. You'll receive approval notification</p>
                <p>4. Post goes live on the website</p>
                <p>5. Share with your network!</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/blog">
              Back to Blog <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
