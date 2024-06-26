import { VoteType } from "@prisma/client"
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

export async function createVote(voteType: VoteType, postId: string, userId: string) {
  try {
    await db.vote.create({
      data: {
        type: voteType,
        userId: userId,
        postId,
      },
    })
  } catch (error) {
    console.error(`Database Error: ${error}`)
  }
}

export async function updateVote(voteType: VoteType, postId: string, userId: string) {
  try {
    await db.vote.update({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
      data: {
        type: voteType,
      },
    })
  } catch (error) {
    console.error(`Database Error: ${error}`)
  }
}

export async function deleteVote(postId: string, userId: string) {
  try {
    await db.vote.delete({
      where: {
        userId_postId: {
          postId,
          userId,
        }
      }
    })
  } catch (error) {
    console.error(`Database Error: ${error}`)
  }
}

export async function createComment(
  text: string, postId: string, userId: string, replyToId?: string
) {
  try {
    await db.comment.create({
      data: {
        text,
        postId,
        authorId: userId,
        replyToId,
      },
    })
    
  } catch (error) {
    console.error(`Database Error: ${error}`)
  }
}


export async function createCommentVote(
  voteType: VoteType, commentId: string, userId: string
) {
  try {
    await db.commentVote.create({
      data: {
        type: voteType,
        userId,
        commentId,
      },
    })
  } catch (error) {
    console.error(`Database Error: ${error}`)
  }
}

export async function updateCommentVote(
  voteType: VoteType, commentId: string, userId: string
) {
  try {
    await db.commentVote.update({
      where: {
        userId_commentId: {
          commentId,
          userId,
        },
      },
      data: {
        type: voteType,
      },
    })
  } catch (error) {
    console.error(`Database Error: ${error}`)
  }
}

export async function deleteCommentVote(
  commentId: string, userId: string
) {
  try {
    await db.commentVote.delete({
      where: {
        userId_commentId: {
          commentId,
          userId,
        },
      },
    })
  } catch (error) {
    console.error(`Database Error: ${error}`)
  }
}