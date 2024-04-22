import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "./db";

export async function fetchCountSubscription(slug: string) {
  try {
    const data = await db.subscription.count({
      where: {
        subreddit: {
          name: slug,
        },
      },
    })
    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
    return 0
  }
}

export async function fetchFirstSubredditName(name:string) {
  try {
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    })
    return subredditExists ? subredditExists.name : null
  } catch (error) {
    console.error(`%>> Error: ${error}`)
    return null
  }
}

export async function fetchFirstSubreddit(name:string) {
  try {
    const data =  await db.subreddit.findFirst({
      where: { name },
      include: {
        posts: {
          include: {
            author: true,
            votes: true,
            comments: true,
            subreddit: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: INFINITE_SCROLL_PAGINATION_RESULTS,
        },
      },
    })
    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
    return null
  }
}



export async function fetchManySubscriptionBy(userId: string) {
  try {
    const data = await db.subscription.findMany({
      where: {
        userId
      },
      include: {
        subreddit: true,
      },
    })
    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
    return []
  }
}

export async function fetchFirstSubscriptionBy(slug:string, userId: string) {
  try {
    const data = await db.subscription.findFirst({
      where: {
        subreddit: {
          name: slug,
        },
        user: {
          id: userId,
        },
      },
    })
    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
    return null
  }
}

export async function fetchFirstSubredditWithPosts(slug:string) {
  try {
    const data = await db.subreddit.findFirst({
      where: { name: slug },
      include: {
        posts: {
          include: {
            author: true,
            votes: true,
          },
        },
      },
    })
    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
    return null
  }
}

export async function fetchManyPostsWithSubreddit(subscriptions: any) {
  // TODO: change `any`
  console.log(subscriptions)
  
  try {
    const data = await db.post.findMany({
      where: {
        subreddit: {
          name: {
            in: subscriptions.map((sub: any) => sub.subreddit.name),
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        votes: true,
        author: true,
        comments: true,
        subreddit: true,
      },
      take: INFINITE_SCROLL_PAGINATION_RESULTS,
    })

    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
    return []
  }
}

export async function fetchManyPosts() {
  try {
    const data = await db.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        votes: true,
        author: true,
        comments: true,
        subreddit: true,
      },
      take: INFINITE_SCROLL_PAGINATION_RESULTS, // 4 to demonstrate infinite scroll, should be higher in production
    })

    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
    return []
  }
}