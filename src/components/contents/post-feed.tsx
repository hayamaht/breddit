'use client'

import { ExtendedPost } from '@/types/db'
import React, { useEffect, useRef } from 'react'
import { useIntersection } from '@mantine/hooks'
import { useSession } from 'next-auth/react'
import { Loader2Icon } from 'lucide-react'
import Post from './post'
import { useInfiniteQuery } from '@tanstack/react-query'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import axios from 'axios'

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  subredditName?: string
}

export default function PostFeed({ initialPosts, subredditName }: PostFeedProps) {
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })
  const { data: session } = useSession()
  const userId = session?.user.id
  const fetchPosts = async ({ pageParam = 1 }) => {
    const query =
      `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
      (!!subredditName ? `&subredditName=${subredditName}` : '')

    const { data } = await axios.get(query)
    return data as ExtendedPost[]
  }
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['infinite-query'],
    queryFn: fetchPosts,
    initialPageParam: 1,
    initialData: { pages: [initialPosts], pageParams: [1] },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) return undefined
      return pages.length + 1
    }
  })

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage() // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage])
  
  const posts = data?.pages.flatMap((page) => page) ?? initialPosts
  
  return (
    <ul  className='flex flex-col col-span-2 space-y-6'>
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1
          return acc
        }, 0)

        const currentVote = post.votes.find(
          (vote) => vote.userId === userId
        )

        if (index === posts.length - 1) {
          return (
            <li ref={ref} key={post.id}>
              <Post
                post={post}
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            </li>
          )
        }

        return (
          <li key={post.id}>
            <Post 
              post={post}
              commentAmt={post.comments.length}
              subredditName={post.subreddit.name}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
          </li>
        )
      })}

      {isFetchingNextPage && (
        <li className='flex justify-center'>
          <Loader2Icon className='w-6 h-6 text-zinc-500 animate-spin' />
        </li>
      )}
    </ul>
  )
}
