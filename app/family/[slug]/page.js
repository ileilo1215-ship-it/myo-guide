import { getFamilyMember } from '@/lib/family';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import './details.css';

export default async function FamilyDetailsPage({ params }) {
  const { slug } = await params;
  const member = await getFamilyMember(slug);

  if (!member) {
    notFound();
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.min(5, Math.max(1, rating)));
  };

  return (
    <main className="details-page">
      <div className="details-container">
        <Link href="/family" className="back-link">
          ← 가족 목록으로 돌아가기
        </Link>

        <div className="profile-header">
          <div className="main-photo">
            {(() => {
              const imagePath = member.images?.[0];
              const fullImagePath = imagePath ? path.join(process.cwd(), 'public', imagePath) : null;
              const imageExists = fullImagePath && fs.existsSync(fullImagePath);

              if (imageExists) {
                return (
                  <Image 
                    src={imagePath} 
                    alt={member.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                );
              } else {
                return (
                  <div className="placeholder-image">
                    <div className="green-paw">
                      <span className="coming-soon-text">준비중</span>
                      <span className="paw-icon">🐾</span>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
          <div className="header-info">
            <span className="badge">{member.type}</span>
            <h1 className="name">{member.name}</h1>
            <p className="intro-text">"{member.contentHtml.replace(/<[^>]*>?/gm, '').substring(0, 100)}..."</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="info-card">
            <div className="info-item">
              <span className="label">🐾 이름</span>
              <span className="value">{member.name}</span>
            </div>
            <div className="info-item">
              <span className="label">🐾 종류</span>
              <span className="value">{member.type}</span>
            </div>
            <div className="info-item">
              <span className="label">📅 나이</span>
              <span className="value">{member.age}</span>
            </div>
          </div>

          <div className="info-card highlights">
            <div className="info-item">
              <span className="label">🤝 만난 계기</span>
              <span className="value">{member.met_reason}</span>
            </div>
            <div className="info-item">
              <span className="label">✨ 특기/특징</span>
              <span className="value">{member.special_talent}</span>
            </div>
          </div>

          <div className="info-card likes-dislikes">
            <div className="info-item">
              <span className="label">😍 좋아하는 것</span>
              <span className="value">{member.likes}</span>
            </div>
            <div className="info-item">
              <span className="label">😤 싫어하는 것</span>
              <span className="value">{member.dislikes}</span>
            </div>
          </div>

          <div className="info-card personality">
            <div className="info-item">
              <span className="label">🧠 MBTI</span>
              <span className="value mbti-tag">{member.mbti}</span>
            </div>
            <div className="info-item">
              <span className="label">⭐ 집사 평점</span>
              <span className="value stars">{renderStars(member.rating)}</span>
            </div>
          </div>

          <div className="info-card full-width wish-box">
            <div className="info-item">
              <span className="label">💭 집사의 바람</span>
              <p className="wish-text">{member.wish}</p>
            </div>
          </div>
        </div>

        {member.images && member.images.length > 1 && (
          <div className="gallery-section">
            <h2 className="section-title">📸 사진 갤러리</h2>
            <div className="image-grid">
              {member.images.map((img, idx) => {
                const fullPath = path.join(process.cwd(), 'public', img);
                if (!fs.existsSync(fullPath)) return null;
                
                return (
                  <div key={idx} className="gallery-image">
                    <Image 
                      src={img} 
                      alt={`${member.name} ${idx + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="long-description" dangerouslySetInnerHTML={{ __html: member.contentHtml }} />
      </div>
    </main>
  );
}
