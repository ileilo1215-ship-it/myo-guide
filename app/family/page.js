import { getFamilyData } from '@/lib/family';
import Banner from '@/components/Banner';
import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import './family.css';
import { GOOGLE_FORM_URL, DISCOVERY_FORM_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function FamilyPage({ searchParams }) {
  const params = await searchParams;
  const activeTab = params.tab || 'family';
  const filter = params.type || '전체';
  
  const allMembers = getFamilyData();
  const types = ['전체', '고양이', '강아지', '새', '파충류', '기타'];
  
  const filteredMembers = filter === '전체' 
    ? allMembers 
    : allMembers.filter(m => m.type && m.type.includes(filter));

  return (
    <main className="family-page">
      <Banner 
        title="묘한 가족들" 
        description="반려가족의 일상 공유와 집사들의 새로운 발견이 있는 커뮤니티" 
      />

      <div className="tab-container">
        <Link 
          href="/family?tab=family" 
          className={`tab-item ${activeTab === 'family' ? 'active' : ''}`}
          scroll={false}
        >
          🐾 우리 가족
        </Link>
        <Link 
          href="/family?tab=discovery" 
          className={`tab-item ${activeTab === 'discovery' ? 'active' : ''}`}
          scroll={false}
        >
          💡 집사의 발견
        </Link>
      </div>

      {activeTab === 'family' ? (
        <>
          <div className="filter-area-minimal">
            <div className="filter-list">
              {types.map((type) => (
                <Link 
                  key={type}
                  href={`/family?tab=family${type === '전체' ? '' : `&type=${type}`}`}
                  className={`filter-item-text ${filter === type ? 'active' : ''}`}
                  scroll={false}
                >
                  {type}
                </Link>
              ))}
            </div>
            <a 
              href={GOOGLE_FORM_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="family-submit-link"
            >
              우리 가족 소개하기
            </a>
          </div>

          <section className="family-grid">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                const imagePath = member.images?.[0];
                const fullImagePath = imagePath ? path.join(process.cwd(), 'public', imagePath) : null;
                const imageExists = fullImagePath && fs.existsSync(fullImagePath);

                return (
                  <Link href={`/family/${member.slug}`} key={member.slug} className="family-card-clean">
                    <div className="family-card-media">
                      {imageExists ? (
                        <Image 
                          src={imagePath} 
                          alt={member.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="media-placeholder">
                          🐾
                        </div>
                      )}
                    </div>
                    <div className="family-card-body">
                      <div className="family-card-header">
                        <span className="family-type-badge">{member.type}</span>
                        <h3 className="family-title">{member.name}</h3>
                      </div>
                      <div className="family-info-separator"></div>
                      <p className="family-meta-detail">{member.age}</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="no-results">
                <p>아직 등록된 {filter} 가족이 없어요! 🐾</p>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="discovery-section">
          <div className="discovery-header">
            <h2 className="discovery-title">집사의 발견</h2>
            <p className="discovery-lead">
              집사라면 한 번쯤 발견했을 것들. <br />
              창의적인 놀이 아이디어, 뜻밖의 꿀팁, 모두 나눠요.
            </p>
          </div>
          
          <div className="discovery-content-fluid">
            <div className="discovery-empty-minimal">
              <div className="discovery-empty-icon">✨</div>
              <h3>아직 첫 번째 발견을 기다리고 있어요</h3>
              <p>여러분의 소중한 발견이 이 공간을 채워줄 거예요.</p>
              <a 
                href={DISCOVERY_FORM_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="discovery-share-link"
              >
                발견 공유하기
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
