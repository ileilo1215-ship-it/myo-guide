import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "묘한 가이드",
  description: "반려동물과 함께하는 특별하고 묘한 일상 가이드",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Sidebar />
        <div className="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
