'use client';

import { useState, useEffect } from 'react';

const REACTION_TYPES = [
  { id: 'empathize', emoji: '🐾', label: '공감해요', color: '#FF6B6B', bg: '#FFE5E5', border: '#FFB3B3' },
  { id: 'sad', emoji: '😢', label: '마음 아파요', color: '#0084D1', bg: '#E5F6FF', border: '#99D6FF' },
  { id: 'support', emoji: '💪', label: '함께할게요', color: '#E59500', bg: '#FFF0D4', border: '#FFD68A' },
  { id: 'learned', emoji: '🌿', label: '알게 됐어요', color: '#2E8B57', bg: '#E5FFE5', border: '#B3E6B3' },
  { id: 'angry', emoji: '😡', label: '화가 나요', color: '#D9381E', bg: '#FFCCCC', border: '#FF9999' }
];

export default function ReactionButtons({ postId }) {
  const [reactions, setReactions] = useState({ empathize: 0, sad: 0, support: 0, learned: 0, angry: 0 });
  const [userReaction, setUserReaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial user state from localStorage
    const savedUserReaction = localStorage.getItem('userReaction_' + postId);
    if (savedUserReaction) {
      setUserReaction(savedUserReaction);
    }

    // Fetch global counts
    fetch(`/api/reactions?postId=${postId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setReactions(prev => ({ ...prev, ...data }));
        }
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [postId]);

  const handleReact = async (type) => {
    if (isLoading) return;
    
    let oldType = userReaction;
    let newType = type;
    
    // If clicking the same button, remove reaction
    if (userReaction === type) {
      newType = 'remove';
    }

    // Optimistic UI Update
    const newReactions = { ...reactions };
    if (oldType && newReactions[oldType] > 0) {
      newReactions[oldType] -= 1;
    }
    if (newType !== 'remove') {
      newReactions[newType] += 1;
    }
    
    setReactions(newReactions);
    setUserReaction(newType === 'remove' ? null : newType);

    if (newType === 'remove') {
      localStorage.removeItem('userReaction_' + postId);
    } else {
      localStorage.setItem('userReaction_' + postId, newType);
    }

    // Background sync
    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, type: newType, oldType })
      });
      const data = await res.json();
      if (data.success && data.reactions) {
        setReactions(prev => ({ ...prev, ...data.reactions }));
      }
    } catch (err) {
      console.error('Failed to sync reaction', err);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '3rem 0', padding: '2rem', backgroundColor: '#FDFBF7', borderRadius: '15px', border: '1px dashed #E2D9CC' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#5A514A' }}>이 글에 공감하시나요? 🐾</h3>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        {REACTION_TYPES.map(reaction => {
          const isSelected = userReaction === reaction.id;
          return (
            <button 
              key={reaction.id}
              onClick={() => handleReact(reaction.id)}
              disabled={isLoading}
              style={{ 
                background: isSelected ? reaction.bg : '#FFF', 
                border: `2px solid ${reaction.border}`, 
                borderRadius: '30px', 
                padding: '0.6rem 1rem', 
                cursor: isLoading ? 'wait' : 'pointer', 
                fontSize: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                transition: 'all 0.2s',
                boxShadow: isSelected ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              <span>{reaction.emoji}</span>
              <span style={{ color: '#5A514A', fontSize: '0.9rem' }}>{reaction.label}</span>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: reaction.color, marginLeft: '0.2rem' }}>
                {reactions[reaction.id] || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
