import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin()
  if ("error" in adminCheck) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const body = await request.json()
  const name = body.name?.trim()
  const title = body.title?.trim()
  const bio = body.bio?.trim()

  if (!name || !title || !bio) {
    return NextResponse.json(
      { error: "Name, title, and bio are required." },
      { status: 400 }
    )
  }

  const specialties = Array.isArray(body.specialties)
    ? body.specialties.filter((value: unknown): value is string => typeof value === "string" && value.trim().length > 0)
    : []

  const yearsOfExperience = body.years_of_experience
    ? Number(body.years_of_experience)
    : null

  const supabase = createAdminClient()
  const { error } = await supabase.from("architects").insert({
    name,
    title,
    bio,
    avatar_url: body.avatar_url?.trim() || null,
    location: body.location?.trim() || null,
    website_url: body.website_url?.trim() || null,
    instagram_url: body.instagram_url?.trim() || null,
    linkedin_url: body.linkedin_url?.trim() || null,
    specialties,
    years_of_experience: Number.isFinite(yearsOfExperience) ? yearsOfExperience : null,
    featured: Boolean(body.featured),
  })

  if (error) {
    return NextResponse.json(
      { error: `Failed to create architect: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
