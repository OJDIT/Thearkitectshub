"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TurnstileCaptcha } from "@/components/auth/turnstile-captcha"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const router = useRouter()
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const handleCaptchaError = useCallback(() => {
    setCaptchaToken(null)
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (turnstileSiteKey && !captchaToken) {
      setError("Please complete the spam protection check before creating your account.")
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          ...(captchaToken ? { captchaToken } : {}),
          data: {
            display_name: displayName,
          },
        },
      })
      if (error) throw error
      if (data.session) {
        await supabase.auth.signOut()
        throw new Error("Email confirmation is not enabled. Please contact the site administrator.")
      }
      if (!data.user?.identities?.length) {
        throw new Error("Unable to create this account. Please sign in or try another email address.")
      }
      setVerificationSent(true)
      setCaptchaToken(null)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{verificationSent ? "Check Your Email" : "Create Account"}</CardTitle>
            <CardDescription>
              {verificationSent
                ? `We sent a confirmation link to ${email}. Open it to confirm your account.`
                : "Join TheArkitecktsHub community"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {verificationSent ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Click the link in that email to finish confirming your account. You can then sign in here.
                </p>
                <Button asChild className="w-full">
                  <Link href="/auth/login">Go to Sign In</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      type="text"
                      placeholder="Your Name"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                  </div>
                  {turnstileSiteKey ? (
                    <TurnstileCaptcha
                      siteKey={turnstileSiteKey}
                      onVerify={setCaptchaToken}
                      onError={handleCaptchaError}
                    />
                  ) : null}
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || Boolean(turnstileSiteKey && !captchaToken)}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            )}
            <div className="mt-4 text-center text-sm">
              {verificationSent ? "Already verified? " : "Already have an account? "}
              <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
