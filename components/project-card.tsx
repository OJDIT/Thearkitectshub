'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LikeButton } from '@/components/like-button'
import { MapPin, Calendar } from 'lucide-react'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  location: string
  category: string
  style: string
  yearCompleted: number
  coverImageUrl: string
  likesCount?: number
}

export function ProjectCard({
  id,
  title,
  description,
  location,
  category,
  style,
  yearCompleted,
  coverImageUrl,
  likesCount = 0,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-muted group">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          
          {/* Like button overlay */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.preventDefault()}>
            <LikeButton itemId={id} itemType="project" initialLikesCount={likesCount} size="sm" />
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/80 text-foreground backdrop-blur">
              {category}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-4 gap-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>{yearCompleted}</span>
            </div>
          </div>

          {/* Style tag */}
          <div className="pt-2 border-t">
            <Badge variant="outline" className="text-xs">
              {style}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  )
}
