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