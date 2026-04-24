"use client"

import { createClient } from "@/lib/supabase/client"

let lastCheckTime = 0
const CHECK_INTERVAL = 1000 // 1 second debounce

export async function getCurrentUser() {
  const now = Date.now()
  
  // Only check auth once per second to prevent lock contention
  if (now - lastCheckTime < CHECK_INTERVAL) {
    return null
  }
  
  lastCheckTime = now
  const supabase = createClient()
  
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    
    if (error) {
      console.error("Auth error:", error)
      return null
    }
    
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function getCurrentUserProfile(userId: string) {
  const supabase = createClient()
  
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    
    if (error) {
      console.error("Profile error:", error)
      return null
    }
    
    return profile
  } catch (error) {
    console.error("Error getting profile:", error)
    return null
  }
}
