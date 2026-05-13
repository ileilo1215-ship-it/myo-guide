export const dynamic = "force-dynamic";
export const revalidate = 0;
import { getSortedPostsData } from '@/lib/posts';
import { friendsList } from '@/lib/friends';
import { GOOGLE_FORM_URL } from '@/lib/constants';
import { getFamilyData } from '@/lib/family';
import { educationalContent } from '@/lib/educational-content';
import '@/app/hero-credit.css';

import Banner from '@/components/Banner';
import PostCard from '@/components/PostCard';
import HeroSlider from '@/components/HeroSlider';
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';


// --- HELPERS ---
function getDailySelection(items, count, seed) {
  if (!items || items.length === 0) return [];
  if (items.length <= count) return items;
  
  const result = [];
  const pool = [...items];
  
  // Deterministic shuffle/pick based on seed
  for (let i = 0; i < count; i++) {
    const index = (seed + i * 13) % pool.length; // Use 13 as a prime skip
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

// --- NEWS PAGE ITEM COMPONENT ---
function NewsPageItem({ post }) {
  if (!post) return null;
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
            <h2 className="news-magazine-title" style={{ lineHeight: '1.25', marginBottom: '8px' }}>{post.title}</h2>
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


// --- CLASSROOM PAGE COMPONENTS ---
function ClassCard({ post }) {
  if (!post) return null;
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

function DiscoveryView({ newsPosts = [], classPosts = [], currentTab = 'news', params = {} }) {
  const activeTab = currentTab || 'news';
  
  return (
    <div className="discovery-wrapper">
      <div className="discovery-nav-tabs">
        <Link 
          href="/?category=Discovery&tab=news" 
          className={`discovery-nav-item news-theme ${activeTab === 'news' ? 'active' : ''}`}
        >
          <span className="nav-emoji">🗞️</span>
          <span className="nav-label">뉴스</span>
        </Link>
        <Link 
          href="/?category=Discovery&tab=class" 
          className={`discovery-nav-item learn-theme ${activeTab === 'class' ? 'active' : ''}`}
        >
          <span className="nav-emoji">🌱</span>
          <span className="nav-label">배움</span>
        </Link>
      </div>

      <div className="discovery-content-container">
        {activeTab === 'news' && (
          <>
            <div className="news-content-header">
              <h2 className="news-main-title">뉴스</h2>
            </div>

            <div className="news-tag-cloud">
              <Link 
                href="/?category=Discovery&tab=news" 
                className={`news-tag-pill ${!params?.tag ? 'active' : ''}`}
              >
                🖋️ 전체
              </Link>
              {[
                { label: '법·정책', icon: '⚖️' },
                { label: '동물권', icon: '🐾' },
                { label: '도시·환경', icon: '🌿' },
                { label: '문화/영화', icon: '🎬' },
                { label: '책', icon: '📚' }
              ].map(tagObj => (
                <Link 
                  key={tagObj.label} 
                  href={`/?category=Discovery&tab=news&tag=${tagObj.label}`} 
                  className={`news-tag-pill ${params?.tag === tagObj.label ? 'active' : ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>{tagObj.icon}</span>
                  <span>{tagObj.label}</span>
                </Link>
              ))}
            </div>
            <section className="discovery-section">
              <div className="news-magazine-grid">
                {(newsPosts || [])
                  .filter(post => post && (!params?.tag || post.tag?.includes(params?.tag)))
                  .map(post => <NewsPageItem key={post?.id || Math.random()} post={post} />)}
              </div>
            </section>
          </>
        )}

        {activeTab === 'class' && (
          <>
            <div className="learn-content-header">
              <h2 className="learn-main-title">배움</h2>
            </div>

            <div className="classroom-question-box">
              <img 
                src={classPosts?.[0]?.image || "/hero/ricky-kharawala-adK3Vu70DEQ-unsplash.jpg"} 
                alt="Background" 
                className="classroom-question-bg" 
              />
              <div className="classroom-question-content">
                <span className="classroom-question-label">오늘의 질문</span>
                <h2 className="classroom-question-text">
                {classPosts?.[0]?.coreQuestion || "동물을 보호하는 법이 왜 필요할까요?"}
                </h2>
              </div>
            </div>

            <div className="classroom-tag-cloud">
              <Link 
                href="/?category=Discovery&tab=class" 
                className={`classroom-tag-pill ${!params?.tag ? 'active' : ''}`}
              >
                🖋️ 전체
              </Link>
              {[
                { label: '지속가능', icon: '🔄' },
                { label: '도시동물', icon: '🏙️' },
                { label: '세계동물권', icon: '🌎' },
                { label: '전시동물', icon: '🎪' },
                { label: '야생동물', icon: '🌲' },
                { label: '동물지각', icon: '🧠' },
                { label: '동물보호법', icon: '📜' },
                { label: '동물실험', icon: '🐁' },
                { label: '공장식 축산', icon: '🏭' },
                { label: '길고양이', icon: '🐱' },
                { label: '동물원', icon: '🦒' },
                { label: '멸종위기', icon: '🌏' }
              ].map(tagObj => (
                <Link 
                  key={tagObj.label} 
                  href={`/?category=Discovery&tab=class&tag=${tagObj.label}`} 
                  className={`classroom-tag-pill ${params?.tag === tagObj.label ? 'active' : ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>{tagObj.icon}</span>
                  <span>{tagObj.label}</span>
                </Link>
              ))}
            </div>

            <section className="discovery-section">
              <div className="classroom-grid">
                {(classPosts || [])
                  .filter(post => post && (!params?.tag || post.tag?.includes(params?.tag)))
                  .map(post => <ClassCard key={post?.id || Math.random()} post={post} />)}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}



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
    let filteredPosts = allPostsData;
    let bannerTitle = "";
    let bannerDesc = "";

    if (categoryParam === 'Cat Care') {
      bannerTitle = "케어";
      bannerDesc = "우리 아이들의 건강과 행복을 위한 필수 돌봄 가이드";
      filteredPosts = allPostsData.filter(post => ['Health', 'Grooming', 'Environment', 'Safety', 'Behavior', 'Play', 'Lifestyle'].includes(post.category));
    } else if (categoryParam === 'Rescue') {
      bannerTitle = "구조";
      bannerDesc = "위기에 처한 길 위의 생명들을 돕는 구조 및 공존 가이드";
      filteredPosts = allPostsData.filter(post => ['Street Life', 'Rights'].includes(post.category));
    } else if (categoryParam === 'Discovery') {
      const newsPosts = allPostsData.filter(post => post.category === 'News').sort((a, b) => new Date(b.date) - new Date(a.date));
      const classPosts = allPostsData.filter(post => post.category === 'Class');
      const currentTab = params?.tab || 'news';

      return (
        <div className="discovery-page-wrapper">
          <DiscoveryView newsPosts={newsPosts} classPosts={classPosts} currentTab={currentTab} params={params} />
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
  const showNewsToday = (dayCount % 2 === 0);

  // 2. Data Fetching
  const newsPosts = allPostsData
    .filter(post => post.category === 'News')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const allCareAndRescue = allPostsData.filter(post => {
    const cat = post.category?.replace(/['"]/g, '').trim() || '';
    return ['Health', 'Grooming', 'Environment', 'Safety', 'Behavior', 'Play', 'Lifestyle', 'Street Life', 'Rights', '🚨 구조'].includes(cat);
  }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const classroomPosts = allPostsData.filter(post => post.category === 'Class');
  const allFamilyMembers = getFamilyData();
  const familyPool = allFamilyMembers.filter(m => m.hasImage && m.images?.[0]);

  // 3. Daily Selection Logic for All Sections
  // We use dayCount as a seed to rotate items daily.
  const dailyCare = getDailySelection(allCareAndRescue, 1, dayCount)[0];
  const dailyNews = getDailySelection(newsPosts, 1, dayCount + 10)[0];
  const dailyClass = getDailySelection(classroomPosts, 1, dayCount + 20)[0];
  const dailyFamily = getDailySelection(familyPool, 1, dayCount + 30)[0];

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
      image: dailyFamily?.images?.[0] || '/hero/jordan-whitt-EerxztHCjM8-unsplash.jpg',
      link: dailyFamily ? `/family/${dailyFamily.slug}` : '/family',
      subtitle: '서로 다른 우리가 만나 가족이 되었습니다'
    },
    {
      label: '묘한 탐구 🔍',
      title: '세상을 배우고 소식을 나눠요',
      description: '동물권 뉴스부터 생명 존중 배움까지, 묘한 탐구에서 함께 시작해보세요.',
      image: dailyNews?.image || dailyClass?.image || '/hero/daria-shatova-BphuDA60if4-unsplash.jpg',
      link: '/?category=Discovery',
      subtitle: '아는 만큼 더 사랑할 수 있어요'
    }
  ];

  // 5. Section Previews Selection (Daily Rotation)
  const dailyCarePreview = getDailySelection(allCareAndRescue, 2, dayCount + 5);
  
  // News Preview: prioritize one culture news, then rotate others
  const homePriorityTags = ['📚 책', '🎬 문화/영화', '🎬 문화'];
  const homeCultureNews = newsPosts.filter(p => homePriorityTags.some(pt => p.tag?.includes(pt.replace(/^[^\s]+\s*/, '')) || p.tag === pt));
  const homeOtherNews = newsPosts.filter(p => !homePriorityTags.some(pt => p.tag?.includes(pt.replace(/^[^\s]+\s*/, '')) || p.tag === pt));
  
  let dailyNewsPreview;
  if (homeCultureNews.length > 0) {
    const dailyCulture = homeCultureNews[dayCount % homeCultureNews.length];
    const otherDaily = getDailySelection(homeOtherNews, 2, dayCount + 15);
    dailyNewsPreview = [dailyCulture, ...otherDaily];
  } else {
    dailyNewsPreview = getDailySelection(newsPosts, 3, dayCount + 15);
  }

  const dailyFamilyPreview = getDailySelection(familyPool, 4, dayCount + 25);
  const dailyFriendsPreview = getDailySelection(friendsList, 3, dayCount + 35);

  return (
    <div style={{ width: '100%' }}>
      {/* SECTION 1: HERO SLIDER (DAILY) */}
      <HeroSlider slides={slides} />

      {/* SECTION 2: SLOGAN + INTRO */}
      <section className="home-section bg-cream">
        <div className="section-container" style={{ textAlign: 'center' }}>
          <span className="section-subtitle-en">Vision & Slogan</span>
          <h2 className="section-title slogan-title">모든 생명이 존중받는 세상을 위해</h2>
          <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
            고양이부터 고래까지, 알고 돌보고 함께합니다.
          </p>
          <div className="btn-group">
            <Link href="/care" className="btn-primary">돌봄 가이드 보기 &gt;</Link>
            <Link href="/?category=Discovery" className="btn-primary btn-outline">묘한 탐구 가기 &gt;</Link>
          </div>
        </div>
      </section>

      {/* SECTION: MYO ASSISTANT (SECRETARY) TEASER */}
      <section className="home-section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle-en">Smart AI Assistant</span>
            <h2 className="section-title">묘한 비서</h2>
            <p className="section-subtitle">똑똑한 AI 기술로 반려묘의 건강과 안전을 세심히 보살핍니다.</p>
          </div>
          
          <div className="section-footer">
            <Link href="/assistant" className="btn-primary">묘한 비서 이용하기 &gt;</Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: CARE PREVIEW (DAILY) */}
      <section className="home-section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle-en">Care & Rescue</span>
            <h2 className="section-title">돌봄</h2>
            <p className="section-subtitle">케어부터 구조까지, 모든 생명을 돌봅니다.</p>
          </div>
          <div className="section-grid cols-2">
            {dailyCarePreview?.filter(Boolean).map(post => (
              <PostCard key={post.id} post={post} objectPosition="center 20%" />
            ))}
          </div>
          <div className="section-footer">
            <Link href="/care" className="btn-primary">돌봄 더보기 &gt;</Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: FAMILY TEASER (MINIMALIST) */}
      <section className="home-section bg-cream" style={{ padding: '3rem 0' }}>
        <div className="section-container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <span className="section-subtitle-en">Family & Discovery</span>
            <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>묘한 가족들</h2>
            <p className="section-subtitle" style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}>
              우리 집 반려동물 자랑부터 집사들의 발견까지,<br />
              함께 만들어가는 소중한 공간입니다.
            </p>
          </div>
          
          <div className="btn-group" style={{ flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Link href="/family?tab=family" className="btn-primary" style={{ width: '100%', maxWidth: '280px' }}>
              우리 가족 보기 →
            </Link>
            <Link 
              href="/family?tab=discovery" 
              className="btn-primary btn-outline"
              style={{ width: '100%', maxWidth: '280px' }}
            >
              집사의 발견 →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: DISCOVERY PREVIEW (DAILY ALTERNATING) */}
      <section className="home-section" style={{ backgroundColor: '#e8f4ee' }}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle-en">News & Education</span>
            <h2 className="section-title">묘한 탐구</h2>
            <p className="section-subtitle">동물권 소식과 생명 존중 교육을 한곳에서 만나보세요</p>
          </div>
          
          {showNewsToday ? (
            /* News Preview */
            <div style={{ marginBottom: '2rem' }}>
              <div className="section-grid cols-3">
                {dailyNewsPreview?.filter(Boolean).map(post => (
                  <article key={post?.id || Math.random()} className="news-magazine-card simple-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="news-magazine-image" style={{ height: '160px' }}>
                      {post?.image ? (
                        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="news-magazine-placeholder">🐾</div>
                      )}
                    </div>
                    <div className="news-magazine-content" style={{ flex: 1, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 className="news-magazine-title" style={{ fontSize: '1rem', lineHeight: '1.4', margin: '0 0 0.5rem 0' }}>{post?.title}</h3>
                        <div style={{ fontSize: '0.85rem', color: '#888' }}>
                          {post?.source && <span>{post.source}</span>}
                          {post?.source && post?.date && <span style={{ margin: '0 6px' }}>|</span>}
                          {post?.date && <span>{post.date}</span>}
                        </div>
                      </div>
                      {post?.id && (
                        <Link href={`/posts/${post.id}`} className="news-read-btn-circle" style={{ width: '56px', height: '56px', fontSize: '13px' }}>
                          기사<br />읽기
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            /* Class Preview */
            <div style={{ marginBottom: '2rem' }}>
              <div className="classroom-banner" style={{ margin: 0, padding: '2rem' }}>
                <div className="classroom-banner-content">
                  <h2 className="section-title" style={{ color: 'white', marginTop: '0', fontSize: '1.8rem' }}>{dailyClass?.title || "동물권, 함께 배워요"}</h2>
                  <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
                    {dailyClass?.summary || dailyClass?.coreQuestion || "어린이부터 어른까지 함께 배우는 동물권 카드 및 교육 자료"}
                  </p>
                  <Link href={dailyClass ? `/posts/${dailyClass.id}` : "/?category=Discovery&tab=class"} className="btn-primary btn-outline">
                    수업 참여하기 &gt;
                  </Link>
                </div>
                <div className="classroom-banner-image" style={{ height: '200px' }}>
                  <img src={dailyClass?.image || "/hero/ricky-kharawala-adK3Vu70DEQ-unsplash.jpg"} alt="Animal Education" />
                </div>
              </div>
            </div>
          )}

          <div className="section-footer" style={{ marginTop: '4rem' }}>
            <Link href="/?category=Discovery" className="btn-primary">묘한 탐구 보기 &gt;</Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: FRIENDS PREVIEW (DAILY) */}
      <section className="home-section" style={{ backgroundColor: '#ffffff' }}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-subtitle-en">Partners & Friends</span>
            <h2 className="section-title">좋은 친구들</h2>
            <p className="section-subtitle">우리가 알아야 할, 생명을 살리는 멋진 단체와 매체들</p>
          </div>
          <div className="section-grid">
            {dailyFriendsPreview.map((friend, index) => (
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

