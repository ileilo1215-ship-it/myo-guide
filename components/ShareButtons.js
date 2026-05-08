'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function ShareButtons({ title, url }) {
  const [showToast, setShowToast] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      try {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '12345678901234567890123456789012');
      } catch (err) {
        console.error('Kakao init error:', err);
      }
    }
  }, []);

  const handleKakaoShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined' && window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: 'text',
        text: title || '묘한 가이드에서 이 글을 확인해보세요!',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      });
    }
  };

  const handleCopyLink = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  return (
    <>
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js" strategy="lazyOnload" />
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        <button
          onClick={handleKakaoShare}
          style={{
            background: '#FEE500',
            color: '#000000',
            border: 'none',
            borderRadius: '30px',
            padding: '0.6rem 1rem',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            fontWeight: 'bold',
          }}
        >
          <span>💬</span>
          <span style={{ fontSize: '0.9rem' }}>카톡 공유</span>
        </button>

        <button
          onClick={handleCopyLink}
          style={{
            background: '#FFFFFF',
            border: '2px solid #E2D9CC',
            borderRadius: '30px',
            padding: '0.6rem 1rem',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          }}
        >
          <span>🔗</span>
          <span style={{ fontSize: '0.9rem', color: '#5A514A' }}>링크 복사</span>
        </button>

        {showToast && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            color: '#FFF',
            padding: '10px 20px',
            borderRadius: '20px',
            zIndex: 1000,
            fontSize: '0.9rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            animation: 'fadeInOut 2s ease-in-out'
          }}>
            복사됐어요 ✨
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, 20px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -20px); }
        }
      `}</style>
    </>
  );
}
