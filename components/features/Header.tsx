import clsx from "clsx";
import React from "react";

const Header = ({
	bg,
	caption,
	text,
}: {
	bg: string;
	caption: string;
	text: string;
}) => {
	return (
		<header
			className={clsx(
				"space-y-4 h-[409px] flex flex-col justify-center pl-28",
				bg
			)}
		>
			<p>{caption.toUpperCase()}</p>
			<h2 className="text-h2 text-left text-black font-bold">{text}</h2>
		</header>
	);
};

export default Header;
