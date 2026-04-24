import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStoragePathFromPublicUrl } from "@/lib/storage-utils"

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

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("cover_image_url, image_urls")
    .eq("id", id)
    .single()

  if (fetchError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const imageUrls = Array.isArray(project.image_urls)
    ? project.image_urls.filter((value): value is string => typeof value === "string")
    : []

  const storagePaths = [project.cover_image_url, ...imageUrls]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .map((url) => getStoragePathFromPublicUrl(url, "project-images"))
    .filter((path): path is string => !!path)

  if (storagePaths.length > 0) {
    await supabase.storage.from("project-images").remove(storagePaths)
  }

  const { error: deleteError } = await supabase.from("projects").delete().eq("id", id)

  if (deleteError) {
    return NextResponse.json(
      { error: `Failed to delete project: ${deleteError.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
