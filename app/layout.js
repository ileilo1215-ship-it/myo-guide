import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["600"] });

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
            <div className={`logo ${fredoka.className}`}>myo guide</div>
            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="#">Categories</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Subscribe</a></li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
