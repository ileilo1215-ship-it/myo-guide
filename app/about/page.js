import Image from 'next/image';
import { Jua } from "next/font/google";

const jua = Jua({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: 'About | 묘한 가이드',
  description: '묘한 가이드 소개 페이지',
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 className={jua.className} style={{ fontSize: '3rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>
        안녕하세요! 묘한 가이드입니다 🐾
      </h1>
      
      <div style={{ borderRadius: '20px', overflow: 'hidden', margin: '0 auto 3rem', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <img 
          src="https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&w=800&q=80" 
          alt="Cute cat looking out"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      <div style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          세상의 모든 고양이와 집사들을 위한 따뜻한 공간, <strong>묘한 가이드</strong>에 오신 것을 환영합니다!
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          처음 고양이를 키우는 초보 집사부터, 이미 여러 마리의 고양이를 모시고 있는 베테랑 집사까지.<br/>
          누구나 공감하고 배울 수 있는 유익한 고양이 상식과 꿀팁들을 매일매일 전해드립니다.
        </p>
        <p style={{ marginBottom: '1.5rem', fontWeight: '500', color: 'var(--accent-color)' }}>
          "우리의 작고 소중한 털뭉치들이 더 행복해지는 그날까지!"
        </p>
        <p>
          묘한 가이드와 함께 즐겁고 슬기로운 반려생활을 시작해 보세요. 🐱❤️
        </p>
      </div>
    </div>
  );
}
