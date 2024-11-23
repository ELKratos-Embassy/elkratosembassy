import Heading from "./ui/Heading";

const Post = ({
	post: { caption, text, author, date, message },
}: PostProps) => {
	return (
		<section className="bg-light-orange px-8 py-12 w-full max-w-sm sm:w-80 rounded-lg border-[#FFD0A0] hover:border-b-[16px] transition-all">
			<div className="max-w-64">
				<Heading caption={caption} text={text} />
			</div>
			<p className="mt-4 mb-8 opacity-0.8">{message}</p>
			<div className="my-6">
				<h6 className="font-semibold">{author}</h6>
				<p>{date}</p>
			</div>
		</section>
	);
};

export default Post;
