"use client";

import { useState } from 'react';

export default function FallbackImage({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src || '/placeholder.png');

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={() => {
        setImgSrc('/placeholder.png');
      }}
    />
  );
}
