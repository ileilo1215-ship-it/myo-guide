"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function PostCard({ post }) {
  // strip markdown or long text for excerpt
  const excerpt = post.content ? post.content.substring(0, 100) + '...' : '';
  const [imgSrc, setImgSrc] = useState(post.image || '/placeholder.png');
  
  return (
    <article className="post-card">
      <div className="card-image-wrapper">
        <Image 
          src={imgSrc} 
          alt="Post thumbnail" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="card-image"
          onError={() => {
            setImgSrc('/placeholder.png');
          }}
        />
      </div>
      <div className="card-content">
        {post.category && <span className="category">{post.category}</span>}
        <h2 className="post-title">{post.title}</h2>
        <p className="excerpt">{excerpt}</p>
        <div className="card-footer">
          {post.date && <time className="date">{post.date}</time>}
          <span className="read-more">Read Article</span>
        </div>
      </div>
    </article>
  );
}
