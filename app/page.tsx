import Container from '@/components/Container';
import Benefits from '@/components/features/Benefits';
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

      <Container containerClass="bg-grey">
        <Benefits />
      </Container>
    </main>
  );
}
