import { section } from "@/constants";

export default function Heading({
	caption,
	text,
	section: state,
}: HeadingProps) {
	return (
		<div className="flex flex-col gap-4 justify-center text-center mx-auto max-w-[750px]">
			{state === section.main ? (
				<>
					<p>{caption.toUpperCase()}</p>
					<h2 className="text-h2 text-black">{text}</h2>
				</>
			) : state === section.gallery ? (
				<>
					<p>{caption.toUpperCase()}</p>
					<h4 className="text-h4 text-black">{text}</h4>
				</>
			) : (
				<div className="space-y-4 text-left">
					<p className="text-[12px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-100 to-gradient-200">
						{caption.toUpperCase()}
					</p>
					<h5 className="text-h5 text-left text-black font-bold">{text}</h5>
				</div>
			)}
		</div>
	);
}
