import Image from 'next/image';

export const metadata = {
  title: 'Friends | 묘한 가이드',
};

const friendsList = [
  // 1. 구조 및 보호 중심
  {
    name: "119리워크 (119ark)",
    description: "위급한 상황에 처한 동물들을 직접 구조하고 치료하는 과정을 가감 없이 공유하며 큰 지지를 얻고 있는 곳입니다.",
    url: "https://www.instagram.com/119ark/",
    image: "https://images.unsplash.com/photo-1516366434321-728a48e6b7bf?w=800&q=80",
    tags: ["구조", "치료", "공유"]
  },
  {
    name: "포켓멍센터",
    description: "유기견 구조와 임시 보호, 입양을 전문적으로 진행하며 깔끔한 피드와 진정성 있는 스토리로 인기가 높습니다.",
    url: "https://www.instagram.com/pocketmung/",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80",
    tags: ["유기견", "임시보호", "입양"]
  },
  {
    name: "유엄빠 (유기동물의 엄마 아빠)",
    description: "대규모 구조보다는 한 마리 한 마리의 사연에 집중하며, 세련된 영상 콘텐츠로 MZ세대 사이에서 인지도가 매우 높습니다.",
    url: "https://www.instagram.com/youumbba/",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80",
    tags: ["스토리", "영상콘텐츠", "구조"]
  },
  {
    name: "비글구조네트워크",
    description: "실험동물 구조로 시작해 현재는 대형견 및 농장 동물을 포함한 광범위한 구조 활동을 펼치고 있습니다.",
    url: "https://www.beaglerescuenetwork.org/",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&q=80",
    tags: ["실험동물", "농장동물", "대형견"]
  },
  // 2. 대규모 시민단체
  {
    name: "동물권행동 카라 (KARA)",
    description: "국내에서 가장 영향력 있는 단체 중 하나로, 보호소 운영뿐만 아니라 법 개정, 교육 등 체계적인 활동을 보여줍니다.",
    url: "https://www.ekara.org/",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80",
    tags: ["보호소", "법개정", "교육"]
  },
  {
    name: "동물자유연대",
    description: "오랜 역사를 가진 단체로, 대형 구조 건이나 정책 제안 등에 강점이 있으며 대중적인 신뢰도가 높습니다.",
    url: "https://www.animals.or.kr/",
    image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=800&q=80",
    tags: ["정책제안", "대형구조", "캠페인"]
  },
  // 3. 특정 지역 및 보호소 기반
  {
    name: "동물권단체 케어 (CARE)",
    description: "구조 활동의 현장감을 강조하며 공격적인 구조 활동으로 유명한 단체입니다.",
    url: "https://careanimalrights.or.kr/",
    image: "https://images.unsplash.com/photo-1527362950785-f487a7c1fe48?w=800&q=80",
    tags: ["현장구조", "캠페인"]
  },
  {
    name: "안성평강공주보호소",
    description: "연예인 봉사단 등으로 대중에게 많이 알려진 사설 보호소로, 유기동물 보호와 입양 문화 확산에 힘쓰고 있습니다.",
    url: "https://www.instagram.com/ansung_pyunggang/",
    image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80",
    tags: ["사설보호소", "봉사활동", "입양"]
  },
  // 4. 기존 미디어 및 거점
  {
    name: "고양이역 카페",
    description: "인천 영흥도에 위치한 기차역 모티브의 카페. 방문객의 소비가 유기 고양이들의 치료와 보호로 직접 이어집니다.",
    url: "https://www.instagram.com/cat_station_/",
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80",
    tags: ["쉼터", "테마카페", "후원"]
  },
  {
    name: "정글핌피 (핌피바이러스)",
    description: "유기동물 임시보호 문화를 알리는 동물책방. 희망 가정을 연결해주는 상담소 역할을 합니다.",
    url: "https://www.instagram.com/pimpi_virus/",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    tags: ["책방", "임시보호", "상담"]
  },
  {
    name: "오보이! (OhBoy!)",
    description: "지구와 환경, 동물권을 이야기하는 패션 문화 잡지. 유기견 입양과 모피 반대 메시지를 전합니다.",
    url: "http://ohboy.co.kr/",
    image: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?w=800&q=80",
    tags: ["매거진", "환경", "동물권"]
  },
  {
    name: "뉴스펭귄",
    description: "기후위기와 멸종위기 동물을 대변하는 전문 매체. 야생동물들의 현실을 심층 보도합니다.",
    url: "https://www.newspenguin.com/",
    image: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800&q=80",
    tags: ["언론", "기후위기", "펭귄"]
  }
];

export default function FriendsPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Friends</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>우리가 알아야 할, 생명을 살리는 멋진 단체와 매체들</p>
      </div>

      {/* Reduced gap and padding to show more information at a glance */}
      <div style={{ display: 'grid', gap: '1.2rem' }}>
        {friendsList.map((friend, index) => (
          <div key={index} style={{ display: 'flex', backgroundColor: 'var(--card-bg)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', height: '140px' }}>
            
            {/* Image Section - reduced width and fixed height */}
            <div style={{ position: 'relative', width: '25%', height: '100%' }}>
              <Image src={friend.image} alt={friend.name} fill style={{ objectFit: 'cover' }} />
            </div>

            {/* Content Section - smaller paddings and fonts */}
            <div style={{ padding: '1.2rem 1.5rem', width: '75%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                {friend.tags.map((tag, i) => (
                  <span key={i} style={{ backgroundColor: 'var(--banner-bg)', color: 'var(--accent-color)', padding: '0.2rem 0.6rem', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    #{tag}
                  </span>
                ))}
              </div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{friend.name}</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '0.5rem', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {friend.description}
              </p>
              
              <a href={friend.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                방문하기 <span style={{ fontSize: '1.1rem' }}>→</span>
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
