import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStoragePathFromPublicUrl } from "@/lib/storage-utils"

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if ("error" in adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const { id } = await context.params
  const supabase = createAdminClient()
  const { data: architect, error: fetchError } = await supabase
    .from("architects")
    .select("avatar_url")
    .eq("id", id)
    .single()

  if (fetchError) {
    return NextResponse.json(
      { error: `Failed to load architect: ${fetchError.message}` },
      { status: 500 }
    )
  }

  const storagePath = architect?.avatar_url
    ? getStoragePathFromPublicUrl(architect.avatar_url, "profile-avatars")
    : null

  if (storagePath) {
    await supabase.storage.from("profile-avatars").remove([storagePath])
  }

  const { error } = await supabase.from("architects").delete().eq("id", id)

  if (error) {
    return NextResponse.json(
      { error: `Failed to delete architect: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
