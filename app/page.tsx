import Hero from '@/components/ui/Hero';
import Container from '@/components/Container';
import WhatWeDo from '@/components/features/WhatWeDo';
import Welcome from '@/components/features/Welcome';
import Benefits from '@/components/features/Benefits';
import UpcomingSermons from '@/components/features/UpcomingSermons';
import Cta from '@/components/features/Cta';
import BlogPosts from '@/components/features/BlogPosts';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

// Add metadata for better SEO
export const metadata: Metadata = {
  title: 'Home | El Kratos Embassy',
  description:
    'Welcome to El Kratos Embassy - Where Spiritual Resilience Meets Life. Discover our transformative faith community and grow in both spiritual and personal life.',
};

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Container>
          <Welcome />
          <WhatWeDo />
          <Benefits />
          <UpcomingSermons />
        </Container>
        <Cta />
        <Container>
          <BlogPosts />
        </Container>
      </main>
      <Footer />
    </>
  );
}
