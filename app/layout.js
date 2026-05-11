import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

export const metadata = {
  title: "묘한 가이드",
  description: "반려동물과 함께하는 특별하고 묘한 일상 가이드",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#F8F5F0',
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
