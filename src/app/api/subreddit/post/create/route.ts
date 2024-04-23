import { createPost } from '@/lib/actions'
import { getAuthSession } from '@/lib/auth'
import { fetchCountSubscription, fetchFirstSubscriptionWith } from '@/lib/data'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  const session = await getAuthSession()

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session.user.id
  const body = await req.json()
  const { title, content, subredditId } = PostValidator.parse(body)
  
  try {
    const subscription = await fetchFirstSubscriptionWith(subredditId, userId)

    if (!subscription) {
      return new Response('Subscribe to post', { status: 401 })
    }

    await createPost(title, content, subredditId, userId)

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