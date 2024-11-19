import clsx from "clsx";

type ButtonProps = {
	text: string;
	variant?: "primary" | "secondary" | "nav";
};

export default function Button({ text, variant }: ButtonProps) {
	return (
		<button
			className={clsx(
				"w-64 h-16 btn px-4 py-2 my-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-300 ease-in-out",
				variant === "primary"
					? "bg-primary text-secondary-black hover:bg-primary-hover"
					: variant === "secondary"
					? "bg-secondary-black text-primary hover:text-white"
					: variant === "nav"
					? "bg-transparent text-white hover:text-red-400"
					: "bg-gray-200"
			)}
		>
			{text}
		</button>
	);
}
