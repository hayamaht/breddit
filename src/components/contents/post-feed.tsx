'use client'

import { ExtendedPost } from '@/types/db'
import React from 'react'

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  subredditName?: string
}

export default function PostFeed({ initialPosts, subredditName }: PostFeedProps) {
  console.log(initialPosts)
  return (
    <div>PostFeed</div>
  )
}
