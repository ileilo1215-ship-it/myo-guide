import React from 'react';
import A4Layout from '@/components/A4Layout';
import { educationalContent } from '@/lib/educational-content';
import styles from './Guide.module.css';

export default async function GuidePage({ params }) {
  const { id } = await params;
  const content = educationalContent[id];

  if (!content) return <div>자료를 찾을 수 없습니다.</div>;

  const { guide } = content;

  return (
    <A4Layout title={content.title} subtitle="교사용 수업 가이드" character="👨‍🏫" year={content.year}>
      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🎯 수업 목표</h2>
          </div>
          <ul className={styles.objectivesList}>
            {guide.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>⏱️ 수업 흐름 (타임라인)</h2>
          </div>
          <div className={styles.timeline}>
            {guide.timeline.map((step, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timeBadge}>{step.time}</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepName}>{step.step}</div>
                  <div className={styles.stepActivity}>{step.activity}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.twoColumn}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>📜 주요 법령 요약</h2>
            </div>
            <table className={styles.legalTable}>
              <thead>
                <tr>
                  <th>항목</th>
                  <th>내용 및 처벌 수위</th>
                </tr>
              </thead>
              <tbody>
                {guide.legalSummary.map((item, i) => (
                  <tr key={i}>
                    <td className={styles.tableLabel}>{item.item}</td>
                    <td>{item.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>💡 지도 팁</h2>
            </div>
            <div className={styles.tipsContainer}>
              {guide.tips.map((tip, i) => (
                <div key={i} className={styles.tipBox}>
                  <span className={styles.tipIcon}>📌</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </A4Layout>
  );
}
