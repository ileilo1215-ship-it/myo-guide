import { getSortedPostsData } from '@/lib/posts';
import '@/app/hero-credit.css';
import Banner from '@/components/Banner';
import PostCard from '@/components/PostCard';
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

/**
 * Reads hero images from /public/hero/ directory.
 * Returns sorted list of .jpg/.jpeg/.png/.webp filenames.
 */
function getHeroImages() {
  const heroDir = path.join(process.cwd(), 'public', 'hero');
  try {
    const files = fs.readdirSync(heroDir);
    return files
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort(); // stable alphabetical order for consistent cycling
  } catch {
    return [];
  }
}

/**
 * Extracts a formatted author name from an Unsplash filename.
 * Pattern: <author-name>-<unsplash-code>-unsplash.jpg
 * Example: rishabh-p-s-D0JkVggwcV4-unsplash.jpg → "Rishabh P S"
 */
function extractAuthorName(filename) {
  // Remove extension
  const base = filename.replace(/\.[^.]+$/, '');
  // Remove trailing -unsplash
  const withoutSuffix = base.replace(/-unsplash$/, '');
  // The last segment before the author name is the Unsplash code (all-caps or mixed with digits, 10-11 chars)
  // Split by hyphen and drop the last token (the code)
  const parts = withoutSuffix.split('-');
  // The code is the last element — drop it
  const authorParts = parts.slice(0, -1);
  // Capitalize first letter of each word
  return authorParts
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

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

  // ── Daily Hero Image Selection ──────────────────────────────────────
  const heroImages = getHeroImages();
  let heroImageSrc = null;
  let authorName = null;

  if (heroImages.length > 0) {
    // Use today's date as epoch day count for consistent daily rotation
    const today = new Date();
    const epochDay = Math.floor(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000
    );
    const index = epochDay % heroImages.length;
    const filename = heroImages[index];
    heroImageSrc = `/hero/${filename}`;
    authorName = extractAuthorName(filename);
  }

  // Get Latest News Post
  const newsPosts = allPostsData.filter(post => post.category === 'News');
  const latestNews = newsPosts.length > 0 ? newsPosts[0] : null;

  // Home Page Hero Section
  return (
    <main style={{ position: 'relative', width: '100%', height: '100svh', overflow: 'hidden', backgroundColor: '#1a1a2e' }}>
      {heroImageSrc && (
        <Image 
          src={heroImageSrc} 
          alt={authorName ? `Photo by ${authorName}` : 'Daily Animal Hero'} 
          fill 
          style={{ objectFit: 'cover' }}
          priority
        />
      )}

      {/* Latest News Overlay — bottom left */}
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
          <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.4rem)', fontWeight: '500', marginBottom: '1rem', letterSpacing: '0', opacity: 0.9 }}>
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
            <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-1px', lineHeight: '1.3' }}>
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

      {/* Photo Credit — bottom right */}
      {authorName && (
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-credit"
        >
          📷 Photo by {authorName} on Unsplash
        </a>
      )}
    </main>
  );
}
