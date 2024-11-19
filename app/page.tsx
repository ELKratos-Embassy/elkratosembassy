import Container from '@/components/Container';
import Welcome from '@/components/features/Welcome';
import WhatWeDo from '@/components/features/WhatWeDo';
import Hero from '@/components/ui/Hero';

export default function Home() {
  return (
    <main>
      <Hero />

      <Container>
        <WhatWeDo />
        <Welcome />
      </Container>
    </main>
  );
}
