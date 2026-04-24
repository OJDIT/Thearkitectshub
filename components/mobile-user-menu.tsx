"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, LogOut, Menu, Settings, Upload, User, X } from "lucide-react"

interface UserProfile {
  id: string
  display_name: string
  avatar_url: string | null
  is_admin: boolean
}

interface NavigationItem {
  name: string
  href: string
}

interface MobileUserMenuProps {
  navigation: NavigationItem[]
  pathname: string
}

export function MobileUserMenu({ navigation, pathname }: MobileUserMenuProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
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
        // Silent fail
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(checkAuth, 100)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
      const signOutPromise = supabase.auth.signOut()
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Sign out timeout")), 3000)
      )

      try {
        await Promise.race([signOutPromise, timeoutPromise])
      } catch (err) {
        if (err instanceof Error && (err.message.includes("Lock") || err.message === "Sign out timeout")) {
          // Silently continue
        } else {
          throw err
        }
      }

      setOpen(false)
      router.refresh()
      await router.push("/")
    } catch (error) {
      if (error instanceof Error && !error.message.includes("Lock")) {
        console.error("[v0] Logout error:", error.message)
      }
      setOpen(false)
      router.push("/")
    }
  }

  if (!mounted || isLoading) {
    return null
  }

  const initials = (profile?.display_name || user?.email || "U")
    .split(" ")
    .map((name: string) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative size-10 rounded-full border border-border/60">
            <span className="sr-only">Open mobile menu</span>
            {user && profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="absolute inset-0 h-full w-full rounded-full object-cover opacity-20"
              />
            ) : null}
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[320px] border-l border-border/60 p-0">
          <div className="flex h-full flex-col bg-background">
            <div className="border-b border-border/60 px-5 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                    {user && profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.display_name}
                        className="h-full w-full object-cover"
                      />
                    ) : user ? (
                      <span className="text-xs font-semibold">{initials}</span>
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {user ? profile?.display_name || user.email : "Explore"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user ? user.email : "Architecture, projects, and design resources"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="size-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-foreground text-background"
                        : "bg-muted/50 text-foreground hover:bg-accent"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-border/60 bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Account</p>
                {user ? (
                  <div className="mt-4 space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center rounded-2xl px-4 py-3 text-sm font-medium text-foreground hover:bg-accent"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Profile Settings
                    </Link>
                    <Link
                      href="/submit-project"
                      onClick={() => setOpen(false)}
                      className="flex items-center rounded-2xl px-4 py-3 text-sm font-medium text-foreground hover:bg-accent"
                    >
                      <Upload className="mr-3 h-4 w-4" />
                      Submit Project
                    </Link>
                    <Link
                      href={profile?.is_admin ? "/admin" : "/admin-setup"}
                      onClick={() => setOpen(false)}
                      className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium hover:bg-accent ${
                        profile?.is_admin ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <LayoutDashboard className="mr-3 h-4 w-4" />
                      {profile?.is_admin ? "Admin Dashboard" : "Admin Access"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-accent"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <Button asChild className="w-full rounded-2xl">
                      <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full rounded-2xl">
                      <Link href="/auth/login" onClick={() => setOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
