import Link from "next/link";
import Image from "next/image";
import "./globals.css";

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
            <Link href="/" className="logo-wrapper">
              <Image src="/logo-transparent.png" alt="Myo Guide Logo" width={240} height={90} className="logo-image" style={{ objectFit: 'contain' }} priority />
            </Link>
            <ul className="nav-links">
              <li><Link href="/">홈</Link></li>
              <li><Link href="/?category=Cat Care">케어</Link></li>
              <li><Link href="/?category=Rescue">구조</Link></li>
              <li><Link href="/?category=News">묘한 뉴스</Link></li>
              <li><Link href="/?category=Class">묘한 교실</Link></li>
              <li><Link href="/friends">친구들</Link></li>
              <li><Link href="/about">소개</Link></li>
            </ul>
          </nav>
        </header>
        <div className="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
