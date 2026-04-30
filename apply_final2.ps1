$ErrorActionPreference = 'Stop'

# 1. Create task.md
$taskMd = @"
# 블로그 테마 및 신규 페이지 추가 작업 목록

- [x] 영문 폰트 변경 (Sniglet 적용)
- [x] Subscribe 페이지 추가
- [x] 콘텐츠 10개 대량 추가 (건강, 미용, 필수품 등)
- [x] 메모지 스타일의 익명 댓글창 구현 (MemoComments)
"@
Set-Content -LiteralPath "C:\Users\user\.gemini\antigravity\brain\79ac08c0-ce70-4e8e-a53d-efab238e1487\task.md" -Value $taskMd -Encoding UTF8

# 2. Update app/layout.js for Sniglet font and Subscribe link
$layoutJs = @"
import { Sniglet } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sniglet = Sniglet({ subsets: ["latin"], weight: ["400", "800"] });

export const metadata = {
  title: "묘한 가이드",
  description: "반려동물과 함께하는 특별하고 묘한 일상 가이드",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <nav className="main-nav">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className={`logo ${sniglet.className}`} style={{ fontSize: '2.2rem', letterSpacing: '1px' }}>myo guide</div>
            </Link>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/subscribe">Subscribe</Link></li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
"@
Set-Content -LiteralPath "app/layout.js" -Value $layoutJs -Encoding UTF8

# 3. Create app/subscribe/page.js
$subscribeJs = @"
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
"@
New-Item -ItemType Directory -Force -Path "app/subscribe" | Out-Null
Set-Content -LiteralPath "app/subscribe/page.js" -Value $subscribeJs -Encoding UTF8

# 4. Create MemoComments.js
$memoJs = @"
'use client';

import { useState, useEffect } from 'react';

export default function MemoComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newNickname, setNewNickname] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('memos_' + postId);
    if (saved) {
      setComments(JSON.parse(saved));
    }
  }, [postId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newComment = {
      id: Date.now(),
      nickname: newNickname.trim() || '익명의 집사',
      content: newContent,
      date: new Date().toLocaleDateString('ko-KR')
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('memos_' + postId, JSON.stringify(updatedComments));
    
    setNewContent('');
  };

  return (
    <div style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '2px dashed #E2D9CC' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#5A514A', textAlign: 'center', fontWeight: 'bold' }}>
        📝 집사들의 꿀팁 메모장
      </h3>
      
      {/* 메모지 목록 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', justifyContent: 'center' }}>
        {comments.length === 0 ? (
          <p style={{ color: '#8C8279' }}>아직 메모가 없습니다. 첫 번째 꿀팁을 남겨주세요!</p>
        ) : (
          comments.map(c => (
            <div key={c.id} style={{
              backgroundColor: '#FFFBE6',
              padding: '1.5rem',
              borderRadius: '2px 15px 15px 15px',
              boxShadow: '3px 4px 10px rgba(0,0,0,0.08)',
              width: '280px',
              position: 'relative',
              border: '1px solid #F6E9B2'
            }}>
              <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '15px', backgroundColor: '#FFCF96', opacity: '0.6', borderRadius: '10px' }}></div>
              <p style={{ fontSize: '1.05rem', color: '#333', marginBottom: '1rem', lineHeight: '1.5', wordBreak: 'break-word' }}>{c.content}</p>
              <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold', color: '#C08D5D' }}>{c.nickname}</span>
                <span>{c.date}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#FFF', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h4 style={{ marginBottom: '1rem', color: '#5A514A' }}>나만의 정보 추가하기 💡</h4>
        <input 
          type="text" 
          placeholder="닉네임 (선택)" 
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #E2D9CC', outline: 'none' }}
        />
        <textarea 
          placeholder="이 글과 관련된 생생한 정보나 팁을 메모지에 적어주세요!" 
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows="3"
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #E2D9CC', outline: 'none', resize: 'vertical' }}
        />
        <button 
          type="submit"
          style={{ width: '100%', padding: '1rem', backgroundColor: '#C08D5D', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          메모 붙이기 📌
        </button>
      </form>
    </div>
  );
}
"@
Set-Content -LiteralPath "components/MemoComments.js" -Value $memoJs -Encoding UTF8

# 5. Update app/posts/[id]/page.js
$postPageJs = @"
import { getPostData, getAllPostIds } from '@/lib/posts';
import ReactionButtons from '@/components/ReactionButtons';
import MemoComments from '@/components/MemoComments';
import styles from './page.module.css';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.id,
  }));
}

export default async function Post({ params }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const postData = await getPostData(decodedId);

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        {postData.category && <span className={styles.category}>{postData.category}</span>}
        <h1 className={styles.title}>{postData.title}</h1>
      </header>
      
      {postData.image && (
        <div className={styles.imageWrapper}>
          <img src={postData.image} alt={postData.title} className={styles.image} />
        </div>
      )}

      <div 
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
      />

      <hr className={styles.divider} />
      
      <ReactionButtons postId={decodedId} />
      <MemoComments postId={decodedId} />
    </article>
  );
}
"@
Set-Content -LiteralPath "app/posts/[id]/page.js" -Value $postPageJs -Encoding UTF8

# 6. Create 10 new posts
$p1 = @"
---
title: "집에서 하는 고양이 발톱 깎기 완벽 가이드"
category: "미용"
---
고양이 발톱 깎는 시간만 되면 전쟁을 치르고 계신가요? 고양이도 집사도 스트레스 받지 않는 꿀팁을 소개합니다.

### 1. 분위기 적응시키기
발톱 깎기를 갑자기 들이대면 고양이는 겁을 먹습니다. 평소에 발톱 깎기를 근처에 두고 냄새를 맡게 해주세요.

### 2. 발 젤리 만지는 연습
고양이가 편안히 쉴 때 발을 조심스럽게 만지고 눌러 발톱이 나오는 느낌에 익숙해지게 하세요. 거부하지 않으면 간식을 보상으로 줍니다.

### 3. 자르는 부위 확인 (중요!)
발톱을 빛에 비춰보면 분홍색 혈관이 보입니다. 이 혈관에서 **최소 2mm 이상** 떨어진 하얀 끝부분만 살짝 잘라내야 합니다.

오늘 당장 모든 발톱을 깎으려 하지 마세요. 하루에 한두 개씩만 깎아도 충분합니다!
"@
Set-Content -LiteralPath "posts/sample6.txt" -Value $p1 -Encoding UTF8

$p2 = @"
---
title: "고양이 필수 예방접종, 무엇을 언제 맞춰야 할까?"
category: "건강"
---
건강한 반려생활의 첫걸음은 바로 예방접종입니다. 초보 집사라면 꼭 알아두어야 할 접종 스케줄을 정리해 드립니다.

### 종합백신 (3종/4종)
가장 기본이 되는 백신으로 범백혈구감소증, 허피스바이러스, 칼리시바이러스를 예방합니다.
- **시기:** 생후 8주부터 시작하여 3주 간격으로 총 3회 접종합니다.
- **추가접종:** 매년 1회씩 보강 접종이 필요합니다.

### 광견병 백신
법적으로 의무화되어 있는 지역도 있습니다.
- **시기:** 생후 3개월 이후 1회 접종.
- **추가접종:** 매년 1회 보강 접종.

접종 후 2~3일간은 열이 나거나 컨디션이 저하될 수 있으니 무리한 목욕이나 놀이는 피하고 푹 쉴 수 있게 해주세요.
"@
Set-Content -LiteralPath "posts/sample7.txt" -Value $p2 -Encoding UTF8

$p3 = @"
---
title: "초보 집사를 위한 필수템 베스트 5"
category: "필수품"
---
고양이를 처음 맞이하기로 결심하셨나요? 수많은 용품 중 무엇부터 사야 할지 막막하다면 이 5가지는 반드시 준비해 주세요!

1. **화장실과 모래:** 고양이는 본능적으로 모래에 배변을 합니다. 고양이 몸길이의 1.5배 이상 되는 큰 화장실과 먼지가 적은 벤토나이트 모래를 추천합니다.
2. **사료와 식기:** 고양이 연령에 맞는 사료를 준비하고, 수염이 닿지 않는 넓고 얕은 도자기나 스텐 식기를 사용하세요.
3. **스크래쳐:** 발톱을 긁으며 스트레스를 푸는 고양이에게 스크래쳐는 가구 보호를 위해서라도 필수입니다. (종이, 수직형 등 2개 이상 추천)
4. **이동장:** 병원에 가거나 이동할 때 필요합니다. 위가 열리거나 앞뒤로 모두 열리는 튼튼한 하드케이스가 좋습니다.
5. **사냥놀이용 장난감:** 낚싯대 장난감은 낯선 환경에서 고양이의 긴장을 풀어주고 친해지는 최고의 도구입니다.
"@
Set-Content -LiteralPath "posts/sample8.txt" -Value $p3 -Encoding UTF8

$p4 = @"
---
title: "우울한 펫로스 증후군, 무지개 다리를 건널 때"
category: "이별"
---
가족 같던 반려묘가 무지개 다리를 건너는 것은 상상하기조차 힘든 아픔입니다. 이별의 순간을 어떻게 받아들이고 극복해야 할까요?

### 충분히 슬퍼하세요
반려동물의 죽음은 가족을 잃은 것과 같은 상실감입니다. 눈물을 참지 말고 슬픔을 있는 그대로 표출하는 것이 치유의 첫걸음입니다.

### 죄책감 내려놓기
'내가 더 잘해줬더라면', '그때 병원에 더 빨리 갔더라면' 하는 자책은 남은 집사를 갉아먹습니다. 아이는 집사님과 함께한 모든 순간을 행복으로 기억할 것입니다.

### 추억의 공간 만들기
작은 액자에 사진을 넣거나 아이가 쓰던 장난감을 모아두는 등, 아이를 기억하고 추모할 수 있는 공간을 마련해 보세요.

힘들 땐 주변의 펫로스 모임이나 전문가의 도움을 받는 것도 좋습니다. 혼자 견디려 하지 마세요.
"@
Set-Content -LiteralPath "posts/sample9.txt" -Value $p4 -Encoding UTF8

$p5 = @"
---
title: "털 뿜뿜 시기! 고양이 빗질과 털빠짐 관리법"
category: "미용"
---
봄과 가을, 고양이의 털갈이 시즌이 오면 온 집안이 털로 뒤덮이곤 합니다. 효과적인 털 관리법을 소개합니다.

### 매일 5분 빗질의 기적
죽은 털을 제거해 주는 것만으로도 헤어볼 구토를 줄이고 피부병을 예방할 수 있습니다. 
- 단모종은 실리콘 브러시나 돈모 브러시
- 장모종은 슬리커 브러시와 일자 빗을 사용하세요.

### 스트레스 주지 않기
고양이가 기분이 좋을 때 (예: 밥을 먹은 직후, 창밖을 구경할 때) 목 뒷부분부터 부드럽게 빗겨주세요. 꼬리나 배는 민감한 부위니 주의해야 합니다.

### 영양가 있는 식단
오메가3가 풍부한 사료나 영양제를 급여하면 털의 윤기가 살아나고 과도한 털빠짐을 예방하는 데 도움이 됩니다.
"@
Set-Content -LiteralPath "posts/sample10.txt" -Value $p5 -Encoding UTF8

$p6 = @"
---
title: "뚱냥이는 귀엽지만 위험해! 고양이 비만 관리"
category: "건강"
---
오동통한 뱃살이 매력 포인트라고 생각하시나요? 비만은 고양이에게 관절염, 당뇨병, 지방간 등 치명적인 질환을 유발할 수 있습니다.

### 비만도 테스트 (BCS)
위에서 내려다봤을 때 허리 라인이 쏙 들어가 있지 않고 둥그렇다면, 그리고 갈비뼈를 만졌을 때 뼈가 잘 만져지지 않는다면 비만을 의심해야 합니다.

### 건강한 다이어트 방법
1. **제한 급여:** 자율 급여를 중단하고 하루 권장 칼로리를 계산해 하루 3~4번으로 나누어 급여하세요.
2. **다이어트 사료:** 포만감은 높고 칼로리는 낮은 체중 조절용 사료로 천 권천히 교체해 줍니다.
3. **활동량 늘리기:** 하루 15분씩 2번 이상, 낚싯대나 레이저 포인터로 숨이 찰 정도로 격렬하게 사냥놀이를 해주세요.

급격한 다이어트는 지방간을 유발할 수 있으므로 천천히 진행하는 것이 핵심입니다.
"@
Set-Content -LiteralPath "posts/sample11.txt" -Value $p6 -Encoding UTF8

$p7 = @"
---
title: "우리 냥이가 스트레스 받고 있다는 5가지 신호"
category: "행동"
---
고양이는 아프거나 스트레스를 받아도 티를 내지 않는 습성이 있습니다. 집사가 먼저 알아채야 할 스트레스 시그널을 확인해보세요.

1. **오버 그루밍:** 자신의 털이 벗겨질 정도로 특정 부위를 과도하게 핥습니다.
2. **화장실 테러:** 평소 배변을 잘 가리던 아이가 화장실 밖이나 이불 등에 오줌을 쌉니다.
3. **숨어서 나오지 않음:** 침대 밑이나 구석에 들어가 불러도 나오지 않고 경계합니다.
4. **식욕 부진:** 평소 좋아하던 간식도 마다하고 밥을 먹지 않습니다.
5. **과도한 울음소리 (하울링):** 밤낮없이 평소와 다른 크고 길게 끄는 소리로 웁니다.

환경 변화(이사, 낯선 사람, 새 고양이 등)나 화장실 불결함 등이 주요 원인이니, 원인을 찾아 신속히 제거해 주세요.
"@
Set-Content -LiteralPath "posts/sample12.txt" -Value $p7 -Encoding UTF8

$p8 = @"
---
title: "실패 없는 캣타워 고르는 꿀팁"
category: "필수품"
---
수직 공간은 고양이에게 선택이 아닌 필수입니다. 캣타워를 고를 때 꼭 고려해야 할 사항들을 알려드립니다.

### 1. 흔들림 없는 튼튼함 (가장 중요)
고양이가 꼭대기에서 뛰어내릴 때 캣타워가 흔들리면 다시는 올라가지 않을 수 있습니다. 무게 중심이 낮고 기둥이 두꺼운 튼튼한 원목 제품을 추천합니다.

### 2. 발판의 간격과 크기
아이의 연령과 관절 상태에 따라 발판의 간격을 고려해야 합니다. 특히 노령묘나 뚱냥이라면 발판 간격이 좁고 계단형으로 된 캣타워가 안전합니다.

### 3. 다양한 기능 포함
숨숨집, 해먹, 스크래쳐 기둥 등 고양이가 좋아하는 요소들이 캣타워 곳곳에 배치되어 있는지 확인하세요. 창가에 두면 최고의 고양이 전용 TV 관람석이 됩니다.
"@
Set-Content -LiteralPath "posts/sample13.txt" -Value $p8 -Encoding UTF8

$p9 = @"
---
title: "치석의 공포! 스트레스 없는 고양이 양치질"
category: "건강"
---
고양이의 70% 이상이 치과 질환을 앓고 있다는 사실, 아시나요? 방치하면 발치를 해야 할 수도 있습니다.

### 양치질 3단계 훈련법
1. **입가 만지기:** 평소 얼굴을 만져주며 자연스럽게 입술을 들춰보고 칭찬과 간식을 줍니다.
2. **치약 맛 보여주기:** 기호성 좋은 닭고기 맛 고양이 전용 치약을 손가락에 짜서 핥아 먹게 합니다.
3. **손가락 칫솔부터 시작:** 거즈나 부드러운 손가락 칫솔에 치약을 묻혀 송곳니와 어금니 바깥쪽만 살살 문질러줍니다.

억지로 입을 벌려 안쪽까지 닦으려 하지 마세요. 고양이 양치는 '완벽함'보다 '꾸준함'이 생명입니다!
"@
Set-Content -LiteralPath "posts/sample14.txt" -Value $p9 -Encoding UTF8

$p10 = @"
---
title: "동네에서 우연히 길고양이를 만났을 때 대처법"
category: "행동"
---
길을 걷다 우연히 마주친 길고양이, 귀엽다고 무작정 다가가면 안 됩니다. 올바른 대처법을 숙지해 주세요.

### 눈 마주치지 않기
고양이 세계에서 눈을 빤히 쳐다보는 것은 공격의 의미입니다. 천천히 눈을 깜빡여주며(고양이 눈인사) 적의가 없음을 알려주세요.

### 억지로 만지려 하지 않기
길고양이는 경계심이 강합니다. 사람의 손길에 놀라 도망치다 로드킬을 당할 위험도 있으니, 적당한 거리를 유지하며 바라만 봐주세요.

### 밥과 물 챙겨주기
만약 간식을 주고 싶다면, 사람이 먹는 음식(참치캔 등)은 염분이 많아 치명적일 수 있습니다. 고양이 전용 사료와 깨끗한 물을 인적이 드문 구석에 조용히 놓아주세요.
"@
Set-Content -LiteralPath "posts/sample15.txt" -Value $p10 -Encoding UTF8

& "C:\Program Files\Git\cmd\git.exe" add .
& "C:\Program Files\Git\cmd\git.exe" commit -m "Auto apply all final requests (Sniglet font, Subscribe, Memo comments, 10 new posts)"
& "C:\Program Files\Git\cmd\git.exe" push origin main
