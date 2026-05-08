"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "홈" },
    { href: "/?category=Cat Care", label: "케어" },
    { href: "/?category=Rescue", label: "구조" },
    { href: "/?category=News", label: "묘한 뉴스" },
    { href: "/?category=Class", label: "묘한 교실" },
    { href: "/friends", label: "친구들" },
    { href: "/about", label: "소개" },
  ];

  return (
    <>
      {/* ── DESKTOP SIDEBAR (hidden on mobile via CSS) ── */}
      <aside className="desktop-sidebar">
        <Link href="/" className="sidebar-logo-link">
          <Image
            src="/logo-transparent.png"
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
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ── MOBILE TOP BAR (hidden on desktop via CSS) ── */}
      <header className="mobile-header">
        <Link href="/" className="mobile-logo-link">
          <Image
            src="/logo-transparent.png"
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

      {/* ── MOBILE FULL-SCREEN OVERLAY MENU ── */}
      {isOpen && (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true">
          <button
            className="overlay-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
          <Link href="/" onClick={() => setIsOpen(false)} className="overlay-logo-link">
            <Image
              src="/logo-transparent.png"
              alt="Myo Guide Logo"
              width={600}
              height={400}
              className="overlay-logo"
              style={{ objectFit: "contain", width: "100%", height: "auto", marginBottom: "1.5rem" }}
              priority
              unoptimized
            />
          </Link>
          <nav>
            <ul className="overlay-nav-links">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Dimmed backdrop */}
      {isOpen && (
        <div
          className="mobile-overlay-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
