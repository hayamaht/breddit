import { getAuthSession } from '@/lib/auth'
import { fetchManyPostsWithSubreddit, fetchManySubscriptionBy } from '@/lib/data'
import { notFound } from 'next/navigation'
import React from 'react'
import PostFeed from './post-feed'

export default async function CustomFeed() {
  const session = await getAuthSession()

  // only rendered if session exists, so this will not happen
  if (!session) return notFound()

  const f = await fetchManySubscriptionBy(session.user.id)
  const posts = await fetchManyPostsWithSubreddit(f)

  return posts && posts.length > 0
    ? <PostFeed initialPosts={posts} />
    // TODO: add pics
    : <div>no data aaa</div>
}
