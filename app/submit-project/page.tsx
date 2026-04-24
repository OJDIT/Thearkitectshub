import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import { ProjectUploadForm } from "@/components/project-upload-form"

export const metadata = {
  title: "Submit Project | TheArkitecktsHub",
  description: "Submit your architectural project for review",
}

export default async function SubmitProjectPage() {
  const user = await getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-foreground">Submit Your Project</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Share your architectural work with our community. Your project will be reviewed by our team before appearing on the site.
          </p>
        </div>

        <ProjectUploadForm userId={user.id} />
      </div>
    </main>
  )
}
