import Container from '@/components/Container';
import Footer from '@/components/Footer';
import UpcomingSermons from '@/components/features/UpcomingSermons';
import Header from '@/components/features/Header';
import { sermon } from '@/constants';

import EventPosts from '@/components/features/EventPosts';

const Sermons = () => {
  const {
    heading: { text, caption },
  } = sermon;

  return (
    <div>
      <Header text={text} caption={caption} />
      <main className="pb-32 px-24">
        <Container>
          <UpcomingSermons />
        </Container>

        {/* Blog Posts */}
        <EventPosts title="View All Events" />
      </main>
      {/* Footer */}
      <Container containerClass="bg-[#161722] text-white">
        <Footer />
      </Container>
    </div>
  );
};

export default Sermons;
