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


export async function createSubscribe(subredditId: string, userId: string) {
  try {
    await db.subscription.create({
      data: {
        subredditId,
        userId,
      },
    })
  } catch (error) {
    console.error(`Database Error: ${error}`)
  }
}

export async function deleteSubscribe(subredditId: string, userId: string) {
  try {
    await db.subscription.deleteMany({
      where: {
        subredditId,
        userId,
      },
    })
  } catch (error) {
    console.error(`Database Error: ${error}`)
  }
}

export async function createPost(
  title: string,
  content: string,
  subredditId: string, 
  userId: string
) {
  try {
    await db.post.create({
      data: {
        title,
        content,
        authorId: userId,
        subredditId,
      },
    })
  } catch (error) {
    console.error(`Database Error: ${error}`)
  }
}