import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function HeroSection(): JSX.Element {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.gridOverlay}></div>
        <div className={styles.glowOrb}></div>
        <div className={styles.glowOrb2}></div>
      </div>

      <div className={styles.heroContent}>
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>📖</span>
          <span>Comprehensive Learning Guide</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleLine}>Physical AI &</span>
          <span className={styles.titleGradient}>Humanoid Robotics</span>
          <span className={styles.titleLine}>System</span>
        </h1>

        <p className={styles.subtitle}>
          Master the art of building intelligent humanoid robots. From neural networks
          to motor control, explore the cutting-edge intersection of artificial intelligence
          and physical robotics systems.
        </p>

        <div className={styles.heroActions}>
          <Link to="/docs/intro" className={styles.primaryButton}>
            <span>Read Book</span>
            <svg
              className={styles.buttonIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <Link to="/docs/module-1/the-robotic-nervous-system" className={styles.secondaryButton}>
            <span>Explore Modules</span>
          </Link>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>4+</span>
            <span className={styles.statLabel}>Modules</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>20+</span>
            <span className={styles.statLabel}>Chapters</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>∞</span>
            <span className={styles.statLabel}>Possibilities</span>
          </div>
        </div>
      </div>
    </section>
  );
}
