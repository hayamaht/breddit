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
  const sub = await _getFirstSubreddit(name)
  if (!sub) return undefined
  return sub.name
}

export async function fetchFirstSubredditId(name:string) {
  const sub = await _getFirstSubreddit(name)
  if (!sub) return undefined
  return sub.id
}

async function _getFirstSubreddit(name:string) {
  try {
    const data = await db.subreddit.findFirst({
      where: {
        name,
      },
    })
    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
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
  }
}

export async function fetchFirstSubscriptionWith(subredditId: string, userId: string) {
  try {
    const data = await db.subscription.findFirst({
      where: {
        subredditId,
        userId,
      },
    })
    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
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
  // console.log(subscriptions)
  
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

export async function fetchManyPostsWithWhere(where: {}, limit: number, skip: number) {
  try {
    const data = await db.post.findMany({
      where: where,
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        votes: true,
        author: true,
        comments: true,
        subreddit: true,
      },
    })

    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
    return []
  }
}

export async function fetchFirstPostWithId(postId:string) {
  try {
    const data = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    })
    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
  }
}

export async function fetchFirstVoteWithId(postId:string, userId: string) {
  try {
    const data = await db.vote.findFirst({
      where: {
        userId,
        postId,
      },
    })
    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
  }
}

export async function fetchUniquePost(postId:string) {
  try {
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    })
    return post
  } catch (error) {
    console.error(`%>> Error: ${error}`)
  }
}

export async function fetchManyComments(postId:string) {
  try {
    const data = await db.comment.findMany({
      where: {
        postId: postId,
        replyToId: null, // only fetch top-level comments
      },
      include: {
        author: true,
        votes: true,
        replies: {
          // first level replies
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
  }
}

export async function fetchFirstCommentVote(commentId: string, userId: string) {
  try {
    const data = await db.commentVote.findFirst({
      where: {
        userId,
        commentId,
      },
    })
    return data
  } catch (error) {
    console.error(`%>> Error: ${error}`)
  }
}

