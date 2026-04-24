import { redirect } from "next/navigation"
import { getUser } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, FileText, Bookmark, Bell } from "lucide-react"

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get pending projects count
  const { count: pendingProjectsCount } = await supabase
    .from("pending_projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "pending")

  // Get approved projects count
  const { count: approvedProjectsCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Get followers count
  const { count: followersCount } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("following_id", user.id)

  // Get user submissions
  const { data: submissions } = await supabase
    .from("pending_projects")
    .select("id, title, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {profile?.display_name || user.email}
            </p>
          </div>
          <Button asChild>
            <Link href="/submit-project">Submit Project</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Pending Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingProjectsCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Approved Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedProjectsCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Published on site</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Followers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{followersCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">People following you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">Unread</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="submissions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Your project submissions and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {submissions && submissions.length > 0 ? (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{submission.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              submission.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : submission.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {submission.status.charAt(0).toUpperCase() +
                              submission.status.slice(1)}
                          </span>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/projects/${submission.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No submissions yet</p>
                    <Button asChild>
                      <Link href="/submit-project">Submit Your First Project</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/profile">Go to Profile Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
