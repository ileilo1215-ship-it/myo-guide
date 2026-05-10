import Image from 'next/image';
import styles from './friends.module.css';

export const metadata = {
  title: 'Friends | 묘한 가이드',
};

import { friendsList } from '@/lib/friends';

export default function FriendsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>친구들</h1>
        <p className={styles.subtitle}>우리가 알아야 할, 생명을 살리는 멋진 단체와 매체들</p>
      </div>

      <div className={styles.grid}>
        {friendsList.map((friend, index) => (
          <div key={index} className={styles.card}>
            
            <div className={styles.imageWrapper}>
              <Image src={friend.image} alt={friend.name} fill style={{ objectFit: 'cover' }} />
            </div>

            <div className={styles.cardContent}>
              <div className={styles.topRow}>
                <div className={styles.tags}>
                  {friend.tags.map((tag, i) => (
                    <span key={i} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <a href={friend.url} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>
                  방문하기 <span className={styles.arrow}>→</span>
                </a>
              </div>
              
              <div>
                <h2 className={styles.cardTitle}>{friend.name}</h2>
                <p className={styles.description}>
                  {friend.description}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
