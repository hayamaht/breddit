import { buttonVariants } from '@/components/ui/button'
import { getAuthSession } from '@/lib/auth'
import { fetchCountSubscription, fetchFirstSubredditWithPosts, fetchFirstSubscriptionBy } from '@/lib/data'
import Link from 'next/link'
import { format } from 'date-fns'
import SubscribeLeaveToggle from '@/components/contents/subscribe-leave-toggle'

export default async function SlugLayout({
  children,
  params: { slug },
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const session = await getAuthSession()
  const subreddit = await fetchFirstSubredditWithPosts(slug)
  const subscription = session?.user
    ? await fetchFirstSubscriptionBy(slug, session.user.id)
    : undefined
  const isSubscribed = !!subscription
  const memberCount = fetchCountSubscription(slug)

  if (!subreddit) {
    return <div>Subreddit not found</div>
  }

  const isCreator = subreddit.creatorId === session?.user.id

  return (
    <div className='sm:container max-w-7xl mx-auto h-full pt-12'>
      <div>
        {/* TODO: add to-feed-btn */}
        {/* <ToFeedButton /> */}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
          <ul className='flex flex-col col-span-2 space-y-6'>{children}</ul>

          {/* info sidebar */}
          <div className='overflow-hidden h-fit rounded-lg border border-border order-first md:order-last'>
            <div className='px-6 py-4 bg-primary/70'>
              <p className='font-semibold py-3'>About r/{subreddit.name}</p>
            </div>
            <div className='divide-y divide-primary px-6 py-4 text-sm leading-6 bg-primary/30'>
              <div className='flex justify-between gap-x-4 py-3'>
                <div className='text-foreground'>Created</div>
                <div className='text-primary-foreground'>
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, 'MMMM d, yyyy')}
                  </time>
                </div>
              </div>
              <div className='flex justify-between gap-x-4 py-3'>
                <div className='text-foreground'>Members</div>
                <div className='flex items-start gap-x-2'>
                  <div className='text-primary-foreground'>{memberCount}</div>
                </div>
              </div>
              {isCreator ? (
                <div className='flex justify-between gap-x-4 py-3'>
                  <div className='text-foreground'>You created this community</div>
                </div>
              ) : null}

              {!isCreator ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              ) : null}
              <Link
                className={buttonVariants({
                  variant: 'default',
                  className: 'w-full',
                })}
                href={`r/${slug}/submit`}>
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
