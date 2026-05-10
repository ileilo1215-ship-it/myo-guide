import { getPostData, getAllPostIds } from '@/lib/posts';
import ReactionButtons from '@/components/ReactionButtons';
import ShareButtons from '@/components/ShareButtons';
import GiscusComments from '@/components/GiscusComments';
import FallbackImage from '@/components/FallbackImage';
import PostButton from '@/components/PostButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import styles from './page.module.css';


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

  if (postData.category === 'News') {
    return (
      <article className={styles.container}>
        <header className={styles.header}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {postData.category && <span className={styles.category}>{postData.category}</span>}
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
              기사 읽기 →
            </a>
          )}
        </div>

        <hr className={styles.divider} />
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <ReactionButtons postId={decodedId} />
          <ShareButtons title={postData.title} />
        </div>
      </article>
    );
  }

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        {postData.category && <span className={styles.category}>{postData.category}</span>}
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

      <hr className={styles.divider} />
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <ReactionButtons postId={decodedId} />
        <ShareButtons title={postData.title} />
      </div>
      
      <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#FFFBE6', borderRadius: '2px 15px 15px 15px', boxShadow: '3px 4px 10px rgba(0,0,0,0.08)', border: '1px solid #F6E9B2', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '15px', backgroundColor: '#FFCF96', opacity: '0.6', borderRadius: '10px' }}></div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#5A514A', textAlign: 'center', fontWeight: 'bold' }}>
          📝 집사들의 꿀팁 메모장
        </h3>
        <p style={{ textAlign: 'center', color: '#8C8279', marginBottom: '2rem', fontSize: '0.9rem' }}>
          이 글과 관련된 꿀팁을 남겨주세요! (GitHub 계정으로 로그인됩니다)
        </p>
        <GiscusComments />
      </div>
    </article>
  );
}
