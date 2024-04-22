import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "./db";


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
  }
}