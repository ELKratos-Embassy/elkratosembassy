import Container from '@/components/Container';
import Welcome from '@/components/features/Welcome';
import Benefits from '@/components/features/Benefits';
import Footer from '@/components/Footer';
import Team from '@/components/features/Team';
import { aboutUs } from '@/constants';
import Header from '@/components/features/Header';

const {
  heading: { text, caption },
} = aboutUs;

const AboutUs = () => {
  return (
    <>
      <main className="pb-8 sm:pb-16 md:pb-18">
        <Header text={text} caption={caption} />

        <Container>
          <Welcome about />
          <Benefits about />

          <Team />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
