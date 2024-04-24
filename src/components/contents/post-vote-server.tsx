import { getAuthSession } from '@/lib/auth'
import { Post, Vote } from '@prisma/client'
import React from 'react'
import PostVoteClient from './post-vote-client'
import { notFound } from 'next/navigation'

export default async function PostVoteServer({
  postId,
  initialVotesAmt,
  initialVote,
  getData  
}: {
  postId: string
  initialVotesAmt?: number
  initialVote?: Vote['type'] |null
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>
}) {
  const session = await getAuthSession()
  let _votesAmt: number = 0
  let _currentVote: Vote['type'] | null | undefined = undefined

  if (!getData) {
    _votesAmt = initialVotesAmt!
    _currentVote = initialVote
  } else {
    // fetch data in component
    const post = await getData()
    if (!post) return notFound()

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1
      return acc
    }, 0)

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user?.id
    )?.type
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmt={_votesAmt}
      initialVote={_currentVote}
    />
  )
}
