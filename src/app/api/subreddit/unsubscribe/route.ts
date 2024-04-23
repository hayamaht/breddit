import { deleteSubscribe } from '@/lib/actions'
import { getAuthSession } from '@/lib/auth'
import { fetchFirstSubscriptionWith } from '@/lib/data'
import { SubredditSubscriptionValidator } from '@/lib/validators/subreddit'
import { z } from 'zod'

export async function POST(req: Request) {
  const session = await getAuthSession()

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { subredditId } = SubredditSubscriptionValidator.parse(body)

  try {
    const subscriptionExists = await fetchFirstSubscriptionWith(subredditId, session.user.id)

    if (!subscriptionExists) {
      return new Response(
        "You've not been subscribed to this subreddit, yet.",
        {status: 400,}
      )
    }

    await deleteSubscribe(subredditId, session.user.id)

    return new Response(subredditId)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not unsubscribe from subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}