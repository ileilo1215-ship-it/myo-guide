import Image from 'next/image';

export const metadata = {
  title: 'About | 묘한 가이드',
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 clamp(16px, 4vw, 2rem)' }}>
      <h1 style={{ fontSize: 'clamp(20px, 5vw, 2.5rem)', marginBottom: '2rem', color: 'var(--text-primary)', textAlign: 'center' }}>
        우리가 사랑하는 생명들, 그리고 공존
      </h1>
      
      <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '3rem', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(76, 175, 80, 0.15)' }}>
        <Image 
          src="/my-cats-livingroom.png" 
          alt="따뜻한 거실의 두 마리 고양이" 
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          안녕하세요! 고양이 🐱와 열대어 🐠, 식물 🌿을 키우는 집사입니다.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          처음엔 그저 우리 아이들의 건강과 행복을 위해 공부하기 시작했습니다. 하지만 아이들을 돌보며 쌓이는 애정은 자연스럽게 길 위의 수많은 생명들에게로 뻗어나갔습니다. 따뜻한 방 안이 아닌, 차갑고 위험한 거리에서 살아가는 동물들의 현실을 마주하게 되었죠.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          <strong>'묘한 가이드'</strong>는 단순한 반려묘 돌봄 팁을 넘어, 모든 생명이 존중받는 세상을 꿈꾸는 공간입니다. 동물 구조 및 대처 방법, 보이지 않는 곳에서 생명을 살리는 단체들의 이야기, 그리고 해외의 모범적인 동물법과 최신 이슈들까지 다루고자 합니다. 제가 배워가는 공간이자 나누는 공간으로 함께하고 싶어요. 
        </p>
        <p>
          고양이, 개, 비둘기, 너구리, 고래까지... 세상 모든 동물들이 우리와 평화롭게 공존하는 그날까지.. 함께 응원해 주세요! 🌿
        </p>
      </div>
    </div>
  );
}
