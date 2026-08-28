"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { clearAppBrowserData } from "@/lib/auth/browser-session"
import { createClient } from "@/lib/supabase/client"

// Keep this reasonably short for shared or frequently used browsers.
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000
const LAST_ACTIVITY_KEY = "thearkitectshub-last-activity"

export function SessionInactivityGuard() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    let timeoutId: number | undefined
    let signingOut = false
    let hasAuthenticatedUser = false

    const signOutForInactivity = async () => {
      if (signingOut) return
      signingOut = true

      // Clear locally even if the request cannot reach Supabase.
      try {
        await supabase.auth.signOut({ scope: "local" })
      } finally {
        await clearAppBrowserData()
      }
      router.replace("/")
      router.refresh()
    }

    const scheduleSignOut = () => {
      if (timeoutId) window.clearTimeout(timeoutId)

      const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY)) || Date.now()
      const remaining = Math.max(0, INACTIVITY_TIMEOUT_MS - (Date.now() - lastActivity))
      timeoutId = window.setTimeout(signOutForInactivity, remaining)
    }

    const recordActivity = () => {
      if (signingOut || !hasAuthenticatedUser) return
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
      scheduleSignOut()
    }

    const checkForExpiredSession = () => {
      if (!hasAuthenticatedUser || signingOut) return
      const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY))
      if (lastActivity && Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS) {
        void signOutForInactivity()
      } else {
        scheduleSignOut()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") checkForExpiredSession()
    }

    const activityEvents: Array<keyof WindowEventMap> = ["click", "keydown", "pointerdown", "scroll", "touchstart"]
    activityEvents.forEach((eventName) => window.addEventListener(eventName, recordActivity, { passive: true }))
    window.addEventListener("focus", checkForExpiredSession)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        hasAuthenticatedUser = true
        if (!localStorage.getItem(LAST_ACTIVITY_KEY)) recordActivity()
        else checkForExpiredSession()
      }
    }).catch(() => {
      // If auth cannot be read, leave the visitor in a logged-out UI state.
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      hasAuthenticatedUser = Boolean(session?.user)
      if (hasAuthenticatedUser) {
        signingOut = false
        recordActivity()
      } else if (timeoutId) {
        window.clearTimeout(timeoutId)
        timeoutId = undefined
      }
    })

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, recordActivity))
      window.removeEventListener("focus", checkForExpiredSession)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      subscription.unsubscribe()
    }
  }, [router])

  return null
}
