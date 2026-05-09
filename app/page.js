export const dynamic = "force-dynamic";
import { getSortedPostsData } from '@/lib/posts';
import '@/app/hero-credit.css';
import '@/app/hero-section.css';

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
      bannerDesc = "동물권 및 공존과 관련된 최신 소식을 전해드려요";
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
    const catImages = heroImages.filter(f => f.toLowerCase().includes('cat'));
    const otherImages = heroImages.filter(f => !f.toLowerCase().includes('cat'));

    // Use today's date in KST (UTC+9) for consistent daily rotation in Korea
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + kstOffset);
    
    // getUTCDay() returns 0 for Sunday, 1 for Monday, etc.
    // We'll use this to alternate categories.
    const dayOfWeek = kstNow.getUTCDay();
    const epochDay = Math.floor(kstNow.getTime() / 86400000);
    
    let selectedImage;
    // Monday(1), Wednesday(3), Friday(5), Sunday(0) -> Cats (Every other day starting from Mon)
    // Tuesday(2), Thursday(4), Saturday(6) -> Others
    // Actually, dayOfWeek % 2 === 1 is Mon, Wed, Fri. Let's make it more regular.
    // Let's use Sun, Tue, Thu, Sat for Cats (0, 2, 4, 6) and Mon, Wed, Fri for Others (1, 3, 5)
    if (dayOfWeek % 2 === 0) {
      // Cat Days: Sun, Tue, Thu, Sat
      if (catImages.length > 0) {
        const index = epochDay % catImages.length;
        selectedImage = catImages[index];
      } else {
        selectedImage = heroImages[epochDay % heroImages.length];
      }
    } else {
      // Other Animal Days: Mon, Wed, Fri
      if (otherImages.length > 0) {
        const index = epochDay % otherImages.length;
        selectedImage = otherImages[index];
      } else {
        selectedImage = heroImages[epochDay % heroImages.length];
      }
    }

    // Get Latest News Post
    const newsPosts = allPostsData.filter(post => post.category === 'News');
    const latestNews = newsPosts.length > 0 ? newsPosts[0] : null;

    if (latestNews && latestNews.image) {
      heroImageSrc = latestNews.image;
      // If it's a local path, we might not have an author name easily, 
      // but if it's an Unsplash path we can try to extract it.
      if (heroImageSrc.startsWith('/hero/')) {
        authorName = extractAuthorName(heroImageSrc.replace('/hero/', ''));
      } else if (heroImageSrc.includes('unsplash.com')) {
        // Fallback for external unsplash links if any
        authorName = "Unsplash";
      }
    } else if (selectedImage) {
      heroImageSrc = `/hero/${selectedImage}`;
      authorName = extractAuthorName(selectedImage);
    }
  }

  // Get Latest News Post (already fetched above, but keeping the variable scope clear)
  const newsPosts = allPostsData.filter(post => post.category === 'News');
  const latestNews = newsPosts.length > 0 ? newsPosts[0] : null;

  // Home Page Hero Section
  return (
    <main className="hero-container">
      {heroImageSrc && (
        <>
          {/* Main Hero Image */}
          <div className="hero-main-layer">
            <Image 
              src={heroImageSrc} 
              alt={authorName ? `Photo by ${authorName}` : 'Daily Animal Hero'} 
              fill 
              className="hero-main-image"
              priority
            />
          </div>
          {/* Subtle Overlay for Readability */}
          <div className="hero-overlay"></div>
        </>
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
          borderRadius: '8px',
          zIndex: 5
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
            <p style={{ fontSize: '0.95rem', fontWeight: '300', opacity: 0.9, lineHeight: '1.6', wordBreak: 'keep-all' }}>
              {latestNews.summary || latestNews.hook || (latestNews.content ? latestNews.content.substring(0, 100) + '...' : '')}
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
