"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Upload, Settings, LayoutDashboard } from "lucide-react"

interface UserProfile {
  id: string
  display_name: string
  avatar_url: string | null
  is_admin: boolean
}

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    
    const checkAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        setUser(authUser)

        if (authUser) {
          // Fetch user profile
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .single()

          if (!error && profileData) {
            setProfile(profileData)
          }
        }
      } catch (error) {
        // Silent fail - auth might not be ready yet
      } finally {
        setIsLoading(false)
      }
    }

    // Use a timeout to avoid lock contention
    const timer = setTimeout(checkAuth, 100)

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        try {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
          if (!error && profileData) {
            setProfile(profileData)
          }
        } catch (error) {
          // Silent fail
        }
      } else {
        setProfile(null)
      }
    })

    return () => {
      clearTimeout(timer)
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Attempt sign out with timeout to avoid lock issues
      const signOutPromise = supabase.auth.signOut()
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Sign out timeout")), 3000)
      )
      
      try {
        await Promise.race([signOutPromise, timeoutPromise])
      } catch (err) {
        // If sign out times out or fails with lock error, continue with logout
        if (err instanceof Error && (err.message.includes("Lock") || err.message === "Sign out timeout")) {
          // Silently continue - user will be logged out after redirect
        } else {
          throw err
        }
      }
      
      router.refresh()
      await router.push("/")
    } catch (error) {
      // Silently log any remaining errors but still redirect
      if (error instanceof Error && !error.message.includes("Lock")) {
        console.error("[v0] Logout error:", error.message)
      }
      router.push("/")
    }
  }

  if (!mounted || isLoading) {
    return null
  }

  if (!user) {
    return (
      <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/auth/sign-up">Get Started</Link>
        </Button>
      </div>
    )
  }

  const initials = (profile?.display_name || user.email || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative size-10 overflow-hidden rounded-full p-0"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="block h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                {initials}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col gap-1">
            <p className="text-sm font-medium">{profile?.display_name || user.email}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/submit-project" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Submit Project
            </Link>
          </DropdownMenuItem>
          {profile?.is_admin ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin-setup" className="cursor-pointer text-muted-foreground">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin Access
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
