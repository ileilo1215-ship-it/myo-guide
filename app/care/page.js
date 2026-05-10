import { getSortedPostsData } from '@/lib/posts';
import Banner from '@/components/Banner';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export const dynamic = "force-dynamic";

export default async function CarePage({ searchParams }) {
  const params = await searchParams;
  const filter = params?.filter || 'all';
  
  const allPostsData = getSortedPostsData();
  
  // Define categories for 'Care' (돌봄)
  const careCategories = ['Health', 'Grooming', 'Environment', 'Safety', 'Behavior', 'Play'];
  const rescueCategories = ['Street Life', 'Rights'];
  
  // Filter for both care and rescue
  let filteredPosts = allPostsData.filter(post => 
    careCategories.includes(post.category) || rescueCategories.includes(post.category)
  );

  // Sub-filter based on user selection
  if (filter === 'care') {
    filteredPosts = filteredPosts.filter(post => careCategories.includes(post.category));
  } else if (filter === 'rescue') {
    filteredPosts = filteredPosts.filter(post => rescueCategories.includes(post.category));
  }

  const bannerTitle = "돌봄";
  const bannerDesc = "우리 아이들의 건강한 삶과 길 위 생명들의 안전한 공존을 위한 가이드";

  const filterButtonStyle = (isActive) => ({
    padding: '10px 20px',
    borderRadius: '30px',
    fontSize: '0.95rem',
    fontWeight: '600',
    textDecoration: 'none',
    backgroundColor: isActive ? 'var(--accent-sub)' : 'white',
    color: isActive ? 'white' : 'var(--text-secondary)',
    border: `1px solid ${isActive ? 'var(--accent-sub)' : 'var(--border-color)'}`,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: isActive ? '0 4px 12px rgba(45, 106, 79, 0.2)' : '0 2px 4px rgba(0,0,0,0.03)'
  });

  return (
    <main>
      <style dangerouslySetInnerHTML={{ __html: `
        .filter-buttons {
          max-width: 1200px;
          margin: 0 auto 3rem;
          padding: 0 2rem;
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .filter-btn {
          padding: 10px 24px;
          border-radius: 40px;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border-color);
          background: white;
          color: var(--text-secondary);
          box-shadow: 0 2px 4px rgba(0,0,0,0.03);
        }
        .filter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.08);
          border-color: var(--accent-color);
          color: var(--accent-sub);
        }
        .filter-btn.active {
          background-color: var(--accent-sub);
          color: white;
          border-color: var(--accent-sub);
          box-shadow: 0 4px 15px rgba(45, 106, 79, 0.3);
        }
        .filter-btn.active:hover {
          background-color: #1a4731;
          transform: translateY(-2px);
        }
      `}} />
      
      <Banner title={bannerTitle} description={bannerDesc} />
      
      <div className="filter-buttons">
        <Link href="/care?filter=all" className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>
          전체
        </Link>
        <Link href="/care?filter=care" className={`filter-btn ${filter === 'care' ? 'active' : ''}`}>
          🌿 케어
        </Link>
        <Link href="/care?filter=rescue" className={`filter-btn ${filter === 'rescue' ? 'active' : ''}`}>
          🚨 구조
        </Link>
      </div>

      <section className="posts-container">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '5rem 0', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            해당 카테고리에 아직 게시물이 없습니다. 곧 유익한 소식으로 채워질 거예요! 🐾
          </p>
        )}
      </section>
    </main>
  );
}
