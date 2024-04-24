import { createComment } from '@/lib/actions'
import { getAuthSession } from '@/lib/auth'
import { CommentValidator } from '@/lib/validators/comment'
import { z } from 'zod'

export async function PATCH(req: Request) {
  const session = await getAuthSession()
  
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { postId, text, replyToId } = CommentValidator.parse(body)

  try {
    await createComment(text, postId, session.user.id, replyToId)

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