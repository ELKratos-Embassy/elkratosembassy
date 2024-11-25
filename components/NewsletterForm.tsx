"use client";

import Button from "./ui/Button";
import { home } from "@/constants";

const NewsletterForm = () => {
	const {
		footer: {
			subscribe: {
				form: {
					input: { label, placeholder },
					btn: { text },
				},
			},
		},
	} = home;

	const handleSubmit = () => {};

	return (
		<form onSubmit={handleSubmit}>
			<input
				aria-label={label}
				type="text"
				placeholder={placeholder}
				className="p-5 bg-transparent border opacity-35 placeholder:opacity-80  focus:opacity-100 border-opacity-75 -mr-1.5 border-r-0 rounded-lg transition-all -z-5 focus:outline-none"
			/>

			<Button text={text} variant="primary" />
		</form>
	);
};

export default NewsletterForm;
