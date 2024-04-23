import { getAuthSession } from '@/lib/auth'
import { fetchFirstSubredditName } from "@/lib/fetchFirstSubredditName"
import { createSubreddit, createSubscribe, } from '@/lib/actions'
import { SubredditValidator } from '@/lib/validators/subreddit'
import { z } from 'zod'

export async function POST(req: Request) {
  const session = await getAuthSession()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  
  try {
    const { name } = SubredditValidator.parse(body)
    const subredditExists = await fetchFirstSubredditName(name)

    if (subredditExists) {
      return new Response('Subreddit already exists', { status: 409 })
    }

    const subreddit = await createSubreddit(name, session.user.id)
    createSubscribe(subreddit!.id, session.user.id)
    
    return new Response(subreddit!.name)
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not create subreddit', { status: 500 })
  }
}