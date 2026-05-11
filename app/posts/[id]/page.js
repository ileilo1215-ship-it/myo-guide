import { getPostData, getAllPostIds } from '@/lib/posts';
import { CATEGORY_MAP } from '@/lib/constants';
import ReactionButtons from '@/components/ReactionButtons';
import ShareButtons from '@/components/ShareButtons';
import GiscusComments from '@/components/GiscusComments';
import FallbackImage from '@/components/FallbackImage';
import PostButton from '@/components/PostButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import styles from './page.module.css';
import fs from 'fs';
import path from 'path';


export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.id,
  }));
}

export default async function Post({ params }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const postData = await getPostData(decodedId);

  if (postData.category === 'Class') {
    const hasStudentPdf = postData.pdfStudent && fs.existsSync(path.join(process.cwd(), 'public', postData.pdfStudent));
    const hasTeacherPdf = postData.pdfTeacher && fs.existsSync(path.join(process.cwd(), 'public', postData.pdfTeacher));

    const PdfButtons = () => (
      <div className={styles.pdfButtonGroup}>
        <div className={styles.pdfButtonWrapper}>
          <a 
            href={`/learn/worksheet/${decodedId}`} 
            className={styles.pdfButton}
            target="_blank"
          >
            📥 학생용 활동지 (PDF/인쇄)
          </a>
          <div className={styles.pdfThumbnail}>
            <img src="/previews/worksheet-thumb.png" alt="활동지 미리보기" />
          </div>
        </div>
        <div className={styles.pdfButtonWrapper}>
          <a 
            href={`/learn/guide/${decodedId}`} 
            className={styles.pdfButton}
            target="_blank"
          >
            📋 교사용 가이드 (PDF/인쇄)
          </a>
          <div className={styles.pdfThumbnail}>
            <img src="/previews/guide-thumb.png" alt="가이드 미리보기" />
          </div>
        </div>
      </div>
    );

    return (
      <article className={styles.container}>
        <header className={styles.header}>
          <span className={styles.category}>{CATEGORY_MAP[postData.category] || postData.category}</span>
          <h1 className={styles.title}>{postData.title}</h1>
        </header>

        <div className={styles.learnInfoBar}>
          <div className={styles.learnBadges}>
            {postData.grade && <span className={styles.gradeBadge}>{postData.grade}</span>}
            {postData.duration && <span className={styles.durationBadge}>⏱️ {postData.duration}분 소요</span>}
          </div>
          <PdfButtons />
        </div>

        {postData.coreQuestion && (
          <div className={styles.coreQuestionBox}>
            <span className={styles.coreQuestionLabel}>🪝 핵심 질문</span>
            <div className={styles.coreQuestionText}>{postData.coreQuestion}</div>
          </div>
        )}

        <div className={styles.content}>
          <MarkdownRenderer content={postData.content} />
        </div>

        <div className={styles.bottomDownload}>
          <PdfButtons />
        </div>
      </article>
    );
  }

  if (postData.category === 'News') {
    return (
      <article className={styles.container}>
        <header className={styles.header}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {postData.category && <span className={styles.category}>{CATEGORY_MAP[postData.category] || postData.category}</span>}
            {postData.tag && <span style={{ color: '#888', fontWeight: '500' }}>| {postData.tag}</span>}
          </div>
          <h1 className={styles.title}>{postData.title}</h1>
        </header>

        {postData.hook && (
          <div className={styles.hook}>
            🪝 {postData.hook}
          </div>
        )}
        
        {postData.image && (
          <div className={styles.imageWrapper}>
            <FallbackImage 
              src={postData.image} 
              alt={postData.title} 
              className={styles.image} 
              category={postData.category}
            />
          </div>
        )}

        {postData.summary && (
          <div className={styles.summarySection}>
            <div className={styles.summaryTitle}>📌 한 줄 요약</div>
            <div className={styles.summaryText}>{postData.summary}</div>
          </div>
        )}

        {postData.editorNote && (
          <div className={styles.editorNote}>
            <div className={styles.editorNoteTitle}>✏️ 편집자 한마디</div>
            <div className={styles.editorNoteText}>{postData.editorNote}</div>
          </div>
        )}

        <div className={styles.sectionTitle}>📖 상세 내용</div>
        <div className={styles.content}>
          <MarkdownRenderer content={postData.content} />
        </div>

        <div className={styles.sourceFooter}>
          <div className={styles.sourceMeta}>
            <span>출처: {postData.source}</span>
            <span>📅 {postData.date}</span>
            {postData.readTime && <span>🕐 읽는 데 {postData.readTime}</span>}
          </div>
          {postData.sourceUrl && (
            <a href={postData.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceButton}>
              기사 읽기 &gt;
            </a>
          )}
        </div>


      </article>
    );
  }

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        {postData.category && <span className={styles.category}>{CATEGORY_MAP[postData.category] || postData.category}</span>}
        <h1 className={styles.title}>{postData.title}</h1>
      </header>
      
      {(!postData.image || postData.image) && (
        <div className={styles.imageWrapper}>
          <FallbackImage 
            src={postData.image} 
            alt={postData.title} 
            className={styles.image} 
            category={postData.category}
            style={decodedId === 'rescue-tnr-guide' ? { 
              objectPosition: 'center 25%',
              transform: 'scale(1.2)',
            } : {}}
          />
        </div>
      )}

      <div className={styles.content}>
        <MarkdownRenderer content={postData.content} />
      </div>


    </article>
  );
}
