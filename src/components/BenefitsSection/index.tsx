import React from 'react';
import styles from './styles.module.css';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: '🚀',
    title: 'Future-Ready Skills',
    description: 'Gain expertise in one of the fastest-growing technology sectors, preparing you for careers in robotics, AI research, and automation.',
  },
  {
    icon: '💡',
    title: 'Practical Knowledge',
    description: 'Learn through hands-on examples and real-world applications, bridging the gap between theory and implementation.',
  },
  {
    icon: '🔬',
    title: 'Cutting-Edge Research',
    description: 'Explore the latest advancements in embodied AI, from foundation models to state-of-the-art robotic systems.',
  },
  {
    icon: '🌐',
    title: 'Industry Relevance',
    description: 'Understand technologies used by leading robotics companies like Boston Dynamics, Tesla, and Figure AI.',
  },
  {
    icon: '🎯',
    title: 'Structured Learning',
    description: 'Follow a carefully designed curriculum that builds from fundamentals to advanced topics progressively.',
  },
  {
    icon: '🤝',
    title: 'Community Support',
    description: 'Join a growing community of learners and practitioners passionate about Physical AI and Robotics.',
  },
];

function BenefitCard({ icon, title, description }: Benefit) {
  return (
    <div className={styles.benefitCard}>
      <div className={styles.benefitIcon}>{icon}</div>
      <div className={styles.benefitContent}>
        <h3 className={styles.benefitTitle}>{title}</h3>
        <p className={styles.benefitDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function BenefitsSection(): JSX.Element {
  return (
    <section className={styles.benefits}>
      <div className={styles.backgroundPattern}></div>

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Why Learn With Us</span>
          <h2 className={styles.sectionTitle}>
            Benefits of <span className={styles.highlight}>Learning</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Discover why Physical AI & Humanoid Robotics is the skill of the future
            and how this book can accelerate your learning journey.
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>

        <div className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>Ready to Start Your Journey?</h3>
            <p className={styles.ctaDescription}>
              Begin your exploration into the world of Physical AI and Humanoid Robotics today.
            </p>
          </div>
          <a href="/docs/intro" className={styles.ctaButton}>
            <span>Get Started Now</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
