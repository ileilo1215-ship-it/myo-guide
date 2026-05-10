import { getFamilyData } from '@/lib/family';
import Banner from '@/components/Banner';
import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import './family.css';
import { GOOGLE_FORM_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function FamilyPage({ searchParams }) {
  const params = await searchParams;
  const filter = params.type || '전체';
  
  const allMembers = getFamilyData();
  const types = ['전체', '고양이', '강아지', '새', '파충류', '기타'];
  
  const filteredMembers = filter === '전체' 
    ? allMembers 
    : allMembers.filter(m => m.type === filter);

  return (
    <main className="family-page">
      <Banner 
        title="묘한 가족들" 
        description="고양이부터 도마뱀까지, 우리와 함께 사는 모든 가족들을 소개합니다." 
      />

      <div className="filter-wrapper">
        <div className="filter-buttons">
          {types.map((type) => (
            <Link 
              key={type}
              href={`/family${type === '전체' ? '' : `?type=${type}`}`}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              scroll={false}
            >
              {type}
            </Link>
          ))}
          <a 
            href={GOOGLE_FORM_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="filter-btn submit-family-btn"
          >
            우리 가족 소개하기 🐾
          </a>
        </div>
      </div>

      <section className="family-grid">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => {
            const imagePath = member.images?.[0];
            const fullImagePath = imagePath ? path.join(process.cwd(), 'public', imagePath) : null;
            const imageExists = fullImagePath && fs.existsSync(fullImagePath);

            return (
              <Link href={`/family/${member.slug}`} key={member.slug} className="family-card">
                <div className="family-card-image">
                  {imageExists ? (
                    <Image 
                      src={imagePath} 
                      alt={member.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="placeholder-image">
                      <div className="green-paw">
                        <span className="coming-soon-text">준비중</span>
                        <span className="paw-icon">🐾</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="family-card-info">
                  <span className="family-type">{member.type}</span>
                  <h3 className="family-name">{member.name}</h3>
                  <p className="family-age">{member.age}</p>
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
    </main>
  );
}
