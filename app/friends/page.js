import Image from 'next/image';
import styles from './friends.module.css';

export const metadata = {
  title: 'Friends | 묘한 가이드',
};

const friendsList = [
  // 1. 구조 및 보호 중심
  {
    name: "119리워크 (119ark)",
    description: "위급 상황에 처한 동물을 직접 구조하고 치료하는 과정을 투명하게 공유합니다.",
    url: "https://www.instagram.com/119ark/",
    image: "https://images.unsplash.com/photo-1516366434321-728a48e6b7bf?w=800&q=80",
    tags: ["구조", "치료", "공유"]
  },
  {
    name: "포켓멍센터",
    description: "유기견 구조부터 임시 보호, 입양까지 전문적으로 진행하며 진정성 있는 스토리를 전합니다.",
    url: "https://www.instagram.com/pocketmung/",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80",
    tags: ["유기견", "임시보호", "입양"]
  },
  {
    name: "유엄빠 (유기동물의 엄마 아빠)",
    description: "개별 유기동물의 사연에 집중하며 세련된 영상 콘텐츠로 입양 문화를 알립니다.",
    url: "https://www.instagram.com/youumbba/",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80",
    tags: ["스토리", "영상콘텐츠", "구조"]
  },
  {
    name: "비글구조네트워크",
    description: "실험동물을 비롯해 대형견 및 농장동물 등 광범위한 구조 활동을 펼칩니다.",
    url: "https://www.beaglerescuenetwork.org/",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&q=80",
    tags: ["실험동물", "농장동물", "대형견"]
  },
  // 2. 대규모 시민단체
  {
    name: "동물권행동 카라 (KARA)",
    description: "보호소 운영, 법 개정, 교육 등 국내에서 체계적이고 영향력 있는 동물권 활동을 전개합니다.",
    url: "https://www.ekara.org/",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80",
    tags: ["보호소", "법개정", "교육"]
  },
  {
    name: "동물자유연대",
    description: "오랜 역사와 높은 신뢰도를 바탕으로 대형 구조 건과 정책 제안에 힘씁니다.",
    url: "https://www.animals.or.kr/",
    image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=800&q=80",
    tags: ["정책제안", "대형구조", "캠페인"]
  },
  // 3. 특정 지역 및 보호소 기반
  {
    name: "동물권단체 케어 (CARE)",
    description: "현장감을 강조하며 적극적이고 공격적인 구조 활동으로 동물권을 수호합니다.",
    url: "https://careanimalrights.or.kr/",
    image: "https://images.unsplash.com/photo-1527362950785-f487a7c1fe48?w=800&q=80",
    tags: ["현장구조", "캠페인"]
  },
  {
    name: "안성평강공주보호소",
    description: "연예인 봉사단 등으로 알려진 사설 보호소로, 유기동물 보호와 입양 확산에 앞장섭니다.",
    url: "https://www.instagram.com/ansung_pyunggang/",
    image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80",
    tags: ["사설보호소", "봉사활동", "입양"]
  },
  // 4. 기존 미디어 및 거점
  {
    name: "고양이역 카페",
    description: "방문객의 소비가 유기 고양이들의 치료와 보호로 직접 이어지는 기차역 모티브 카페입니다.",
    url: "https://www.instagram.com/cat_station_/",
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80",
    tags: ["쉼터", "테마카페", "후원"]
  },
  {
    name: "정글핌피 (핌피바이러스)",
    description: "유기동물 임시보호 문화를 알리고 입양 희망 가정을 연결해 주는 동물책방입니다.",
    url: "https://www.instagram.com/pimpi_virus/",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    tags: ["책방", "임시보호", "상담"]
  },
  {
    name: "오보이! (OhBoy!)",
    description: "지구와 환경, 동물권을 이야기하며 유기견 입양과 모피 반대 메시지를 전하는 잡지입니다.",
    url: "http://ohboy.co.kr/",
    image: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?w=800&q=80",
    tags: ["매거진", "환경", "동물권"]
  },
  {
    name: "뉴스펭귄",
    description: "기후위기와 멸종위기 동물을 대변하며 야생동물들의 현실을 심층 보도하는 매체입니다.",
    url: "https://www.newspenguin.com/",
    image: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800&q=80",
    tags: ["언론", "기후위기", "펭귄"]
  }
];

export default function FriendsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Friends</h1>
        <p className={styles.subtitle}>우리가 알아야 할, 생명을 살리는 멋진 단체와 매체들</p>
      </div>

      <div className={styles.grid}>
        {friendsList.map((friend, index) => (
          <div key={index} className={styles.card}>
            
            <div className={styles.imageWrapper}>
              <Image src={friend.image} alt={friend.name} fill style={{ objectFit: 'cover' }} />
            </div>

            <div className={styles.cardContent}>
              <div className={styles.topRow}>
                <div className={styles.tags}>
                  {friend.tags.map((tag, i) => (
                    <span key={i} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <a href={friend.url} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>
                  방문하기 <span className={styles.arrow}>→</span>
                </a>
              </div>
              
              <div>
                <h2 className={styles.cardTitle}>{friend.name}</h2>
                <p className={styles.description}>
                  {friend.description}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
