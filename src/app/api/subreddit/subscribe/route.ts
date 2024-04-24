import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { createSubscribe } from "@/lib/actions";
import { fetchFirstSubscriptionWith } from "@/lib/data";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";

export async function POST(req: Request) {
  
  const session = await getAuthSession()

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const { subredditId } = SubredditSubscriptionValidator.parse(body)

  try {
    const subscriptionExists = await fetchFirstSubscriptionWith(subredditId, session.user.id)

    if (subscriptionExists) {
      return new Response("Subscription already exists", { status: 400 })
    }

    await createSubscribe(subredditId, session.user.id)
    return new Response(subredditId)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not subscribe to subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}