import { createCommentVote, deleteCommentVote, updateCommentVote } from '@/lib/actions'
import { getAuthSession } from '@/lib/auth'
import { fetchFirstCommentVote } from '@/lib/data'
import { CommentVoteValidator } from '@/lib/validators/vote'
import { z } from 'zod'

export async function PATCH(req: Request) {
  const session = await getAuthSession()

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { commentId, voteType } = CommentVoteValidator.parse(body)

  try {
    // check if user has already voted on this post
    const existingVote = await fetchFirstCommentVote(commentId, session.user.id)
    
    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await deleteCommentVote(commentId, session.user.id)
        return new Response('OK')
      } else {
        // if vote type is different, update the vote
        await updateCommentVote(voteType, commentId, session.user.id)
        return new Response('OK')
      }
    }

    // if no existing vote, create a new vote
    await createCommentVote(voteType, commentId, session.user.id)

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not post to subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}