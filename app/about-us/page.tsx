import Container from '@/components/Container';
import Welcome from '@/components/features/Welcome';
import Benefits from '@/components/features/Benefits';
import Footer from '@/components/Footer';
import Team from '@/components/features/Team';
import { aboutUs } from '@/constants';
import Header from '@/components/features/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | El Kratos Embassy',
  description:
    'Learn about El Kratos Embassy - a transformative faith community where spiritual resilience meets everyday life. Discover our vision, mission, and values.',
};

const AboutUs = () => {
  const {
    heading: { text, caption },
  } = aboutUs;

  return (
    <>
      <div className="text-white">
        <Header text={text} caption={caption} />
      </div>

      <main className="bg-white">
        <Container>
          <section className="py-12 md:py-20">
            <Welcome about />
          </section>

          <section className="py-12 md:py-20 bg-grey rounded-lg">
            <Benefits about />
          </section>

          <section className="py-12 md:py-20">
            <Team />
          </section>
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default AboutUs;
