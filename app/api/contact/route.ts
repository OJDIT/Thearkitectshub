import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = body.name?.trim()
    const email = body.email?.trim()
    const message = body.message?.trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Thanks for reaching out. We will get back to you at info@thearkitecktshub.com.",
    })
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
}
