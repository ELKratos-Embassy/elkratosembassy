import Container from "@/components/Container";
import Welcome from "@/components/features/Welcome";
import Benefits from "@/components/features/Benefits";
import Footer from "@/components/Footer";
import Image from "next/image";

const AboutUs = () => {
	return (
		<main>
			<Image
				src="/about/about.svg"
				alt="About US"
				height="1280"
				width="512"
				className="w-full -mb-20"
			/>

			<Container>
				<Welcome about />
				<Benefits about />
			</Container>

			<Container containerClass="bg-[#161722] text-white">
				<Footer />
			</Container>
		</main>
	);
};

export default AboutUs;
