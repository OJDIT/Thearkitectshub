import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStoragePathFromPublicUrl } from "@/lib/storage-utils"

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin()
  if ("error" in adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const { id } = await context.params
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
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      excerpt,
      content,
      category,
      cover_image_url: coverImageUrl,
      tags: Array.isArray(body.tags) ? body.tags : [],
      read_time_minutes: readTimeMinutes,
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: `Failed to update blog post: ${error.message}` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin()
  if ("error" in adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const { id } = await context.params
  const supabase = createAdminClient()
  const { data: post, error: fetchError } = await supabase
    .from("blog_posts")
    .select("cover_image_url")
    .eq("id", id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: `Failed to load blog post: ${fetchError.message}` }, { status: 500 })
  }

  const storagePath = post?.cover_image_url ? getStoragePathFromPublicUrl(post.cover_image_url, "project-images") : null
  if (storagePath) {
    await supabase.storage.from("project-images").remove([storagePath])
  }

  const { error } = await supabase.from("blog_posts").delete().eq("id", id)
  if (error) {
    return NextResponse.json({ error: `Failed to delete blog post: ${error.message}` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
