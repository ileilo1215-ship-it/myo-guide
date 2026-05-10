import React from 'react';
import A4Layout from '@/components/A4Layout';
import { educationalContent } from '@/lib/educational-content';
import { getPostData } from '@/lib/posts';
import styles from './Worksheet.module.css';

export default async function WorksheetPage({ params }) {
  const { id } = await params;
  const content = educationalContent[id];
  const postData = await getPostData(id);

  if (!content) return <div>자료를 찾을 수 없습니다.</div>;

  const { worksheet } = content;

  return (
    <A4Layout title={content.title} subtitle="학생용 활동지" character="✏️" year={content.year}>
      <div className={styles.container}>
        {postData.image && (
          <div className={styles.heroImageWrapper}>
            <img src={postData.image} alt="배경 이미지" className={styles.heroImage} />
            <div className={styles.heroOverlay}>
              <p className={styles.heroText}>{postData.coreQuestion || "함께 생각해보아요!"}</p>
            </div>
          </div>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.number}>01</span> 생각 열기 (퀴즈)
          </h2>
          <div className={styles.quizBox}>
            <p className={styles.question}>{worksheet.quiz.question}</p>
            <div className={styles.options}>
              {worksheet.quiz.options.map((opt, i) => (
                <div key={i} className={styles.option}>
                  <div className={styles.checkbox}></div>
                  <span>{i + 1}. {opt}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.number}>02</span> 주요 내용 확인 (빈칸 채우기)
          </h2>
          <div className={styles.fillInBox}>
            {worksheet.fillIn.map((item, i) => (
              <div key={i} className={styles.fillInItem}>
                {item.text.split('(').map((part, idx) => {
                  if (idx === 0) return part;
                  const subParts = part.split(')');
                  return (
                    <React.Fragment key={idx}>
                      <span className={styles.blank}></span>
                      {subParts[1]}
                    </React.Fragment>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        <div className={styles.gridSection}>
          <section className={`${styles.section} ${styles.creativeSection}`}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.number}>03</span> {worksheet.creative.title}
            </h2>
            <div className={styles.creativeBox}>
              <p className={styles.description}>{worksheet.creative.description}</p>
              <div className={styles.drawingArea}>
                <div className={styles.drawPlaceholder}>이곳에 자유롭게 그려보세요</div>
              </div>
            </div>
          </section>

          <section className={`${styles.section} ${styles.additionalSection}`}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.number}>04</span> {worksheet.additionalTask.title}
            </h2>
            <div className={styles.additionalBox}>
              <p className={styles.description}>{worksheet.additionalTask.description}</p>
              <div className={styles.writingLines}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
              </div>
            </div>
          </section>
        </div>

        <section className={styles.studentInfo}>
          <div className={styles.infoField}>제 ( )학년 ( )반 ( )번</div>
          <div className={styles.infoField}>이름: ( )</div>
        </section>
      </div>
    </A4Layout>
  );
}
