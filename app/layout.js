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
              <Image src="/logo.png" alt="Myo Guide Logo" width={240} height={90} className="logo-image" style={{ objectFit: 'contain' }} />
            </Link>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/?category=Cat Care">Cat Care</Link></li>
              <li><Link href="/?category=Rescue">Rescue</Link></li>
              <li><Link href="/friends">Friends</Link></li>
              <li><Link href="/?category=News">News</Link></li>
              <li><Link href="/about">About</Link></li>
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
