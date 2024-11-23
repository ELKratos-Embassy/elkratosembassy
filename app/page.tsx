import Container from '@/components/Container';
import Benefits from '@/components/features/Benefits';
import UpcomingSermons from '@/components/features/UpcomingSermons';
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

      <Container>
        <UpcomingSermons />
      </Container>
    </main>
  );
}
