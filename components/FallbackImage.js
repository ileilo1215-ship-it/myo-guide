"use client";

import { useState } from 'react';

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

export default function FallbackImage({ src, alt, className, category }) {
  const defaultImage = getFallbackImage(category);
  const [imgSrc, setImgSrc] = useState(src || defaultImage);

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={() => {
        if (imgSrc !== defaultImage) {
          setImgSrc(defaultImage);
        }
      }}
    />
  );
}
