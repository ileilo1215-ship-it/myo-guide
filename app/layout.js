import { Jua } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const jua = Jua({ subsets: ["latin"], weight: ["400"] });

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
              <div className={`logo ${jua.className}`} style={{ fontSize: '1.8rem' }}>myo guide</div>
            </Link>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="#">Subscribe</Link></li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
