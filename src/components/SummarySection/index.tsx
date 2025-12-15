import React from 'react';
import styles from './styles.module.css';

interface ConceptCard {
  icon: string;
  title: string;
  description: string;
  points: string[];
}

const concepts: ConceptCard[] = [
  {
    icon: '🧠',
    title: 'Neural Architecture',
    description: 'Understanding the brain-inspired systems that power intelligent robots.',
    points: [
      'Deep learning fundamentals',
      'Neural network architectures',
      'Perception & cognition models',
      'Real-time decision making',
    ],
  },
  {
    icon: '🦾',
    title: 'Physical Systems',
    description: 'Master the mechanical and control systems of humanoid robots.',
    points: [
      'Motor control & actuation',
      'Sensor integration',
      'Balance & locomotion',
      'Dexterous manipulation',
    ],
  },
  {
    icon: '🤖',
    title: 'AI Integration',
    description: 'Bridging artificial intelligence with physical embodiment.',
    points: [
      'Vision-Language-Action models',
      'Reinforcement learning',
      'Sim-to-real transfer',
      'Human-robot interaction',
    ],
  },
];

function ConceptCardComponent({ icon, title, description, points }: ConceptCard) {
  return (
    <div className={styles.card}>
      <div className={styles.cardGlow}></div>
      <div className={styles.cardContent}>
        <div className={styles.cardIcon}>{icon}</div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <ul className={styles.cardPoints}>
          {points.map((point, index) => (
            <li key={index} className={styles.cardPoint}>
              <span className={styles.pointBullet}></span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SummarySection(): JSX.Element {
  return (
    <section className={styles.summary}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Core Concepts</span>
          <h2 className={styles.sectionTitle}>
            What You'll <span className={styles.highlight}>Learn</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Explore the fundamental pillars of Physical AI and Humanoid Robotics
            through comprehensive, hands-on learning modules.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {concepts.map((concept, index) => (
            <ConceptCardComponent key={index} {...concept} />
          ))}
        </div>
      </div>
    </section>
  );
}
