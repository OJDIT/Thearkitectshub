import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Heart, MessageSquare, TrendingUp } from "lucide-react"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Get total users count
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  // Get total projects count
  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })

  // Get total blog posts count
  const { count: totalBlogPosts } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })

  // Get total likes count
  const { count: totalLikes } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })

  // Get total comments count
  const { count: totalComments } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })

  // Get pending projects count
  const { count: pendingProjects } = await supabase
    .from("pending_projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  // Get trending projects (by likes)
  const { data: trendingProjects } = await supabase
    .from("projects")
    .select("id, title, likes_count")
    .order("likes_count", { ascending: false })
    .limit(5)

  // Get trending blog posts (by likes)
  const { data: trendingBlogs } = await supabase
    .from("blog_posts")
    .select("id, title, likes_count")
    .order("likes_count", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Platform statistics and insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects || 0}</div>
              <p className="text-xs text-yellow-600 mt-1">{pendingProjects || 0} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBlogPosts || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Total Likes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLikes || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComments || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="trending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trending">Trending Content</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trending Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trending Projects
                  </CardTitle>
                  <CardDescription>By engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  {trendingProjects && trendingProjects.length > 0 ? (
                    <div className="space-y-4">
                      {trendingProjects.map((project, index) => (
                        <div key={project.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground w-6">
                              #{index + 1}
                            </span>
                            <span className="text-sm font-medium truncate">{project.title}</span>
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            {project.likes_count || 0} likes
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No projects yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Trending Blogs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trending Blog Posts
                  </CardTitle>
                  <CardDescription>By engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  {trendingBlogs && trendingBlogs.length > 0 ? (
                    <div className="space-y-4">
                      {trendingBlogs.map((blog, index) => (
                        <div key={blog.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground w-6">
                              #{index + 1}
                            </span>
                            <span className="text-sm font-medium truncate">{blog.title}</span>
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            {blog.likes_count || 0} likes
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No blog posts yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Summary</CardTitle>
                <CardDescription>Overall platform engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Avg Likes Per Project</p>
                    <p className="text-2xl font-bold">
                      {totalProjects && totalLikes
                        ? (totalLikes / totalProjects).toFixed(1)
                        : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Avg Comments Per Content</p>
                    <p className="text-2xl font-bold">
                      {(totalProjects || 0) + (totalBlogPosts || 0) > 0 && totalComments
                        ? (totalComments / ((totalProjects || 0) + (totalBlogPosts || 0))).toFixed(1)
                        : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">User Engagement Rate</p>
                    <p className="text-2xl font-bold">
                      {totalUsers && totalLikes
                        ? ((totalLikes / totalUsers) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Approval Rate</p>
                    <p className="text-2xl font-bold">
                      {totalProjects ? (((totalProjects - (pendingProjects || 0)) / totalProjects) * 100).toFixed(0) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
