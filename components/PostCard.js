"use client";

import Link from 'next/link';

const categoryImages = {
  Health: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
  Grooming: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=800&auto=format&fit=crop",
  Environment: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",
  Safety: "https://images.unsplash.com/photo-1529778456209-41712a201b1c?q=80&w=800&auto=format&fit=crop",
  Behavior: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800&auto=format&fit=crop",
  Play: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=800&auto=format&fit=crop",
  News: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?q=80&w=800&auto=format&fit=crop",
  Class: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=800&auto=format&fit=crop",
  'Street Life': "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
  Rights: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=800&auto=format&fit=crop",
};

const getFallbackImage = (category) => {
  return categoryImages[category] || '/placeholder.png';
};

export default function PostCard({ post }) {
  const excerpt = post.content ? post.content.substring(0, 100) + '...' : '';
  const fallbackImageUrl = getFallbackImage(post.category);
  const imageUrl = post.image || fallbackImageUrl;
  
  const handleSourceClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(post.sourceUrl, '_blank');
  };

  return (
    <Link href={`/posts/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="post-card">
        <div className="card-image-wrapper">
          <img 
            src={imageUrl} 
            alt="Post thumbnail" 
            className="card-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = fallbackImageUrl;
              e.currentTarget.onerror = null; // Prevent infinite loop
            }}
          />
        </div>
        <div className="card-content">
          {post.category && <span className="category">{post.category}</span>}
          <h2 className="post-title">{post.title}</h2>
          <p className="excerpt">{excerpt}</p>
          <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {post.date && <time className="date" style={{ fontSize: '0.8rem', color: '#888' }}>{post.date}</time>}
              {post.source && post.sourceUrl && (
                <div 
                  onClick={handleSourceClick} 
                  style={{ 
                    fontSize: '0.8rem', 
                    color: 'var(--accent-color)', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    backgroundColor: 'rgba(215, 114, 44, 0.1)',
                    borderRadius: '4px'
                  }}
                >
                  출처: {post.source}
                </div>
              )}
            </div>
            <span className="read-more">Read Article</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
