"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleLinkClick = (e, href) => {
    // Construct current URL with search params
    const currentQuery = searchParams.toString();
    const currentFullHref = currentQuery ? `${pathname}?${currentQuery}` : pathname;
    
    // Normalize href for comparison (ensure it starts with /)
    const normalizedHref = href.startsWith("/") ? href : `/${href}`;

    if (currentFullHref === normalizedHref) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { href: "/", label: "홈", icon: "🏠" },
    { href: "/care", label: "돌봄", icon: "🐾" },
    { href: "/?category=News", label: "묘한 뉴스", icon: "🗞️" },
    { href: "/?category=Class", label: "묘한 교실", icon: "🎓" },
    { href: "/family", label: "묘한 가족들", icon: "🐱" },
    { href: "/friends", label: "친구들", icon: "👫" },
    { href: "/about", label: "소개", icon: "🌿" },
  ];

  return (
    <>
      {/* ── DESKTOP SIDEBAR (hidden on mobile via CSS) ── */}
      <aside className="desktop-sidebar">
        <Link href="/" className="sidebar-logo-link" onClick={(e) => handleLinkClick(e, "/")}>
          <Image
            src="/logo-green-v2.png"
            alt="Myo Guide Logo"
            width={180}
            height={110}
            style={{ objectFit: "contain", width: "100%", height: "auto" }}
            priority
          />
        </Link>
        <nav>
          <ul className="nav-links">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={(e) => handleLinkClick(e, item.href)}>
                  {item.label} <span className="nav-icon">{item.icon}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ── MOBILE TOP BAR (hidden on desktop via CSS) ── */}
      <header className="mobile-header">
        <Link href="/" className="mobile-logo-link" onClick={(e) => handleLinkClick(e, "/")}>
          <Image
            src="/logo-green-v2.png"
            alt="Myo Guide Logo"
            width={240}
            height={148}
            style={{ objectFit: "contain", width: "auto" }}
            priority
          />
        </Link>
        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(true)}
          aria-label="메뉴 열기"
        >
          ☰
        </button>
      </header>

      {/* ── MOBILE OVERLAY MENU (Slide-in from right) ── */}
      <div 
        className={`mobile-overlay-backdrop ${isOpen ? "is-open" : ""}`} 
        onClick={() => setIsOpen(false)} 
      />
      
      <div className={`mobile-menu-overlay ${isOpen ? "is-open" : ""}`} role="dialog" aria-modal="true">
        <div className="mobile-overlay-header">
          <button
            className="overlay-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>

        <div className="overlay-content">
          {/* Debug: Mobile Menu V2.1 */}
          <Link href="/" onClick={(e) => handleLinkClick(e, "/")} className="overlay-logo-link">
            <Image
              src="/logo-green-v2.png"
              alt="Myo Guide Logo"
              width={140}
              height={86}
              className="overlay-logo"
              style={{ objectFit: "contain" }}
              priority
              unoptimized
            />
          </Link>
          
          <nav style={{ width: "100%" }}>
            <ul className="overlay-nav-links">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={(e) => handleLinkClick(e, item.href)}>
                    {item.label} <span className="nav-icon">{item.icon}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
