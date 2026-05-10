export const dynamic = "force-dynamic";
import { getSortedPostsData } from '@/lib/posts';
import { friendsList } from '@/lib/friends';
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
 */
function extractAuthorName(filename) {
  const base = filename.replace(/\.[^.]+$/, '');
  const withoutSuffix = base.replace(/-unsplash$/, '');
  const parts = withoutSuffix.split('-');
  const authorParts = parts.slice(0, -1);
  return authorParts
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const categoryParam = params?.category;
  
  const allPostsData = getSortedPostsData();

  if (categoryParam) {
    let filteredPosts = allPostsData;
    let bannerTitle = "";
    let bannerDesc = "";

    if (categoryParam === 'Cat Care') {
      bannerTitle = "케어";
      bannerDesc = "우리 아이들의 건강과 행복을 위한 필수 돌봄 가이드";
      filteredPosts = allPostsData.filter(post => ['Health', 'Grooming', 'Environment', 'Safety', 'Behavior', 'Play'].includes(post.category));
    } else if (categoryParam === 'Rescue') {
      bannerTitle = "구조";
      bannerDesc = "위기에 처한 길 위의 생명들을 돕는 구조 및 공존 가이드";
      filteredPosts = allPostsData.filter(post => ['Street Life', 'Rights'].includes(post.category));
    } else if (categoryParam === 'News') {
      bannerTitle = "묘한 뉴스";
      bannerDesc = "동물권 및 공존과 관련된 최신 소식을 전해드려요";
      filteredPosts = allPostsData.filter(post => post.category === 'News');
    } else if (categoryParam === 'Class') {
      bannerTitle = "묘한 교실";
      bannerDesc = "어린이부터 어른까지 함께 배우는 동물권 카드 및 교육 자료";
      filteredPosts = allPostsData.filter(post => post.category === 'Class');
    }

    return (
      <main>
        <Banner title={bannerTitle} description={bannerDesc} />
        <section className="posts-container">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem 0', color: 'var(--text-secondary)' }}>해당 카테고리에 게시물이 없습니다.</p>
          )}
        </section>
      </main>
    );
  }

  // ── Home Page Multi-Section ──────────────────────────────────────
  
  // 1. Data Prep
  const heroImages = getHeroImages();
  let heroImageSrc = null;
  let authorName = null;

  if (heroImages.length > 0) {
    const catImages = heroImages.filter(f => f.toLowerCase().includes('cat'));
    const otherImages = heroImages.filter(f => !f.toLowerCase().includes('cat'));
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + kstOffset);
    const dayOfWeek = kstNow.getUTCDay();
    const epochDay = Math.floor(kstNow.getTime() / 86400000);
    
    let selectedImage;
    if (dayOfWeek % 2 === 0) {
      if (catImages.length > 0) {
        const index = epochDay % catImages.length;
        selectedImage = catImages[index];
      } else {
        selectedImage = heroImages[epochDay % heroImages.length];
      }
    } else {
      if (otherImages.length > 0) {
        const index = epochDay % otherImages.length;
        selectedImage = otherImages[index];
      } else {
        selectedImage = heroImages[epochDay % heroImages.length];
      }
    }

    if (selectedImage) {
      heroImageSrc = `/hero/${selectedImage}`;
      authorName = extractAuthorName(selectedImage);
    }
  }

  const newsPosts = allPostsData.filter(post => post.category === 'News');
  const latestNews = newsPosts.length > 0 ? newsPosts[0] : null;
  const latestTwoNews = newsPosts.slice(0, 2);

  const careRescuePosts = allPostsData.filter(post => 
    ['Health', 'Grooming', 'Environment', 'Safety', 'Behavior', 'Play', 'Street Life', 'Rights'].includes(post.category)
  );
  const latestTwoCare = careRescuePosts.slice(0, 2);

  const featuredFriends = friendsList.slice(0, 3);

  return (
    <div style={{ width: '100%' }}>
      {/* SECTION 1: HERO */}
      <main className="hero-container">
        {heroImageSrc && (
          <>
            <div className="hero-main-layer">
              <Image 
                src={heroImageSrc} 
                alt={authorName ? `Photo by ${authorName}` : 'Daily Animal Hero'} 
                fill 
                className="hero-main-image"
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="hero-overlay"></div>
          </>
        )}

        {latestNews && (
          <div className="hero-news-overlay" style={{
            position: 'absolute',
            bottom: '12%',
            left: '5%',
            right: '5%',
            color: '#FFFFFF',
            textShadow: '0 2px 15px rgba(0,0,0,0.4)',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2.5rem',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            borderRadius: '12px',
            zIndex: 5,
            backdropFilter: 'blur(4px)'
          }}>
            <h2 style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', fontWeight: '500', marginBottom: '0.8rem', opacity: 0.9 }}>
              모든 생명이 존중받는 세상을 위해
            </h2>
            <span style={{ 
              display: 'inline-block', 
              backgroundColor: 'var(--accent-color)', 
              color: 'white', 
              padding: '5px 14px', 
              borderRadius: '30px', 
              fontSize: '0.85rem',
              fontWeight: '800',
              marginBottom: '1.2rem',
              textShadow: 'none',
              letterSpacing: '0.5px'
            }}>
              오늘의 핫뉴스 🔥
            </span>
            <Link href={`/posts/${latestNews.id}`} style={{ textDecoration: 'none', color: 'white' }}>
              <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.8rem)', fontWeight: '800', marginBottom: '1.2rem', letterSpacing: '-1.5px', lineHeight: '1.2' }}>
                {latestNews.title}
              </h1>
              <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: '300', opacity: 0.95, lineHeight: '1.6', wordBreak: 'keep-all', maxWidth: '800px' }}>
                {latestNews.summary || latestNews.hook || (latestNews.content ? latestNews.content.substring(0, 120) + '...' : '')}
              </p>
              <div style={{ marginTop: '2.5rem', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1.5px', display: 'inline-flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid white', paddingBottom: '6px' }}>
                뉴스 보러가기 ➔
              </div>
            </Link>
          </div>
        )}

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

      {/* SECTION 2: SLOGAN + INTRO */}
      <section className="home-section bg-cream">
        <div className="section-container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">"모든 생명이 존중받는 세상을 위해"</h2>
          <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
            고양이부터 고래까지, 알고 돌보고 함께합니다.
          </p>
          <div className="btn-group">
            <Link href="/?category=News" className="btn-primary">묘한 뉴스 보기 →</Link>
            <Link href="/?category=Class" className="btn-primary" style={{ backgroundColor: 'transparent', color: 'var(--accent-sub)', border: '2px solid var(--accent-sub)' }}>묘한 교실 가기 →</Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: CARE PREVIEW */}
      <section className="home-section bg-cream" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">돌봄</h2>
            <p className="section-subtitle">케어부터 구조까지, 모든 생명을 돌봅니다.</p>
          </div>
          <div className="section-grid cols-2">
            {latestTwoCare.map(post => (
              <PostCard key={post.id} post={post} objectPosition="center top" />
            ))}
          </div>
          <div className="section-footer">
            <Link href="/care" className="section-link">돌봄 더보기 →</Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: NEWS PREVIEW */}
      <section className="home-section bg-mint">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">묘한 뉴스</h2>
            <p className="section-subtitle">동물권 및 공존과 관련된 최신 소식을 전해드려요</p>
          </div>
          <div className="section-grid cols-2">
            {latestTwoNews.map(post => {
              const isEvent = post.tags?.includes('이벤트') || post.category === 'Event';
              const emoji = isEvent ? '🎁' : (post.category === 'News' ? '📰' : '🐾');
              return (
                <Link href={`/posts/${post.id}`} key={post.id} style={{ textDecoration: 'none' }}>
                  <div className="post-card" style={{ height: '100%' }}>
                    <div className="card-image-wrapper">
                      <img 
                        src={post.image || '/cat/katya-guseva0-cat-2605502_1920.jpg'} 
                        alt={post.title} 
                        className="card-image"
                        style={{ objectPosition: 'center top' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'white',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        zIndex: 2
                      }}>
                        {emoji} {post.tag || '뉴스'}
                      </div>
                    </div>
                    <div className="card-content">
                      <h2 className="post-title" style={{ fontSize: '1.4rem' }}>{post.title}</h2>
                      <p className="excerpt" style={{ fontSize: '0.9rem', color: '#2D6A4F', fontWeight: '500', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                        {post.hook}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', fontSize: '0.8rem', color: '#999' }}>
                        <span>⏱️ {post.readTime || '3 min read'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="section-footer">
            <Link href="/?category=News" className="section-link">묘한 뉴스 더보기 →</Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: CLASSROOM BANNER */}
      <section className="home-section bg-forest">
        <div className="section-container classroom-banner">
          <h2 className="section-title" style={{ color: 'white' }}>동물권, 함께 배워요</h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>
            어린이부터 어른까지 함께 배우는 동물권 카드 및 교육 자료
          </p>
          <div className="classroom-tags">
            <span className="classroom-tag">#공장식축산</span>
            <span className="classroom-tag">#멸종위기</span>
            <span className="classroom-tag">#도시공존</span>
          </div>
          <Link href="/?category=Class" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--accent-sub)' }}>
            교실 입장하기 →
          </Link>
        </div>
      </section>

      {/* SECTION 6: FRIENDS PREVIEW */}
      <section className="home-section bg-white">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">좋은 친구들</h2>
            <p className="section-subtitle">우리가 알아야 할, 생명을 살리는 멋진 단체와 매체들</p>
          </div>
          <div className="section-grid">
            {featuredFriends.map((friend, index) => (
              <div key={index} className="post-card" style={{ height: '100%' }}>
                <div className="card-image-wrapper">
                  <Image src={friend.image} alt={friend.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="card-content">
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                    {friend.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--accent-sub)', fontWeight: '600' }}>#{tag}</span>
                    ))}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{friend.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>{friend.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="section-footer">
            <Link href="/friends" className="section-link">친구들 모두 보기 →</Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAMILY TEASER */}
      <section className="home-section bg-cream">
        <div className="section-container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">묘한 식구들</h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            고양이부터 도마뱀까지, 우리와 함께 사는 모든 식구들
          </p>
          <Link href="/family" className="btn-primary">우리 식구 소개하기 →</Link>
        </div>
      </section>

      {/* SECTION 8: FOOTER */}
      <footer className="home-section bg-dark main-footer">
        <div className="section-container">
          <div className="footer-logo">
            <Image src="/logo-green-v2.png" alt="묘한 가이드" width={140} height={86} style={{ filter: 'brightness(0) invert(1)', width: 'auto', height: '60px' }} />
          </div>
          <h3 className="footer-slogan">모든 생명이 존중받는 세상을 위해</h3>
          <p className="footer-motto">KNOW MORE. CARE BETTER.</p>
          <div className="footer-copyright">
            Copyright 2026 묘한 가이드
          </div>
        </div>
      </footer>
    </div>
  );
}
