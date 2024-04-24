import CommentsSection from '@/components/contents/comments-section'
import EditorOutput from '@/components/contents/editor-output'
import PostVoteServer from '@/components/contents/post-vote-server'
import { buttonVariants } from '@/components/ui/button'
import { fetchFirstPostWithId, fetchUniquePost } from '@/lib/data'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachedPost } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDownIcon, ArrowBigUpIcon, Loader2Icon } from 'lucide-react'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function SubRedditPostPage({ 
  params 
}: {
  params: {
    postId: string
  }
}) {
  const postId = params.postId
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost

  let post: (Post & { votes: Vote[]; author: User }) | null = null

  if (!cachedPost) {
    const p = await fetchFirstPostWithId(postId)
    if (!p) return notFound()
    post = p
  }

  if (!post && !cachedPost) return notFound()

  return (
    <div>
      <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              const post = await fetchUniquePost(params.postId)
              if (!post) return notFound()
              return post
            }}
          />
        </Suspense>

        <div className='sm:w-0 w-full flex-1 bg-background border border-border p-4 rounded-sm'>
          <p className='max-h-40 mt-1 truncate text-xs text-foreground/60'>
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className='text-2xl font-semibold py-2 leading-6 text-primary border-b border-primary mb-4'>
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />
          <Suspense
            fallback={
              <Loader2Icon className='h-5 w-5 animate-spin text-zinc-500' />
            }>
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
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