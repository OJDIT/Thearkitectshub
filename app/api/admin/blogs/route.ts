import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/admin"

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin()
  if ("error" in adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const body = await request.json()
  const title = body.title?.trim()
  const excerpt = body.excerpt?.trim()
  const content = body.content?.trim()
  const category = body.category?.trim()
  const coverImageUrl = body.cover_image_url?.trim()
  const published = Boolean(body.published)

  if (!title || !excerpt || !content || !category || !coverImageUrl) {
    return NextResponse.json({ error: "Title, excerpt, content, category, and cover image are required." }, { status: 400 })
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))
  const slug = `${generateSlug(title)}-${Date.now()}`

  const supabase = createAdminClient()
  const { error } = await supabase.from("blog_posts").insert({
    author_id: adminCheck.user.id,
    title,
    slug,
    excerpt,
    content,
    cover_image_url: coverImageUrl,
    category,
    tags: Array.isArray(body.tags) ? body.tags : [],
    read_time_minutes: readTimeMinutes,
    published,
    published_at: published ? new Date().toISOString() : null,
  })

  if (error) {
    return NextResponse.json({ error: `Failed to create blog post: ${error.message}` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
