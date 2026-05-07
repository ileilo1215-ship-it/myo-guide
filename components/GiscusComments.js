'use client';

import { useEffect, useRef } from 'react';

export default function GiscusComments() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    
    script.setAttribute('data-repo', 'ileilo1215-ship-it/myo-guide'); 
    script.setAttribute('data-repo-id', 'R_kgDOSQiTxA'); 
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOSQiTxM4C8A8L');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return (
    <div className="giscus-wrapper">
      <div ref={ref} />
    </div>
  );
}
