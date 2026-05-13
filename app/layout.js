import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

export const metadata = {
  metadataBase: new URL('https://myo-guide.vercel.app'),
  title: "묘한 가이드",
  description: "반려동물과 함께하는 특별하고 묘한 일상 가이드",
  openGraph: {
    title: "묘한 가이드",
    description: "반려동물과 함께하는 특별하고 묘한 일상 가이드",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "묘한 가이드 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
        <div className="main-content">
          {children}
          <Footer />
        </div>
        <ScrollToTop />
      </body>
    </html>
  );
}
