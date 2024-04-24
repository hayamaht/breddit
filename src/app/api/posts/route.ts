import { getAuthSession } from '@/lib/auth'
import { fetchManyPostsWithWhere, fetchManySubscriptionBy } from '@/lib/data'
import { z } from 'zod'

export async function GET(req: Request) {
  const session = await getAuthSession()

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const url = new URL(req.url)
  let followedCommunitiesIds: string[] = []

  try {
    if (session) {
      const s = await fetchManySubscriptionBy(session.user.id)
      followedCommunitiesIds = s.map((sub) => sub.subreddit.id)
    }

    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional(),
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      })
    
    let whereClause = {}

    if (subredditName) {
      whereClause = {
        subreddit: {
          name: subredditName,
        },
      }
    } else if (session) {
      whereClause = {
        subreddit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }

    const lmt = parseInt(limit)
    const skip = (parseInt(page) - 1) * lmt
    const posts = await fetchManyPostsWithWhere(
      whereClause,
      lmt,
      skip
    )

    return new Response(JSON.stringify(posts))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not fetch more posts', { status: 500 })
  }

  
}