import Hero from "@/components/ui/Hero";
import Container from "@/components/Container";
import WhatWeDo from "@/components/features/WhatWeDo";
import Welcome from "@/components/features/Welcome";
import Benefits from "@/components/features/Benefits";
import UpcomingSermons from "@/components/features/UpcomingSermons";
import Cta from "@/components/features/Cta";
import BlogPosts from "@/components/features/BlogPosts";
import Footer from "@/components/Footer";

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

			<Cta />
			<Container>
				<BlogPosts />
			</Container>

			<Container containerClass="bg-[#161722] text-white">
				<Footer />
			</Container>
		</main>
	);
}
