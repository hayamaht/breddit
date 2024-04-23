import EditorOutput from '@/components/contents/editor-output'
import { buttonVariants } from '@/components/ui/button'
import { fetchFirstPostWithId } from '@/lib/data'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDownIcon, ArrowBigUpIcon, Loader2Icon } from 'lucide-react'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

export default async function SubRedditPostPage({ 
  params 
}: {
  params: {
    postId: string
  }
}) {
  // const postId = params.postId
  // const cachedPost = (await redis.hgetall(
  //   `post:${params.postId}`
  // )) as CachedPost

  // let post: (Post & { votes: Vote[]; author: User }) | null = null

  // if (!cachedPost) {
  //   const p = await fetchFirstPostWithId(postId)
  //   if (!p) return notFound()
  //   post = p
  // }

  // if (!post && !cachedPost) return notFound()

  return (
    <div>
      Post: {params.postId}
    </div>
  )
}

function PostVoteShell() {
  return (
    <div className='flex items-center flex-col pr-6 w-20'>
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUpIcon className='h-5 w-5 text-zinc-700' />
      </div>

      {/* score */}
      <div className='text-center py-2 font-medium text-sm text-zinc-900'>
        <Loader2Icon className='h-3 w-3 animate-spin' />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDownIcon className='h-5 w-5 text-zinc-700' />
      </div>
    </div>
  )
}