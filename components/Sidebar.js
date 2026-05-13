"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

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
    const currentQuery = searchParams?.toString() || "";
    const currentFullHref = currentQuery ? `${pathname}?${currentQuery}` : pathname;
    
    // Normalize href for comparison (ensure it starts with /)
    const normalizedHref = href.startsWith("/") ? href : `/${href}`;

    if (currentFullHref === normalizedHref) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "홈", icon: "🏠" },
    { href: "/care", label: "돌봄", icon: "🐾" },
    { href: "/assistant", label: "묘한 비서", icon: "🤖" },
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
            src="/logo-refined.png"
            alt="Myo Guide Logo"
            width={160}
            height={90}
            style={{ objectFit: "contain", width: "160px", height: "auto" }}
            priority
          />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="sidebar-search">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input" 
          />
          <button type="submit" className="search-submit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        <div className="sidebar-menu-area">
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
        </div>
      </aside>

      {/* ── MOBILE TOP BAR (hidden on desktop via CSS) ── */}
      <header className="mobile-header">
        <Link href="/" className="mobile-logo-link" onClick={(e) => handleLinkClick(e, "/")}>
          <Image
            src="/logo-refined.png"
            alt="Myo Guide Logo"
            width={240}
            height={148}
            style={{ objectFit: "contain", width: "auto", maxHeight: "42px" }}
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
          <Link href="/" onClick={(e) => handleLinkClick(e, "/")} className="overlay-logo-link">
            <Image
              src="/logo-refined.png"
              alt="Myo Guide Logo"
              width={140}
              height={80}
              className="overlay-logo"
              style={{ objectFit: "contain" }}
              priority
              unoptimized
            />
          </Link>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="sidebar-search" style={{ marginBottom: '2rem' }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input" 
            />
            <button type="submit" className="search-submit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
          
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
