import { getSortedPostsData } from '@/lib/posts';
import Banner from '@/components/Banner';
import PostCard from '@/components/PostCard';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <main>
      <Banner />
      <section className="posts-container">
        {allPostsData.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}
