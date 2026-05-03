import { getSortedPostsData } from '@/lib/posts';
import Banner from '@/components/Banner';
import PostCard from '@/components/PostCard';

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const categoryParam = params?.category;
  
  let allPostsData = getSortedPostsData();
  let bannerTitle = "🐾 묘한 가이드 🐾";
  let bannerDesc = "모든 생명이 존중받는 세상을 꿈꾸는 공존 가이드 🌿";

  if (categoryParam) {
    if (categoryParam === 'Cat Care') {
      bannerTitle = "Cat Care";
      bannerDesc = "우리 아이들의 건강과 행복을 위한 필수 돌봄 가이드";
      allPostsData = allPostsData.filter(post => ['Health', 'Grooming', 'Environment', 'Safety', 'Behavior', 'Play'].includes(post.category));
    } else if (categoryParam === 'Rescue') {
      bannerTitle = "Rescue";
      bannerDesc = "위기에 처한 길 위의 생명들을 돕는 구조 및 공존 가이드";
      allPostsData = allPostsData.filter(post => ['Street Life', 'Rights'].includes(post.category));
    } else if (categoryParam === 'News') {
      bannerTitle = "News";
      bannerDesc = "기후위기부터 새로운 도시계획까지, 다양한 최신 소식";
      allPostsData = allPostsData.filter(post => post.category === 'News');
    }
  }

  return (
    <main>
      <Banner title={bannerTitle} description={bannerDesc} />
      <section className="posts-container">
        {allPostsData.length > 0 ? (
          allPostsData.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem 0', color: 'var(--text-secondary)' }}>해당 카테고리에 게시물이 없습니다.</p>
        )}
      </section>
    </main>
  );
}
