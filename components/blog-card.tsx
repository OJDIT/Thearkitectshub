'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LikeButton } from '@/components/like-button'
import { Clock, Calendar } from 'lucide-react'

interface BlogCardProps {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: number
  publishedAt: string
  coverImageUrl?: string
  likesCount?: number
}

export function BlogCard({
  id,
  title,
  excerpt,
  category,
  readTime,
  publishedAt,
  coverImageUrl,
  likesCount = 0,
}: BlogCardProps) {
  const publishDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link href={`/blog/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Image Section */}
        {coverImageUrl && (
          <div className="relative h-40 overflow-hidden bg-muted group">
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Like button overlay */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.preventDefault()}>
              <LikeButton itemId={id} itemType="blog_post" initialLikesCount={likesCount} size="sm" />
            </div>

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-background/80 text-foreground backdrop-blur">
                {category}
              </Badge>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-4 gap-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{excerpt}</p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
