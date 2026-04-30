
'use client';

import { useState, useEffect } from 'react';

export default function ReactionButtons({ postId }) {
  const [reactions, setReactions] = useState({ love: 0, cat: 0, clap: 0 });
  const [userReacted, setUserReacted] = useState({ love: false, cat: false, clap: false });

  useEffect(() => {
    const saved = localStorage.getItem('reactions_' + postId);
    if (saved) {
      setReactions(JSON.parse(saved));
    }
    const userSaved = localStorage.getItem('userReacted_' + postId);
    if (userSaved) {
      setUserReacted(JSON.parse(userSaved));
    }
  }, [postId]);

  const handleReact = (type) => {
    if (userReacted[type]) return;

    const newReactions = { ...reactions, [type]: reactions[type] + 1 };
    const newUserReacted = { ...userReacted, [type]: true };

    setReactions(newReactions);
    setUserReacted(newUserReacted);

    localStorage.setItem('reactions_' + postId, JSON.stringify(newReactions));
    localStorage.setItem('userReacted_' + postId, JSON.stringify(newUserReacted));
  };

  return (
    <div style={{ textAlign: 'center', margin: '3rem 0', padding: '2rem', backgroundColor: '#FDFBF7', borderRadius: '15px', border: '1px dashed #E2D9CC' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#5A514A' }}>이 글에 공감하시나요? 🐾</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
        <button 
          onClick={() => handleReact('love')}
          style={{ background: userReacted.love ? '#FFE5E5' : '#FFF', border: '2px solid #FFB3B3', borderRadius: '30px', padding: '0.5rem 1.2rem', cursor: userReacted.love ? 'default' : 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
        >
          ❤️ <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#FF6B6B' }}>{reactions.love}</span>
        </button>
        <button 
          onClick={() => handleReact('cat')}
          style={{ background: userReacted.cat ? '#FFF0D4' : '#FFF', border: '2px solid #FFD68A', borderRadius: '30px', padding: '0.5rem 1.2rem', cursor: userReacted.cat ? 'default' : 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
        >
          😻 <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#E59500' }}>{reactions.cat}</span>
        </button>
        <button 
          onClick={() => handleReact('clap')}
          style={{ background: userReacted.clap ? '#E5F6FF' : '#FFF', border: '2px solid #99D6FF', borderRadius: '30px', padding: '0.5rem 1.2rem', cursor: userReacted.clap ? 'default' : 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
        >
          👏 <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0084D1' }}>{reactions.clap}</span>
        </button>
      </div>
    </div>
  );
}
