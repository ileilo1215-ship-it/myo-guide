
import { getSortedPostsData } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { Jua } from "next/font/google";

const jua = Jua({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: 'Categories | 묘한 가이드',
  description: '카테고리별로 모아보는 묘한 가이드 글 목록',
};

export default function CategoriesPage() {
  const allPosts = getSortedPostsData();
  
  const groupedPosts = allPosts.reduce((acc, post) => {
    const category = post.category || '기타';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(post);
    return acc;
  }, {});

  const categories = Object.keys(groupedPosts).sort();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 className={jua.className} style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem', color: 'var(--text-primary)' }}>
        분야별 꿀팁 모아보기 📚
      </h1>

      {categories.map((category) => (
        <section key={category} style={{ marginBottom: '5rem' }}>
          <h2 className={jua.className} style={{ fontSize: '2rem', color: 'var(--accent-color)', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            # {category}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem 2.5rem' }}>
            {groupedPosts[category].map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
