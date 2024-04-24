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
      setIsReplying(false)
    },
  })
  
  return (
    <div>PostComment</div>
  )
}
