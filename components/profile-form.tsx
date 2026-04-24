"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { createSafeStoragePath } from "@/lib/storage"
import { Loader2, Upload } from "lucide-react"

interface ProfileData {
  id: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
}

export function ProfileForm({
  profile,
  userEmail,
  userId,
}: {
  profile: ProfileData | null
  userEmail: string
  userId: string
}) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>(profile?.avatar_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB")
        return
      }

      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      let avatarUrl = profile?.avatar_url || ""

      // Upload new avatar if provided
      if (avatarFile) {
        const fileName = createSafeStoragePath(userId, avatarFile.name, "avatar")
        const { error: uploadError } = await supabase.storage
          .from("profile-avatars")
          .upload(fileName, avatarFile, { upsert: true })

        if (uploadError) {
          throw new Error(`Avatar upload failed: ${uploadError.message}`)
        }

        const { data: publicUrlData } = supabase.storage.from("profile-avatars").getPublicUrl(fileName)
        avatarUrl = publicUrlData.publicUrl
      }

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
        })

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`)
      }

      setSuccess(true)
      setAvatarFile(null)
      router.refresh()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again."
      
      // Provide helpful message for storage bucket issues
      if (errorMessage.includes("Bucket not found") || errorMessage.includes("upload failed")) {
        errorMessage = `Avatar upload error: ${errorMessage}. Please ensure the "profile-avatars" storage bucket exists in your Supabase project. See STORAGE_SETUP_GUIDE.md for instructions.`
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Upload or change your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {avatarPreview ? (
              <div className="flex gap-4 items-start">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-border">
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-3">
                    Your profile avatar. Click the button below to change it.
                  </p>
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Change Avatar
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-dashed border-border">
                  <span className="text-sm text-muted-foreground">No avatar</span>
                </div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Avatar
                    </span>
                  </Button>
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your public profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                Profile updated successfully!
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={userEmail} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Your email cannot be changed here</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, 100))}
                placeholder="Your name"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">{displayName.length}/100 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 500))}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">{bio.length}/500 characters</p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
