import { Button } from '@/components/ui/button'
import { fetchFirstSubredditName } from '@/lib/data'
import { notFound } from 'next/navigation'
import React from 'react'

interface SubmitPageProps {
  params: {
    slug: string
  }
}

export default async function SubmitPage({ params }: SubmitPageProps) {
  const slug = params.slug
  const subreddit = await fetchFirstSubredditName(slug)

  if (!subreddit) {
    return notFound()
  }

  return (
    <div className='flex flex-col items-start gap-6 bg-background border border-border rounded-lg shadow p-4'>
      {/* heading */}
      <div className='border-b border-primary pb-2 w-full '>
        <div className='flex flex-wrap items-baseline '>
          <h3 className='text-base font-semibold leading-6 text-foreground'>
            Create Post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm text-gray-500'>
            in r/{params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      {/* <Editor subredditId={subreddit.id} /> */}

      <div className='w-full flex justify-end'>
        <Button type='submit' className='w-full' form='subreddit-post-form'>
          Post
        </Button>
      </div>
    </div>
  )
}
