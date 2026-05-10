'use client';

import React from 'react';
import styles from './A4Layout.module.css';

const A4Layout = ({ children, title, subtitle, character = '😺', year }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.a4Page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.characterBadge}>{character}</div>
            <div>
              <div className={styles.siteTitle}>묘한 가이드: 묘한 교실</div>
              <h1 className={styles.title}>{title}</h1>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.subtitle}>{subtitle}</div>
            <div className={styles.pageNumber}>1 / 1</div>
          </div>
        </header>

        <main className={styles.mainContent}>
          {children}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerLine}></div>
          <div className={styles.footerContent}>
            <span>© {year || '2026'} MYO GUIDE. All rights reserved.</span>
            <span>본 자료는 묘한가이드 묘한교실 교육용으로만 사용 가능합니다.</span>
          </div>
        </footer>
      </div>
      
      <button 
        className={styles.printButton} 
        onClick={() => window.print()}
      >
        🖨️ PDF로 저장 / 인쇄하기
      </button>
    </div>
  );
};

export default A4Layout;
