"use client";

import Link from 'next/link';
import { CATEGORY_MAP } from '@/lib/constants';

const catImages = [
  "adinavoicu-cat-3336579_1920.jpg", "alex-d-J93PXpBPCFI-unsplash.jpg", "alexas_fotos-cat-1046544_1920.jpg",
  "alicja-gancarz-HoC9ttceIGo-unsplash.jpg", "alvan-nee-jkHzJ68C7a0-unsplash.jpg", "anton-ponomarenko-j7uVTlpwI0o-unsplash.jpg",
  "ayla-meinberg-AL2-t0GrSko-unsplash.jpg", "ayla-meinberg-b079C-_tUbM-unsplash.jpg", "ben_kerckx-cat-300572_1920.jpg",
  "cocoparisienne-cat-1045782_1920.jpg", "congerdesign-kittens-3535404_1920.jpg", "cyrus-chew-Dl39g6QhOIM-unsplash.jpg",
  "daria-shatova-BphuDA60if4-unsplash.jpg", "darren-richardson-KCdivsKLuWQ-unsplash.jpg", "dexmac-cat-4218424_1920.jpg",
  "eric-han-Hd7vwFzZpH0-unsplash.jpg", "erik-jan-leusink-gr1UYHBFkD4-unsplash.jpg", "fernando-lavin-VLnUsIE2w3U-unsplash.jpg",
  "geronimo-giqueaux-pr1M1Y7zdik-unsplash.jpg", "jacalyn-beales-CKsDMYPDgCs-unsplash.jpg", "jaclou-dl-cat-5098930_1920.jpg",
  "joe-cleary-CfANlkglvUc-unsplash.jpg", "joyful-kvUTrJdsYg8-unsplash.jpg", "kabo-bg9jOHUtmBs-unsplash.jpg",
  "katya-guseva0-cat-2605502_1920.jpg", "kevin-knezic-doyAAwH2AyQ-unsplash.jpg", "leonsa-fVNyjet1CXY-unsplash.jpg",
  "louis-philippe-poitras-sJgucUmcaKE-unsplash.jpg", "manki-kim-2Nca6Aum17o-unsplash.jpg", "marko-blazevic-zBvVuRJ71vU-unsplash.jpg",
  "marnhe-du-plooy-U6u_A5z6mME-unsplash.jpg", "matheus-queiroz-UhxJSJmT1R4-unsplash.jpg", "mccarthy-beckan-X04knqn7Mmc-unsplash.jpg",
  "miezekieze-cat-9183327_1920.jpg", "mikkekylilt-cat-4260536_1920.jpg", "milada-vigerova-aR-eWYIEaOQ-unsplash.jpg",
  "mirokola-cat-3504008_1920.jpg", "nennieinszweidrei-cat-5628953_1920.jpg", "nihal-karkala--vcg9-w_yMk-unsplash.jpg",
  "niklas-ohlrogge-niamoh-de-u6pKOHf6rgU-unsplash.jpg", "nine-koepfer-lpgAlv8I7V8-unsplash.jpg", "oleksandr-dorokhov-9EEmky5Qwko-unsplash.jpg",
  "patrick-mueller-MBgN-CmZEk0-unsplash.jpg", "philippine-fitamant-KX33JWMtcDI-unsplash.jpg", "raquel-pedrotti-AHgpNYkX9dc-unsplash.jpg",
  "raul-varzar-1l2waV8glIQ-unsplash.jpg", "ray-zhuang-Px2Y-sio6-c-unsplash.jpg", "roberto-huczek-oA6zqMdnhjE-unsplash.jpg",
  "sam-grozyan-hQPoYovqWR0-unsplash.jpg", "sambhavsaxena02-cat-6309964_1920.jpg", "tea-bell-pn3o0ZTWAT8-unsplash.jpg",
  "tikovka1355-cat-5727135_1920.jpg", "timo-volz-ZlFKIG6dApg-unsplash.jpg", "tran-mau-tri-tam-FbhNdD1ow2g-unsplash.jpg",
  "tran-mau-tri-tam-wiqbi_Uyvx8-unsplash.jpg", "trungm499-cat-6578336_1920.jpg", "tuna-IXnZZLi6xkA-unsplash.jpg",
  "victor-serban-L1MD3L6Q-eM-unsplash.jpg", "victoria-naumenko-ymy29Y4J5Qs-unsplash.jpg", "webandi-cat-2068462_1920.jpg",
  "yang-G4A14c4leT4-unsplash.jpg", "zhang-kaiyv-b1-JDjIq_00-unsplash.jpg"
];

const categoryImages = {
  Health: "/cat/adinavoicu-cat-3336579_1920.jpg",
  Grooming: "/cat/alexas_fotos-cat-1046544_1920.jpg",
  Environment: "/cat/congerdesign-kittens-3535404_1920.jpg",
  Safety: "/cat/daria-shatova-BphuDA60if4-unsplash.jpg",
  Behavior: "/cat/erik-jan-leusink-gr1UYHBFkD4-unsplash.jpg",
  Play: "/cat/joyful-kvUTrJdsYg8-unsplash.jpg",
  News: "/cat/katya-guseva0-cat-2605502_1920.jpg",
  Class: "/cat/milada-vigerova-aR-eWYIEaOQ-unsplash.jpg",
  'Street Life': "/cat/lily-banse-bZT3YDRjacc-unsplash.jpg",
  Rights: "/cat/raquel-pedrotti-AHgpNYkX9dc-unsplash.jpg",
};

const getDeterministicImage = (id) => {
  if (!id || typeof id !== 'string') return '/placeholder.png';
  // Simple hash function for the id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % catImages.length;
  return `/cat/${catImages[index]}`;
};

const getFallbackImage = (category, id) => {
  if (['News', 'Class'].includes(category)) {
    return categoryImages[category] || '/placeholder.png';
  }
  return getDeterministicImage(id);
};

export default function PostCard({ post, objectPosition = 'center 20%' }) {
  if (!post) return null;
  
  const excerpt = post.content ? post.content.substring(0, 100) + '...' : '';
  const rawCategory = post.category?.replace(/['"]/g, '').trim() || '';
  const fallbackImageUrl = getFallbackImage(rawCategory, post.id);
  const imageUrl = post.image || fallbackImageUrl;
  
  const isRescue = ['Street Life', 'Rights', '🚨 구조'].includes(rawCategory);
  const isCare = ['Health', 'Grooming', 'Environment', 'Safety', 'Behavior', 'Play', 'Lifestyle'].includes(rawCategory);

  const isClass = rawCategory === 'Class';
  const isNews = rawCategory === 'News';

  const safeCategoryMap = CATEGORY_MAP || {};
  const translatedCategory = safeCategoryMap[rawCategory] || rawCategory;
  const hideCategoryLabel = isClass || isNews;
  const hideReadMore = isCare || isRescue || isClass || isNews;

  return (
    <Link href={`/posts/${post.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <article className="post-card" style={isRescue ? { borderLeft: '4px solid #2D6A4F', height: '100%' } : { height: '100%' }}>
        <div className="card-image-wrapper">
          <img 
            src={imageUrl} 
            alt="Post thumbnail" 
            className="card-image"
            style={{ 
              objectPosition: objectPosition,
              '--image-scale': post.id === 'rescue-tnr-guide' ? '1.25' : '1'
            }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = fallbackImageUrl;
              e.currentTarget.onerror = null; 
            }}
          />
          
          {/* Category Badges */}
          {isCare && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'white',
              color: '#2D6A4F',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '700',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              border: '1px solid #2D6A4F',
              zIndex: 2
            }}>
              🌿 케어
            </div>
          )}
          {isRescue && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: '#1a4731',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '700',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              zIndex: 2
            }}>
              🚨 구조
            </div>
          )}
        </div>
        <div className="card-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {rawCategory && !hideCategoryLabel && <span className="category">{translatedCategory}</span>}
              {post.readTime && <span style={{ fontSize: '0.75rem', color: '#999' }}>⏱️ {post.readTime}</span>}
            </div>
            {isNews && post.date && <time className="date" style={{ fontSize: '0.8rem', color: '#888' }}>{post.date}</time>}
          </div>
          <h2 className="post-title">{post.title}</h2>
          <p className="excerpt">{post.summary || excerpt}</p>
          {((!isCare && !isRescue && !isClass && !isNews && post.date) || !hideReadMore) && (
            <div className="card-footer" style={{ display: 'flex', justifyContent: isNews ? 'flex-end' : 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                {!isCare && !isRescue && !isClass && !isNews && post.date && <time className="date" style={{ fontSize: '0.8rem', color: '#888' }}>{post.date}</time>}
              </div>
              {!hideReadMore && <span className="read-more">자세히 보기</span>}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
