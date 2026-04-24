'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FollowButtonProps {
  userId: string
  userType?: 'user' | 'architect'
  initialFollowersCount?: number
  showCount?: boolean
  variant?: 'default' | 'outline'
}

export function FollowButton({
  userId,
  userType = 'architect',
  initialFollowersCount = 0,
  showCount = false,
  variant = 'default',
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(initialFollowersCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch initial follow status
    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(`/api/follows?followingId=${userId}`)
        if (response.ok) {
          const { isFollowing: following, followersCount: count } = await response.json()
          setIsFollowing(following)
          setFollowersCount(count)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch follow status:', error)
      }
    }

    fetchFollowStatus()
  }, [userId])

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)
    try {
      const response = await fetch('/api/follows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followingId: userId,
          followingType: userType,
          action: isFollowing ? 'unfollow' : 'follow',
        }),
      })

      if (response.status === 401) {
        router.push('/auth/login')
        return
      }

      if (response.ok) {
        setIsFollowing(!isFollowing)
        setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1)
      } else {
        const data = await response.json()
        console.error('[v0] Follow error:', data.error)
      }
    } catch (error) {
      console.error('[v0] Follow request failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleFollow}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </>
      ) : (
        <>
          {isFollowing ? (
            <>
              <UserMinus className="h-4 w-4" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Follow
            </>
          )}
          {showCount && <span className="text-xs">({followersCount})</span>}
        </>
      )}
    </Button>
  )
}
