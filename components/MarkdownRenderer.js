'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PostButton from './PostButton';

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          const label = children?.toString() || '';
          if (label.includes('→')) {
            return <PostButton href={href}>{children}</PostButton>;
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
