import { getSortedPostsData } from '@/lib/posts';
import Banner from '@/components/Banner';
import PostCard from '@/components/PostCard';
import Image from 'next/image';
import Link from 'next/link';

// 7 High-quality Unsplash real cat/animal images
const dailyImages = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop", // Sunday
  "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop", // Monday
  "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1974&auto=format&fit=crop", // Tuesday
  "https://images.unsplash.com/photo-1529778456209-41712a201b1c?q=80&w=2070&auto=format&fit=crop", // Wednesday
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1935&auto=format&fit=crop", // Thursday
  "https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=2070&auto=format&fit=crop", // Friday
  "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=2070&auto=format&fit=crop", // Saturday
];

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const categoryParam = params?.category;
  
  let allPostsData = getSortedPostsData();
  let bannerTitle = "";
  let bannerDesc = "";

  if (categoryParam) {
    if (categoryParam === 'Cat Care') {
      bannerTitle = "케어";
      bannerDesc = "우리 아이들의 건강과 행복을 위한 필수 돌봄 가이드";
      allPostsData = allPostsData.filter(post => ['Health', 'Grooming', 'Environment', 'Safety', 'Behavior', 'Play'].includes(post.category));
    } else if (categoryParam === 'Rescue') {
      bannerTitle = "구조";
      bannerDesc = "위기에 처한 길 위의 생명들을 돕는 구조 및 공존 가이드";
      allPostsData = allPostsData.filter(post => ['Street Life', 'Rights'].includes(post.category));
    } else if (categoryParam === 'News') {
      bannerTitle = "묘한 뉴스";
      bannerDesc = "출처가 분명한 동물권 및 공존 관련 최신 보도자료";
      allPostsData = allPostsData.filter(post => post.category === 'News');
    } else if (categoryParam === 'Class') {
      bannerTitle = "묘한 교실";
      bannerDesc = "어린이부터 어른까지 함께 배우는 동물권 카드 및 교육 자료";
      allPostsData = allPostsData.filter(post => post.category === 'Class');
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

  // Calculate Daily Image Index
  const currentDay = new Date().getDay(); // 0 (Sun) to 6 (Sat)
  const heroImageUrl = dailyImages[currentDay];

  // Get Latest News Post
  const newsPosts = allPostsData.filter(post => post.category === 'News');
  const latestNews = newsPosts.length > 0 ? newsPosts[0] : null;

  // Home Page Hero Section
  return (
    <main style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Image 
        src={heroImageUrl} 
        alt="Daily Healing Animal" 
        fill 
        style={{ objectFit: 'cover' }}
        priority
        unoptimized
      />
      {latestNews && (
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          color: '#FFFFFF',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          maxWidth: '800px',
          padding: '2rem',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
          borderRadius: '8px'
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '500', marginBottom: '1rem', letterSpacing: '0', opacity: 0.9 }}>
            모든 생명이 존중받는 세상을 위해
          </h2>
          <span style={{ 
            display: 'inline-block', 
            backgroundColor: 'var(--accent-sub)', 
            color: 'white', 
            padding: '6px 16px', 
            borderRadius: '30px', 
            fontSize: '0.9rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textShadow: 'none',
            letterSpacing: '1px'
          }}>
            오늘의 핫뉴스 🔥
          </span>
          <Link href={`/posts/${latestNews.id}`} style={{ textDecoration: 'none', color: 'white' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-1px', lineHeight: '1.2' }}>
              {latestNews.title}
            </h1>
            <p style={{ fontSize: '0.8rem', fontWeight: '300', opacity: 0.9 }}>
              {latestNews.content ? latestNews.content.substring(0, 100) + '...' : ''}
            </p>
            <div style={{ marginTop: '2rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', display: 'inline-block', borderBottom: '2px solid white', paddingBottom: '4px' }}>
              뉴스 보러가기 ➔
            </div>
          </Link>
        </div>
      )}
    </main>
  );
}
