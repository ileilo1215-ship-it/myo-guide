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
              <div className={sniglet.className} style={{ fontSize: '2.2rem', letterSpacing: '1px' }}>myo guide</div>
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
        {children}
      </body>
    </html>
  );
}
