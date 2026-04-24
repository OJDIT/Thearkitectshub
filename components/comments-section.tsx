'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  parent_id: string | null
  profiles: {
    id: string
    display_name: string
    avatar_url?: string
  }
}

interface CommentsSectionProps {
  itemId: string
  itemType: 'project' | 'blog_post'
  currentUserId?: string
}

export function CommentsSection({
  itemId,
  itemType,
  currentUserId,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchComments()
  }, [itemId, itemType])

  const fetchComments = async () => {
    try {
      setIsFetching(true)
      const response = await fetch(
        `/api/comments?itemId=${itemId}&itemType=${itemType}`
      )
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('[v0] Failed to fetch comments:', error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          itemType,
          content: newComment,
        }),
      })

      if (response.status === 401) {
        router.push('/auth/login')
        return
      }

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment('')
      }
    } catch (error) {
      console.error('[v0] Failed to post comment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return

    try {
      const response = await fetch(`/api/comments?commentId=${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId))
      }
    } catch (error) {
      console.error('[v0] Failed to delete comment:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>

        {currentUserId && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={2000}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newComment.length}/2000
              </span>
              <Button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post Comment'
                )}
              </Button>
            </div>
          </form>
        )}

        {!currentUserId && (
          <Card className="p-4 text-center text-sm text-muted-foreground">
            <p>Sign in to leave a comment</p>
          </Card>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            <p>No comments yet. Be the first to comment!</p>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4 space-y-3">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={comment.profiles?.avatar_url} />
                  <AvatarFallback>
                    {comment.profiles?.display_name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">
                      {comment.profiles?.display_name}
                    </p>
                    {currentUserId === comment.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground break-words">
                {comment.content}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
