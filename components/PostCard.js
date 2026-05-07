import Link from 'next/link';

export default function PostCard({ post }) {
  // strip markdown or long text for excerpt
  const excerpt = post.content ? post.content.substring(0, 100) + '...' : '';
  const imageUrl = post.image || '/placeholder.png';
  
  return (
    <Link href={`/posts/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="post-card">
        <div className="card-image-wrapper">
          <img 
            src={imageUrl} 
            alt="Post thumbnail" 
            className="card-image"
            loading="lazy"
          />
        </div>
        <div className="card-content">
          {post.category && <span className="category">{post.category}</span>}
          <h2 className="post-title">{post.title}</h2>
          <p className="excerpt">{excerpt}</p>
          <div className="card-footer">
            <span className="read-more">Read Article</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
