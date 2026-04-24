'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  itemId: string
  itemType: 'project' | 'blog_post'
  initialLikesCount?: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function LikeButton({
  itemId,
  itemType,
  initialLikesCount = 0,
  showCount = true,
  size = 'md',
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch initial like status
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(
          `/api/likes?itemId=${itemId}&itemType=${itemType}`
        )
        if (response.ok) {
          const { isLiked: liked, count } = await response.json()
          setIsLiked(liked)
          setLikesCount(count)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch like status:', error)
      }
    }

    fetchLikeStatus()
  }, [itemId, itemType])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          itemType,
          action: isLiked ? 'unlike' : 'like',
        }),
      })

      if (response.status === 401) {
        router.push('/auth/login')
        return
      }

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
      } else {
        const data = await response.json()
        console.error('[v0] Like error:', data.error)
      }
    } catch (error) {
      console.error('[v0] Like request failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 ${sizeClasses[size]}`}
      title={isLiked ? 'Unlike' : 'Like'}
    >
      <Heart
        className={`${iconSizes[size]} transition-all ${
          isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        }`}
      />
      {showCount && <span className="text-xs font-medium">{likesCount}</span>}
    </Button>
  )
}
