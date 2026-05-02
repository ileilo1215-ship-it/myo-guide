"use client";

import { Jua } from "next/font/google";
import Image from "next/image";

const jua = Jua({ subsets: ["latin"], weight: ["400"] });

export default function SubscribePage() {
  return (
    <div style={{
      maxWidth: '650px', 
      margin: '4rem auto', 
      padding: '3rem 2rem', 
      textAlign: 'center', 
      backgroundColor: '#FFFDF9', 
      borderRadius: '30px', 
      boxShadow: '0 20px 40px rgba(192, 141, 93, 0.1)',
      border: '2px solid #FDF3E7',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 장식용 원형 배경 */}
      <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', backgroundColor: '#FFF0D4', borderRadius: '50%', zIndex: 0, opacity: 0.6 }}></div>
      <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '200px', height: '200px', backgroundColor: '#FFE4E1', borderRadius: '50%', zIndex: 0, opacity: 0.5 }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <Image 
            src="/cute-cat-mail.png" 
            alt="고양이 메일함" 
            width={240} 
            height={240} 
            style={{ borderRadius: '50%', objectFit: 'cover', border: '8px solid #FFF', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
          />
        </div>

        <h1 className={jua.className} style={{ fontSize: '2.8rem', color: '#8A6D53', marginBottom: '1rem', textShadow: '2px 2px 0px #FFF0D4' }}>
          묘한 레터 구독하기 💌
        </h1>
        <p style={{ color: '#A69B91', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.7', fontWeight: '500' }}>
          매주 수요일 아침, 고양이 집사들을 위한 알찬 건강 상식과 <br/>
          귀여운 꿀팁들을 이메일로 가장 먼저 받아보세요!
        </p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '400px', margin: '0 auto' }}>
          <input 
            type="email" 
            placeholder="집사님의 이메일 주소를 입력해주세요" 
            style={{ 
              padding: '1.2rem 1.5rem', 
              borderRadius: '20px', 
              border: '2px solid #FDF3E7', 
              fontSize: '1rem', 
              outline: 'none',
              backgroundColor: '#FFF',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#FFDAB9'}
            onBlur={(e) => e.target.style.borderColor = '#FDF3E7'}
          />
          <button 
            type="button"
            style={{ 
              padding: '1.2rem', 
              borderRadius: '20px', 
              border: 'none', 
              backgroundColor: '#FFA07A', 
              color: '#FFF', 
              fontSize: '1.2rem', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              boxShadow: '0 8px 15px rgba(255, 160, 122, 0.3)',
              transition: 'transform 0.2s ease, background 0.2s ease'
            }}
            onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.backgroundColor = '#FF8C69'; }}
            onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.backgroundColor = '#FFA07A'; }}
          >
            구독 신청하기 🐾
          </button>
        </form>
      </div>
    </div>
  );
}
