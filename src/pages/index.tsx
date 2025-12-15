import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HeroSection from '@site/src/components/HeroSection';
import SummarySection from '@site/src/components/SummarySection';
import BenefitsSection from '@site/src/components/BenefitsSection';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Physical AI & Humanoid Robotics System"
      description="Master the art of building intelligent humanoid robots. Explore the cutting-edge intersection of artificial intelligence and physical robotics systems."
    >
      <main>
        <HeroSection />
        <SummarySection />
        <BenefitsSection />
      </main>
    </Layout>
  );
}
