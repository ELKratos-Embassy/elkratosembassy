import Image from "next/image";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import { home } from "@/constants";
import clsx from "clsx";

export default function Welcome() {
	const {
		welcome: {
			heading: { text, caption },
			message,
			btn,
			gallery,
			footer,
		},
	} = home;

	return (
		<div className="md:w-10/12 mx-auto mt-32">
			<div className="w-full md:w-2/3 mx-auto">
				<Heading caption={caption} text={text} />
				<p className="mt-8 mb-14 text-center">{message}</p>
				<div className=" flex justify-center">
					<Button text={btn} variant="primary" />
				</div>
			</div>

			<div className="flex flex-row justify-center items-start gap-6 -mt-4">
				{gallery.map(({ src, alt, width, height }, index) => (
					<Image
						key={alt}
						src={src}
						width={width}
						height={height}
						alt={alt}
						className={clsx(index === 1 && "mt-12")}
					/>
				))}
			</div>
			<div className="md:w-3/6 mx-auto flex flex-col gap-4 justify-center mt-16">
				<Heading variant="4" caption={footer.caption} text={footer.text} />
				<p className="text-center">{footer.message}</p>

				<button className="flex flex-wrap flex-row justify-center items-center gap-1">
					<span>{footer.btn.text}</span>
					<Image
						src={footer.btn.icon}
						width={18}
						height={10}
						alt="arrow right"
					/>
				</button>
			</div>
		</div>
	);
}
