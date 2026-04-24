import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getUser } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminSetupPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (profile?.is_admin) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="TheArkitecktsHub" className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">TheArkitecktsHub</h1>
          <p className="text-muted-foreground">Admin Access Setup</p>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Dashboard Setup</CardTitle>
            <CardDescription>Learn how to access and use the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">How to Enable Admin Access</h2>
              <p className="text-muted-foreground mb-6">
                Your email: <span className="font-semibold text-foreground">{user.email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
                <h3 className="font-semibold mb-4 text-blue-900">Step-by-Step Admin Setup</h3>
                <ol className="text-sm space-y-4">
                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 min-w-fit">1.</span>
                    <span className="text-blue-900">
                      Go to your <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">Supabase Dashboard</a>
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 min-w-fit">2.</span>
                    <span className="text-blue-900">
                      Open the <span className="font-semibold">SQL Editor</span> from the left sidebar
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 min-w-fit">3.</span>
                    <span className="text-blue-900">
                      Click <span className="font-semibold">"New Query"</span>
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 min-w-fit">4.</span>
                    <span className="text-blue-900 flex-1">
                      Copy and paste this code, replacing the email:
                      <code className="block bg-blue-100 text-blue-900 p-3 rounded text-xs mt-2 overflow-x-auto font-mono">
                        {`UPDATE profiles SET is_admin = true WHERE id IN (SELECT id FROM auth.users WHERE email = '${user.email}');`}
                      </code>
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 min-w-fit">5.</span>
                    <span className="text-blue-900">
                      Click <span className="font-semibold">"Run"</span> button
                    </span>
                  </li>
                </ol>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-3">After Admin is Enabled</h3>
                <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                  <li>Refresh this page or log out and log back in</li>
                  <li>Click on your profile avatar in the top right</li>
                  <li>You'll now see <span className="font-semibold">"Admin Dashboard"</span> option</li>
                  <li>Click it to access the admin dashboard</li>
                </ol>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-3">Admin Dashboard Tasks</h3>
                <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
                  <li>View all pending project submissions from architects</li>
                  <li>Review project images and details</li>
                  <li>Approve projects to publish them on the site</li>
                  <li>Reject projects if they don't meet quality standards</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2 text-green-900">Everything Set Up?</h3>
                <p className="text-sm text-green-800 mb-4">
                  After you run the SQL query above and refresh:
                </p>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/admin">
                    Go to Admin Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
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
