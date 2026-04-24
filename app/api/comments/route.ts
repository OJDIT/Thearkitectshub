import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId, itemType, content, parentId } = await request.json()

    if (!itemId || !itemType || !content) {
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

    if (content.trim().length === 0 || content.length > 2000) {
      return NextResponse.json(
        { error: "Comment must be between 1 and 2000 characters" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        item_id: itemId,
        item_type: itemType,
        content: content.trim(),
        parent_id: parentId || null,
      })
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        parent_id,
        profiles (
          id,
          display_name,
          avatar_url
        )
      `
      )
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Comment API error:", error)
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

    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        updated_at,
        user_id,
        parent_id,
        profiles (
          id,
          display_name,
          avatar_url
        )
      `
      )
      .eq("item_id", itemId)
      .eq("item_type", itemType)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Get comments error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get("commentId")

    if (!commentId) {
      return NextResponse.json(
        { error: "Missing comment ID" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if user owns the comment
    const { data: comment } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", commentId)
      .single()

    if (!comment || comment.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete comment error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
