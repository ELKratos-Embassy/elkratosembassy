import Container from "@/components/Container";
import Welcome from "@/components/features/Welcome";
import Benefits from "@/components/features/Benefits";
import Footer from "@/components/Footer";
import Team from "@/components/features/Team";
import { aboutUs } from "@/constants";
import Header from "@/components/features/Header";

const AboutUs = () => {
	const {
		heading: { text, caption, bg },
	} = aboutUs;
	return (
		<main>
			<Header text={text} caption={caption} bg={bg} />

			<Container>
				<Welcome about />
				<Benefits about />

				<Team />
			</Container>

			<Container containerClass="bg-[#161722] text-white">
				<Footer />
			</Container>
		</main>
	);
};

export default AboutUs;
