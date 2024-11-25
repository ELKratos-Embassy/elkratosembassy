import { home, section } from "@/constants";
import Heading from "../ui/Heading";
import Post from "../Post";
const BlogPosts = () => {
	const {
		blog: {
			heading: { text, caption },
			posts,
		},
	} = home;
	return (
		<div>
			<Heading caption={caption} text={text} section={section.main} />
			<div className="flex flex-col flex-wrap md:flex-row justify-center gap-6 my-16">
				{posts.map((post) => (
					<Post key={post.id} post={post} />
				))}
			</div>
		</div>
	);
};

export default BlogPosts;
