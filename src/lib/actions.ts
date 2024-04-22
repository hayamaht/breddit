import { db } from "./db"

export async function createSubreddit(name:string, userId: string) {
  try {
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: userId,
      },
    })
    return subreddit
  } catch (error) {
    console.error(`%>> Error: ${error}`)
  }
}

export async function createSubscription(subredditId:string, userId: string) {
  try {
    await db.subscription.create({
      data: {
        userId: userId,
        subredditId
      },
    })
  } catch (error) {
    console.error(`%>> Error: ${error}`)
  }
}