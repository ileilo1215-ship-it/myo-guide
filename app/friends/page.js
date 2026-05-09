import Image from 'next/image';
import styles from './friends.module.css';

export const metadata = {
  title: 'Friends | 묘한 가이드',
};

const friendsList = [
  // 1. 구조 및 보호 중심
  {
    name: "119리워크 (119ark)",
    description: "동물 구조와 치료 전 과정을 날것 그대로 공유하는 곳. 현장의 긴박함과 진심이 고스란히 느껴진다.",
    url: "https://www.instagram.com/119ark/",
    image: "https://images.unsplash.com/photo-1516366434321-728a48e6b7bf?w=800&q=80",
    tags: ["구조", "치료", "현장공유"]
  },
  {
    name: "포켓멍센터",
    description: "구조부터 입양까지 진정성 있는 스토리로 신뢰를 쌓아온 곳. 깔끔하고 진심 어린 콘텐츠가 돋보인다.",
    url: "https://www.instagram.com/pocketmung/",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80",
    tags: ["유기견", "임시보호", "입양"]
  },
  {
    name: "유엄빠 (유기동물의 엄마 아빠)",
    description: "한 마리의 사연에 집중하는 곳. 세련된 영상 콘텐츠로 동물 이야기를 MZ세대의 언어로 풀어낸다.",
    url: "https://www.instagram.com/youumbba/",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80",
    tags: ["스토리", "영상", "구조"]
  },
  {
    name: "비글구조네트워크",
    description: "실험동물부터 대형견, 농장동물까지. 아무도 선뜻 손대지 않는 소외된 동물들 곁을 지키는 곳.",
    url: "https://www.beaglerescuenetwork.org/",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&q=80",
    tags: ["실험동물", "농장동물", "대형견"]
  },
  // 2. 대규모 시민단체
  {
    name: "동물권행동 카라 (KARA)",
    description: "가장 체계적으로 움직이는 단체 중 하나. 구조 현장부터 법 개정까지 동물권의 전선을 넓혀가고 있다.",
    url: "https://www.ekara.org/",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80",
    tags: ["보호소", "법개정", "교육"]
  },
  {
    name: "동물자유연대",
    description: "오랜 역사만큼 두터운 신뢰를 자랑하는 곳. 대형 구조와 정책 제안에 강하며 시민들이 지지하는 단체.",
    url: "https://www.animals.or.kr/",
    image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=800&q=80",
    tags: ["정책", "대형구조", "캠페인"]
  },
  // 3. 특정 지역 및 보호소 기반
  {
    name: "동물권단체 케어 (CARE)",
    description: "시민 후원만으로 운영되는 독립 단체. 누구보다 현장에 가까이, 누구보다 공격적으로 활동한다.",
    url: "https://careanimalrights.or.kr/",
    image: "https://images.unsplash.com/photo-1527362950785-f487a7c1fe48?w=800&q=80",
    tags: ["현장구조", "캠페인", "독립운영"]
  },
  {
    name: "안성평강공주보호소",
    description: "연예인 봉사단으로 알려진 사설 보호소. 유기동물 보호와 입양 확산을 위해 묵묵히 자리를 지키는 곳.",
    url: "https://www.instagram.com/ansung_pyunggang/",
    image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80",
    tags: ["사설보호소", "봉사", "입양"]
  },
  // 4. 기존 미디어 및 거점
  {
    name: "고양이역 카페",
    description: "인천 영흥도의 기차역 모티브 카페. 커피 한 잔이 치료비가 되는, 소비가 곧 후원이 되는 공간.",
    url: "https://www.instagram.com/cat_station_/",
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80",
    tags: ["카페", "후원", "유기고양이"]
  },
  {
    name: "정글핌피 (핌피바이러스)",
    description: "동물책방이자 임시보호 상담소. 책과 동물이 만나는 방식으로 유기동물 입양 문화를 조용히 바꾼다.",
    url: "https://www.instagram.com/pimpi_virus/",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    tags: ["책방", "임시보호", "상담"]
  },
  {
    name: "오보이! (OhBoy!)",
    description: "패션과 문화에 동물권과 환경을 녹여낸 잡지. 관심 없던 사람도 자연스레 빠져들게 만드는 매력이 있다.",
    url: "http://ohboy.co.kr/",
    image: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?w=800&q=80",
    tags: ["매거진", "환경", "모피반대"]
  },
  {
    name: "뉴스펭귄",
    description: "기후위기와 멸종위기 동물을 전문 보도하는 매체. 귀여운 이름 뒤에 날카롭고 깊이 있는 시선이 담겨 있다.",
    url: "https://www.newspenguin.com/",
    image: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800&q=80",
    tags: ["언론", "기후위기", "멸종위기"]
  },
  {
    name: "야옹이신문",
    description: "집사와 캣맘이 만드는 국내 유일의 고양이 신문. 고양이를 향한 애정과 특별한 진심이 담긴 미디어.",
    url: "https://catnews.net/",
    image: "https://images.unsplash.com/photo-1591871937573-74dbba515c4c?w=800&q=80",
    tags: ["신문", "미디어", "집사제작"]
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
