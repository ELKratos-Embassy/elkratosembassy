import Container from '@/components/Container';
import Footer from '@/components/Footer';
import UpcomingSermons from '@/components/features/UpcomingSermons';
import BlogPosts from '@/components/features/BlogPosts';
import Header from '@/components/features/Header';
import { sermon } from '@/constants';

const Sermons = () => {
  const {
    heading: { text, caption },
  } = sermon;

  return (
    <main>
      <Header text={text} caption={caption} />

      <Container>
        <UpcomingSermons />
      </Container>

      <Container>
        <BlogPosts />
      </Container>

      <Container containerClass="bg-[#161722] text-white">
        <Footer />
      </Container>
    </main>
  );
};

export default Sermons;
