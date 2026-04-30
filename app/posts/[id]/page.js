
import { getPostData, getAllPostIds } from '@/lib/posts';
import ReactionButtons from '@/components/ReactionButtons';
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

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        {postData.category && <span className={styles.category}>{postData.category}</span>}
        <h1 className={styles.title}>{postData.title}</h1>
      </header>
      
      {postData.image && (
        <div className={styles.imageWrapper}>
          <img src={postData.image} alt={postData.title} className={styles.image} />
        </div>
      )}

      <div 
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
      />

      <hr className={styles.divider} />
      
      <ReactionButtons postId={decodedId} />
    </article>
  );
}
