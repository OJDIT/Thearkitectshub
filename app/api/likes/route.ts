import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId, itemType, action } = await request.json()

    if (!itemId || !itemType || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!["project", "blog_post"].includes(itemType)) {
      return NextResponse.json(
        { error: "Invalid item type" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    if (action === "like") {
      const { error } = await supabase.from("likes").insert({
        user_id: user.id,
        item_id: itemId,
        item_type: itemType,
      })

      if (error) {
        if (error.message.includes("duplicate")) {
          return NextResponse.json(
            { error: "Already liked" },
            { status: 400 }
          )
        }
        throw error
      }

      return NextResponse.json({ success: true })
    } else if (action === "unlike") {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("item_id", itemId)
        .eq("item_type", itemType)

      if (error) throw error

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[v0] Like API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")
    const itemType = searchParams.get("itemType")

    if (!itemId || !itemType) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get likes count
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("item_id", itemId)
      .eq("item_type", itemType)

    // Check if current user liked it
    const user = await getUser()
    let isLiked = false
    if (user) {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_id", itemId)
        .eq("item_type", itemType)
        .single()

      isLiked = !!data
    }

    return NextResponse.json({
      count: count || 0,
      isLiked,
    })
  } catch (error) {
    console.error("[v0] Like GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
