import { Jua } from "next/font/google";

const jua = Jua({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: 'Subscribe | 묘한 가이드',
};

export default function SubscribePage() {
  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#FFFDF9', borderRadius: '20px', border: '1px dashed #E2D9CC' }}>
      <h1 className={jua.className} style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
        묘한 레터 구독하기 💌
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
        매주 수요일 아침, 고양이 집사들을 위한 알찬 건강 상식과 <br/>
        귀여운 꿀팁들을 이메일로 가장 먼저 받아보세요!
      </p>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="email" 
          placeholder="집사님의 이메일 주소를 입력해주세요" 
          style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #E2D9CC', fontSize: '1rem', outline: 'none' }}
        />
        <button 
          type="button"
          style={{ padding: '1rem', borderRadius: '10px', border: 'none', backgroundColor: '#C08D5D', color: '#FFF', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          구독 신청하기 🐾
        </button>
      </form>
    </div>
  );
}
