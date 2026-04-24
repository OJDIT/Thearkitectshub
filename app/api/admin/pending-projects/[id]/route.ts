import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStoragePathFromPublicUrl } from "@/lib/storage-utils"

function normalizeImageUrls(project: Record<string, unknown>) {
  if (Array.isArray(project.image_urls)) {
    return project.image_urls.filter((value): value is string => typeof value === "string")
  }

  if (Array.isArray(project.images_urls)) {
    return project.images_urls.filter((value): value is string => typeof value === "string")
  }

  return []
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if ("error" in adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const { id } = await context.params
  const { action } = await request.json()
  const supabase = createAdminClient()

  const { data: pendingProject, error: fetchError } = await supabase
    .from("pending_projects")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError || !pendingProject) {
    return NextResponse.json({ error: "Pending project not found" }, { status: 404 })
  }

  if (action === "approve") {
    const imageUrls = normalizeImageUrls(pendingProject)

    const { error: insertError } = await supabase.from("projects").insert({
      title: pendingProject.title,
      description: pendingProject.description,
      location: pendingProject.location,
      category: pendingProject.category,
      style: pendingProject.style,
      cover_image_url: pendingProject.cover_image_url,
      image_urls: imageUrls,
      year_completed: pendingProject.year_completed,
      area_sqm: pendingProject.area_sqm,
      featured: true,
      published: true,
      created_at: pendingProject.created_at,
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      return NextResponse.json(
        { error: `Failed to publish project: ${insertError.message}` },
        { status: 500 }
      )
    }

    const { error: updateError } = await supabase
      .from("pending_projects")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json(
        { error: `Project was published, but pending status failed to update: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  }

  if (action === "reject") {
    const { error: updateError } = await supabase
      .from("pending_projects")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to reject project: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if ("error" in adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const { id } = await context.params
  const supabase = createAdminClient()

  const { data: pendingProject, error: fetchError } = await supabase
    .from("pending_projects")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError || !pendingProject) {
    return NextResponse.json({ error: "Pending project not found" }, { status: 404 })
  }

  const imageUrls = normalizeImageUrls(pendingProject)
  const storagePaths = [
    pendingProject.cover_image_url,
    ...imageUrls,
  ]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .map((url) => getStoragePathFromPublicUrl(url, "project-images"))
    .filter((path): path is string => !!path)

  if (storagePaths.length > 0) {
    await supabase.storage.from("project-images").remove(storagePaths)
  }

  const { error: deleteError } = await supabase.from("pending_projects").delete().eq("id", id)

  if (deleteError) {
    return NextResponse.json(
      { error: `Failed to delete pending project: ${deleteError.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
