import Container from "@/components/Container";
import Footer from "@/components/Footer";
import UpcomingSermons from "@/components/features/UpcomingSermons";
import BlogPosts from "@/components/features/BlogPosts";
import Image from "next/image";

const Sermons = () => (
	<main>
		<Image
			src="/sermon/sermon.svg"
			alt="About US"
			height="1280"
			width="512"
			className="w-full"
		/>
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

export default Sermons;
