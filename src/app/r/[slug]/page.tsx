import MiniCreatePost from "@/components/contents/mini-create-post"
import PostFeed from "@/components/contents/post-feed"
import { getAuthSession } from "@/lib/auth"
import { fetchFirstSubreddit } from "@/lib/data"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = params
  const session = await getAuthSession()
  const subreddit = await fetchFirstSubreddit(slug)

  if (!subreddit) return notFound()
    
  return (
    <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  )
}
