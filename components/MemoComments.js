'use client';

import { useState, useEffect } from 'react';

export default function MemoComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newNickname, setNewNickname] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('memos_' + postId);
    if (saved) {
      setComments(JSON.parse(saved));
    }
  }, [postId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newComment = {
      id: Date.now(),
      nickname: newNickname.trim() || '익명의 집사',
      content: newContent,
      date: new Date().toLocaleDateString('ko-KR')
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('memos_' + postId, JSON.stringify(updatedComments));
    
    setNewContent('');
  };

  return (
    <div style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '2px dashed #E2D9CC' }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#5A514A', textAlign: 'center', fontWeight: 'bold' }}>
        📝 집사들의 꿀팁 메모장
      </h3>
      
      {/* 메모지 목록 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', justifyContent: 'center' }}>
        {comments.length === 0 ? (
          <p style={{ color: '#8C8279' }}>아직 메모가 없습니다. 첫 번째 꿀팁을 남겨주세요!</p>
        ) : (
          comments.map(c => (
            <div key={c.id} style={{
              backgroundColor: '#FFFBE6',
              padding: '1.5rem',
              borderRadius: '2px 15px 15px 15px',
              boxShadow: '3px 4px 10px rgba(0,0,0,0.08)',
              width: '280px',
              position: 'relative',
              border: '1px solid #F6E9B2'
            }}>
              <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '15px', backgroundColor: '#FFCF96', opacity: '0.6', borderRadius: '10px' }}></div>
              <p style={{ fontSize: '1.05rem', color: '#333', marginBottom: '1rem', lineHeight: '1.5', wordBreak: 'break-word' }}>{c.content}</p>
              <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold', color: '#C08D5D' }}>{c.nickname}</span>
                <span>{c.date}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#FFF', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h4 style={{ marginBottom: '1rem', color: '#5A514A' }}>나만의 정보 추가하기 💡</h4>
        <input 
          type="text" 
          placeholder="닉네임 (선택)" 
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #E2D9CC', outline: 'none' }}
        />
        <textarea 
          placeholder="이 글과 관련된 생생한 정보나 팁을 메모지에 적어주세요!" 
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows="3"
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #E2D9CC', outline: 'none', resize: 'vertical' }}
        />
        <button 
          type="submit"
          style={{ width: '100%', padding: '1rem', backgroundColor: '#C08D5D', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          메모 붙이기 📌
        </button>
      </form>
    </div>
  );
}
