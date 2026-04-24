import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { followingId, followingType, action } = await request.json()

    if (!followingId || !followingType || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!["user", "architect"].includes(followingType)) {
      return NextResponse.json(
        { error: "Invalid following type" },
        { status: 400 }
      )
    }

    if (user.id === followingId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    if (action === "follow") {
      const { error } = await supabase.from("followers").insert({
        follower_id: user.id,
        following_id: followingId,
        following_type: followingType,
      })

      if (error) {
        if (error.message.includes("duplicate")) {
          return NextResponse.json(
            { error: "Already following" },
            { status: 400 }
          )
        }
        throw error
      }

      return NextResponse.json({ success: true })
    } else if (action === "unfollow") {
      const { error } = await supabase
        .from("followers")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", followingId)

      if (error) throw error

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[v0] Follow API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const followingId = searchParams.get("followingId")

    if (!followingId) {
      return NextResponse.json(
        { error: "Missing following ID" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get followers count
    const { count: followersCount } = await supabase
      .from("followers")
      .select("*", { count: "exact", head: true })
      .eq("following_id", followingId)

    // Check if current user is following
    const user = await getUser()
    let isFollowing = false
    if (user) {
      const { data } = await supabase
        .from("followers")
        .select("id")
        .eq("follower_id", user.id)
        .eq("following_id", followingId)
        .single()

      isFollowing = !!data
    }

    return NextResponse.json({
      followersCount: followersCount || 0,
      isFollowing,
    })
  } catch (error) {
    console.error("[v0] Get followers error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
