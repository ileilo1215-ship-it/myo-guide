export const dynamic = "force-dynamic";
import { getSortedPostsData } from '@/lib/posts';
import { friendsList } from '@/lib/friends';
import { GOOGLE_FORM_URL } from '@/lib/constants';
import { getFamilyData } from '@/lib/family';
import '@/app/hero-credit.css';

import Banner from '@/components/Banner';
import PostCard from '@/components/PostCard';
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';


// --- NEWS PAGE ITEM COMPONENT ---
function NewsPageItem({ post }) {
  return (
    <article className="news-magazine-card">
      <div className="news-magazine-image">
        {post.image ? (
          <img src={post.image} alt={post.title} />
        ) : (
          <div className="news-magazine-placeholder">🐾</div>
        )}
      </div>
      
      <div className="news-magazine-content">
        <span className="news-magazine-tag">{post.tag || '🗞️ 뉴스'}</span>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h2 className="news-magazine-title">{post.title}</h2>
            <div className="news-magazine-meta" style={{ marginBottom: post.editorNote ? '20px' : '0' }}>
              <span>{post.source || '매체'}</span>
              <span className="news-meta-divider">|</span>
              <span>{post.date}</span>
            </div>
          </div>
          <Link href={`/posts/${post.id}`} className="news-read-btn-circle">
            기사<br />읽기
          </Link>
        </div>
        
        {post.editorNote && (
          <div className="news-magazine-editor-note">
            {post.editorNote}
          </div>
        )}
      </div>
    </article>
  );
}

import { educationalContent } from '@/lib/educational-content';

// --- CLASSROOM PAGE COMPONENTS ---
function ClassCard({ post }) {
  const hasEducationalContent = !!educationalContent[post.id];

  return (
    <article className="classroom-card">
      {post.image && (
        <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div className="classroom-card-meta">
        {post.tag && (
          <Link 
            href={`/?category=Class&tag=${post.tag.replace(/^[^\s]+\s*/, '')}`} 
            className="classroom-category-pill"
          >
            {post.tag}
          </Link>
        )}
        <span className="classroom-grade-badge">{post.grade || '전체'}</span>
        <span style={{ fontSize: '12px', color: '#888' }}>{post.duration || '40'}분 수업</span>
      </div>
      <h3 className="classroom-card-title">{post.title}</h3>
      <div className="classroom-card-footer">
        <div className="classroom-btn-group">
          <Link href={`/posts/${post.id}`} className="classroom-btn-start">
            수업 시작
          </Link>
          {hasEducationalContent && (
            <>
              <Link href={`/learn/worksheet/${post.id}`} target="_blank" className="classroom-pdf-btn">
                학생용 자료
              </Link>
              <Link href={`/learn/guide/${post.id}`} target="_blank" className="classroom-pdf-btn">
                교사용 가이드
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function ClassroomView({ posts, selectedTag }) {
  // Extract unique full tags from posts
  const uniqueFullTags = [...new Set(posts.map(p => p.tag).filter(Boolean))];
  const tagObjects = [
    { display: '🐾 전체', value: '전체' },
    ...uniqueFullTags.map(fullTag => ({
      display: fullTag,
      value: fullTag.replace(/^[^\s]+\s*/, '')
    }))
  ];
  
  // Filter posts by tag
  const filteredPosts = selectedTag && selectedTag !== '전체' 
    ? posts.filter(p => p.tag?.includes(selectedTag))
    : posts;

  // Pick a question for the box (either from the first post or a random one)
  const questionPost = filteredPosts.find(p => p.coreQuestion) || posts.find(p => p.coreQuestion);
  const displayQuestion = questionPost?.coreQuestion || "우리는 동물과 어떻게 함께 살아가야 할까요?";
  const bgImage = questionPost?.image || '/hero/sam-grozyan-hQPoYovqWR0-unsplash.jpg';

  return (
    <div className="classroom-container">
        {/* Question Box */}
        <div className="classroom-question-box">
          <img src={bgImage} alt="" className="classroom-question-bg" />
          <div className="classroom-question-content">
            <span className="classroom-question-label">오늘의 질문</span>
            <h2 className="classroom-question-text">
              {displayQuestion}
            </h2>
          </div>
        </div>

        {/* Tag Cloud */}
        <div className="classroom-tag-cloud">
          {tagObjects.map(tagObj => (
            <Link 
              key={tagObj.value} 
              href={`/?category=Class${tagObj.value === '전체' ? '' : `&tag=${tagObj.value}`}`}
              className={`classroom-tag-pill ${selectedTag === tagObj.value || (!selectedTag && tagObj.value === '전체') ? 'active' : ''}`}
            >
              {tagObj.display}
            </Link>
          ))}
        </div>

        {/* Lesson Cards */}
        <section className="classroom-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <ClassCard key={post.id} post={post} />
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem 0', color: 'var(--text-secondary)' }}>해당 주제의 수업이 아직 준비 중입니다.</p>
          )}
        </section>
      </div>
  );
}


import HeroSlider from '@/components/HeroSlider';

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const categoryParam = params?.category;
  const qParam = params?.q;
  
  const allPostsData = getSortedPostsData();

  if (qParam) {
    const filteredSearchPosts = allPostsData.filter(post => 
      post.title?.toLowerCase().includes(qParam.toLowerCase()) || 
      post.content?.toLowerCase().includes(qParam.toLowerCase()) ||
      post.summary?.toLowerCase().includes(qParam.toLowerCase()) ||
      post.hook?.toLowerCase().includes(qParam.toLowerCase())
    );

    return (
      <div style={{ width: '100%' }}>
        <Banner title={`"${qParam}" 검색 결과`} description={`${filteredSearchPosts.length}개의 게시물을 찾았습니다.`} />
        <section className="posts-container">
          {filteredSearchPosts.length > 0 ? (
            filteredSearchPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '5rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>검색 결과가 없습니다.</p>
              <Link href="/" className="btn-primary" style={{ marginTop: '2rem' }}>홈으로 돌아가기</Link>
            </div>
          )}
        </section>
      </div>
    );
  }

  if (categoryParam) {
    // ... existing category filtering logic ...
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
      bannerDesc = "동물권 및 공존과 관련된 의미 있는 소식을 전해드려요";
      const newsPosts = allPostsData.filter(post => post.category === 'News');
      const selectedTag = params?.tag;
      
      const uniqueFullTags = [...new Set(newsPosts.map(p => p.tag).filter(Boolean))];
      const tagObjects = [
        { display: '🗞️ 전체', value: '전체' },
        ...uniqueFullTags.map(fullTag => ({
          display: fullTag,
          value: fullTag.replace(/^[^\s]+\s*/, '')
        }))
      ];

      const filteredNews = selectedTag && selectedTag !== '전체'
        ? newsPosts.filter(p => p.tag?.includes(selectedTag))
        : newsPosts;

      return (
        <div className="news-page-wrapper">
          <Banner title={bannerTitle} description={bannerDesc} />
          
          <div className="news-tag-filter">
            {tagObjects.map(tagObj => (
              <Link 
                key={tagObj.value}
                href={`/?category=News${tagObj.value === '전체' ? '' : `&tag=${tagObj.value}`}`}
                className={`news-tag-pill ${selectedTag === tagObj.value || (!selectedTag && tagObj.value === '전체') ? 'active' : ''}`}
              >
                {tagObj.display}
              </Link>
            ))}
          </div>

          <section className="news-magazine-grid">
            {filteredNews.length > 0 ? (
              filteredNews.map((post) => (
                <NewsPageItem key={post.id} post={post} />
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>해당 카테고리에 게시물이 없습니다.</p>
            )}
          </section>
        </div>
      );
    } else if (categoryParam === 'Class') {
      const selectedTag = params?.tag;
      filteredPosts = allPostsData.filter(post => post.category === 'Class');
      
      return (
        <div className="classroom-wrapper">
          <Banner title="묘한 교실" description="어린이부터 어른까지 함께 배우는 동물권 카드 및 교육 자료" />
          <ClassroomView posts={filteredPosts} selectedTag={selectedTag} />
        </div>
      );
    }

    return (
      <div style={{ width: '100%' }}>
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
      </div>
    );
  }

  // ── Home Page Multi-Section ──────────────────────────────────────
  
  // 1. Daily Rotation Logic (KST 00:00)
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffset);
  const dayCount = Math.floor(kstDate.getTime() / (1000 * 60 * 60 * 24));

  // 2. Data Fetching
  const newsPosts = allPostsData
    .filter(post => post.category === 'News')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const allCareAndRescue = allPostsData.filter(post => {
    const cat = post.category?.replace(/['"]/g, '').trim() || '';
    return ['Health', 'Grooming', 'Environment', 'Safety', 'Behavior', 'Play', 'Street Life', 'Rights', '🚨 구조'].includes(cat);
  }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const classroomPosts = allPostsData.filter(post => post.category === 'Class');
  const allFamilyMembers = getFamilyData();

  // 3. Daily Selection Logic
  const carePool = allCareAndRescue.slice(0, 7); // Pick from 7 latest care posts
  const newsPool = newsPosts.slice(0, 7); // Pick from 7 latest news posts
  const classroomPool = classroomPosts.slice(0, 7);
  // Filter familyPool to only include those with existing images
  const familyPool = allFamilyMembers.filter(m => m.hasImage && m.images?.[0]);

  const dailyCare = carePool[dayCount % carePool.length] || allCareAndRescue[0];
  const dailyNews = newsPool[dayCount % newsPool.length] || newsPosts[0];
  const dailyClass = classroomPool[dayCount % classroomPool.length] || classroomPosts[0];
  const dailyFamily = familyPool[dayCount % familyPool.length];

  // 4. Hero Slides Preparation
  const slides = [
    {
      label: '돌봄 🐾',
      title: dailyCare?.title || '우리 아이들을 위한 돌봄 가이드',
      description: dailyCare?.summary || dailyCare?.hook || '건강하고 행복한 반려 생활을 위한 필수 정보를 확인해보세요.',
      image: dailyCare?.image || '/hero/annie-spratt-SGXycQg_2pA-unsplash.jpg',
      link: dailyCare ? `/posts/${dailyCare.id}` : '/care',
      subtitle: '알고 돌보면 더 행복해져요'
    },
    {
      label: '묘한 가족들 🐱',
      title: dailyFamily ? `${dailyFamily.name}와 함께하는 일상` : '함께 살아가는 우리 가족 이야기',
      description: dailyFamily?.description || '고양이부터 도마뱀까지, 우리와 함께 사는 소중한 생명들의 이야기를 만나보세요.',
      image: dailyFamily?.images[0] || '/hero/jordan-whitt-EerxztHCjM8-unsplash.jpg',
      link: '/family',
      subtitle: '서로 다른 우리가 만나 가족이 되었습니다'
    },
    {
      label: '묘한 뉴스 🗞️',
      title: dailyNews?.title || '세상을 바꾸는 동물권 소식',
      description: dailyNews?.summary || dailyNews?.hook || '동물권 및 공존과 관련된 의미 있는 소식들을 전해드립니다.',
      image: dailyNews?.image || '/hero/daria-shatova-BphuDA60if4-unsplash.jpg',
      link: dailyNews ? `/posts/${dailyNews.id}` : '/?category=News',
      subtitle: '“모든 생명이 존중받는 세상을 위해”'
    },
    {
      label: '묘한 교실 🎓',
      title: dailyClass?.title || '생명의 소중함, 함께 배워요',
      description: dailyClass?.summary || dailyClass?.coreQuestion || '어린이부터 어른까지 함께 배우는 동물권 카드 및 교육 자료를 확인해보세요.',
      image: dailyClass?.image || '/hero/ricky-kharawala-adK3Vu70DEQ-unsplash.jpg',
      link: dailyClass ? `/posts/${dailyClass.id}` : '/?category=Class',
      subtitle: '아는 만큼 더 사랑할 수 있어요'
    }
  ];

  const latestTwoCare = allCareAndRescue.slice(0, 2);
  const latestThreeNews = newsPosts.slice(0, 3);
  const teaserFamilyMembers = allFamilyMembers.filter(m => m.hasImage && m.images?.[0]).slice(0, 4);

  const featuredFriends = friendsList.slice(0, 3);

  return (
    <div style={{ width: '100%' }}>
      {/* SECTION 1: HERO SLIDER */}
      <HeroSlider slides={slides} />

      {/* SECTION 2: SLOGAN + INTRO */}
      <section className="home-section bg-cream">
        <div className="section-container" style={{ textAlign: 'center' }}>
          <h2 className="section-title slogan-title">모든 생명이 존중받는 세상을 위해</h2>
          <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
            고양이부터 고래까지, 알고 돌보고 함께합니다.
          </p>
          <div className="btn-group">
            <Link href="/care" className="btn-primary">돌봄 가이드 보기 &gt;</Link>
            <Link href="/?category=Class" className="btn-primary" style={{ backgroundColor: 'transparent', color: 'var(--accent-sub)', border: '2px solid var(--accent-sub)' }}>묘한 교실 가기 &gt;</Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: CARE PREVIEW */}
      <section className="home-section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">돌봄</h2>
            <p className="section-subtitle">케어부터 구조까지, 모든 생명을 돌봅니다.</p>
          </div>
          <div className="section-grid cols-2">
            {latestTwoCare.map(post => (
              <PostCard key={post.id} post={post} objectPosition="center 20%" />
            ))}
          </div>
          <div className="section-footer">
            <Link href="/care" className="btn-primary">돌봄 더보기 &gt;</Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: FAMILY TEASER */}
      <section className="home-section bg-cream">
        <div className="section-container" style={{ textAlign: 'center' }}>
          <div className="section-header">
            <h2 className="section-title">묘한 가족들</h2>
            <p className="section-subtitle">고양이부터 도마뱀까지, 우리와 함께 사는 모든 가족들</p>
          </div>
          
          <div className="btn-group" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            <Link href="/family" className="btn-primary">묘한 가족들 만나기 &gt;</Link>
            <a 
              href={GOOGLE_FORM_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary" 
              style={{ backgroundColor: 'transparent', color: 'var(--accent-sub)', border: '2px solid var(--accent-sub)' }}
            >
              우리 가족 소개하기 &gt;
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 5: NEWS PREVIEW */}
      <section className="home-section" style={{ backgroundColor: '#e8f4ee' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">묘한 뉴스</h2>
            <p className="section-subtitle">동물권 및 공존과 관련된 의미 있는 소식을 전해드려요</p>
          </div>
          <div className="section-grid cols-3" style={{ marginBottom: '3rem' }}>
            {latestThreeNews.map(post => (
              <article key={post.id} className="news-magazine-card simple-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="news-magazine-image" style={{ height: '180px' }}>
                  {post.image ? (
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="news-magazine-placeholder">🐾</div>
                  )}
                </div>
                <div className="news-magazine-content" style={{ flex: 1, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 className="news-magazine-title" style={{ fontSize: '1.1rem', lineHeight: '1.4', margin: '0 0 0.5rem 0' }}>{post.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
                      {post.source && <span>{post.source}</span>}
                      {post.source && post.date && <span style={{ margin: '0 6px' }}>|</span>}
                      {post.date && <span>{post.date}</span>}
                    </div>
                  </div>
                  <Link href={`/posts/${post.id}`} className="news-read-btn-circle">
                    기사<br />읽기
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="section-footer">
            <Link href="/?category=News" className="btn-primary">묘한 뉴스 더보기 &gt;</Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: CLASSROOM BANNER */}
      <section className="home-section bg-forest">
        <div className="section-container classroom-banner">
          <div className="classroom-banner-content">
            <h2 className="section-title" style={{ color: 'white' }}>동물권, 함께 배워요</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
              어린이부터 어른까지 함께 배우는 동물권 카드 및 교육 자료
            </p>
            <div className="classroom-tags">
              <span className="classroom-tag">#공장식축산</span>
              <span className="classroom-tag">#멸종위기</span>
              <span className="classroom-tag">#도시공존</span>
            </div>
            <Link href="/?category=Class" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--accent-sub)' }}>
              묘한 교실 입장하기 &gt;
            </Link>
          </div>
          <div className="classroom-banner-image">
            <img src="/hero/ricky-kharawala-adK3Vu70DEQ-unsplash.jpg" alt="Animal Education" />
          </div>
        </div>
      </section>

      {/* SECTION 7: FRIENDS PREVIEW */}
      <section className="home-section" style={{ backgroundColor: '#ffffff' }}>
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
            <Link href="/friends" className="btn-primary">친구들 모두 보기 &gt;</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

