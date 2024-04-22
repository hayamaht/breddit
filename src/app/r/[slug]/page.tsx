import { fetchFirstSubreddit } from "@/lib/data"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = params
  const subreddit = await fetchFirstSubreddit(slug)

  if (!subreddit) return notFound()
    
  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        r/{subreddit.name}
      </h1>
      <div>
        <p>{subreddit.createdAt.toISOString()}</p>
      </div>
      {/* TODO: add post-feed */}
      {/* <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} /> */}
    </>
  )
}
