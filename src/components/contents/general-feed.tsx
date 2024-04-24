
import PostFeed from './post-feed'
import { fetchManyPosts } from '@/lib/data'

export default async function GeneralFeed() {
  const posts = await fetchManyPosts()
  return posts && posts.length > 0 
    ? <PostFeed initialPosts={posts} />
    // TODO: add picture
    : <div>no data</div>;
}
