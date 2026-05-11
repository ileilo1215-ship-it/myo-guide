'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './HeroSlider.css';

export default function HeroSlider({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  if (!slides || slides.length === 0) return null;

  return (
    <section 
      className="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`hero-slide ${index === currentIndex ? 'active' : ''}`}
        >
          <div className="hero-main-layer">
            <Image 
              src={slide.image} 
              alt={slide.title} 
              fill 
              className="hero-main-image"
              priority={index === 0}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="hero-overlay"></div>
          
          <div className="hero-news-overlay">
            <h2 className="news-subtitle">{slide.subtitle || '“모든 생명이 존중받는 세상을 위해”'}</h2>
            <span className="news-tag">{slide.label}</span>
            <Link href={slide.link} className="hero-slide-link">
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <div className="more-link">
                자세히 보기 &gt;
              </div>
            </Link>
          </div>
        </div>
      ))}

      {/* Pagination Dots */}
      <div className="hero-pagination">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
