'use client';

import React from 'react';

const PostButton = ({ href, children }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 24px',
        backgroundColor: '#2D6A4F',
        color: '#FFFFFF',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '1rem',
        marginTop: '1.5rem',
        marginBottom: '1.5rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 12px rgba(45, 106, 79, 0.2)',
        border: 'none',
        cursor: 'pointer',
        width: 'fit-content'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#1a4731';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(45, 106, 79, 0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#2D6A4F';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 106, 79, 0.2)';
      }}
    >
      {children}
    </a>
  );
};

export default PostButton;
