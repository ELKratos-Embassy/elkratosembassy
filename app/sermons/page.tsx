import Container from '@/components/Container';
import Footer from '@/components/Footer';
import UpcomingSermons from '@/components/features/UpcomingSermons';
import Header from '@/components/features/Header';
import { sermon } from '@/constants';
import EventPosts from '@/components/features/EventPosts';
import type { Metadata } from 'next';

// Add metadata for better SEO
export const metadata: Metadata = {
  title: 'Sermons | El Kratos Embassy',
  description:
    'Join our transformative sermons where spiritual wisdom meets practical life application. Experience growth through measured, intentional spiritual development.',
};

const Sermons = () => {
  const {
    heading: { text, caption },
  } = sermon;

  return (
    <>
      <Header text={text} caption={caption} />

      <article className="min-h-screen">
        <Container>
          <UpcomingSermons />
        </Container>

        {/* All Events Section */}
        <section className="mt-16">
          <EventPosts title="View All Events" />
        </section>
      </article>

      <Footer />
    </>
  );
};

export default Sermons;
