import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin()
  if ("error" in adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const body = await request.json()
  const title = body.title?.trim()
  const description = body.description?.trim()
  const resourceType = body.resource_type?.trim()
  const category = body.category?.trim()
  const url = body.url?.trim()

  if (!title || !description || !resourceType || !category || !url) {
    return NextResponse.json({ error: "Title, description, type, category, and URL are required." }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from("resources").insert({
    title,
    description,
    resource_type: resourceType,
    category,
    url,
    thumbnail_url: body.thumbnail_url?.trim() || null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    featured: Boolean(body.featured),
  })

  if (error) {
    return NextResponse.json({ error: `Failed to create resource: ${error.message}` }, { status: 500 })
  }

  revalidatePath("/resources")
  revalidatePath("/admin/resources")

  return NextResponse.json({ success: true })
}
