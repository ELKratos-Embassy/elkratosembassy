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
      <main>
        <Container>
          <UpcomingSermons />
        </Container>

        {/* Blog Posts */}
        <EventPosts title="View All Events" />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Sermons;
