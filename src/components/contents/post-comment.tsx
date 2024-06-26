'use client'

import { useOnClickOutside } from '@/hooks/use-onclick-outside'
import { Comment, CommentVote, User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { CommentRequest } from '@/lib/validators/comment'
import UserAvatar from './user-avatar'
import { formatTimeToNow } from '@/lib/utils'
import { Button } from '../ui/button'
import { MessageSquareIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import CommentVotes from './comment-votes'

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
}

export default function PostComment({
  comment,
  votesAmt,
  currentVote,
  postId,
}: {
  comment: ExtendedComment
  votesAmt: number
  currentVote: CommentVote | undefined
  postId: string
}) {
  const { data: session } = useSession()
  const [isReplying, setIsReplying] = useState<boolean>(false)
  const commentRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState<string>(`@${comment.author.username} `)
  const router = useRouter()

  useOnClickOutside(commentRef, () => {
    setIsReplying(false)
  })

  const { mutate: postComment, isPending } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId }

      const { data } = await axios.patch(
        `/api/subreddit/post/comment/`,
        payload
      )
      return data
    },
    onError: () => {
      toast('Something went wrong.', {
        description: "Comment wasn't created successfully. Please try again.",
      })
    },
    onSuccess: () => {
      router.refresh()
      toast.success('Comment created successfully.')
      setIsReplying(false)
    },
  })
  
  return (
    <div ref={commentRef} className='flex flex-col space-y-2'>
      <div className='flex items-center'>
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className='h-6 w-6'
        />
        <div className='ml-2 flex items-center gap-x-2'>
          <p className='text-sm font-medium text-foreground/80'>u/{comment.author.username}</p>

          <p className='max-h-40 truncate text-xs text-foreground/60'>
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className='text-sm text-foreground border border-border p-2 rounded'>
        {comment.text}
      </p>

      <div className='flex gap-2 items-center'>
        <CommentVotes
          commentId={comment.id}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session) return router.push('/sign-in')
            setIsReplying(true)
          }}
          variant='ghost'
          size={'sm'}>
          <MessageSquareIcon className='h-4 w-4 mr-1.5' />
          Reply
        </Button>
      </div>

      {isReplying ? (
        <div className='grid w-full gap-1.5'>
          <Label htmlFor='comment'>Your comment</Label>
          <div className='mt-2'>
            <Textarea
              onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length
                )
              }
              autoFocus
              id='comment'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder='What are your thoughts?'
            />

            <div className='mt-2 flex justify-end gap-2'>
              <Button
                tabIndex={-1}
                variant='secondary'
                onClick={() => setIsReplying(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                disabled={isPending || input.length === 0}
                onClick={() => {
                  if (!input) return
                  postComment({
                    postId,
                    text: input,
                    replyToId: comment.replyToId ?? comment.id, // default to top-level comment
                  })
                }}>
                Post
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
