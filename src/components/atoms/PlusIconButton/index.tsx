// TODO check out https://tailwindcss.com/docs/reusing-styles for reusability
// TODO add tooltip

import { Show } from "solid-js";

type Variant = "primary" | "secondary";

interface PropsI {
	handleClick: (e: Event) => void | Promise<void>;
	title: string;
	type: any;
	variant: Variant; // Example;
	showIcon?: boolean;
}
export default function PlusIconButton({
	title,
	type,
	handleClick,
	variant = "primary",
	showIcon = true,
}: PropsI) {
	const variants: { [key in "primary" | "secondary"]: string } = {
		primary: "bg-blue-400",
		secondary: "bg-teal-400",
	};

	return (
		<>
			<button
				//fixme tooltip below
				// data-tooltip-target="plus-tooltip"
				// data-tooltip-style="light"
				type={type}
				onClick={handleClick}
				class={` 
        mb-8 p-2.5 me-2 rounded-full 
        text-white ${variants[variant]} text-sm text-center font-medium   
        inline-flex items-center 
        hover:bg-blue-800 
        focus:ring-4 focus:outline-none focus:ring-blue-300 
        dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
			>
				<Show when={showIcon}>
					<svg
						class="w-6 h-6 text-white dark:text-white"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 12h14m-7 7V5"
						/>
					</svg>
				</Show>
				<span class="sr-only">{title}</span>
				<span>{title}</span>
			</button>
			{/*TODO fix tooltip*/}
			{/*<div*/}
			{/*  id="plus-tooltip"*/}
			{/*  role="tooltip"*/}
			{/*  data-tooltip-trigger="hover"*/}
			{/*  class="absolute z-100 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip"*/}
			{/*>*/}
			{/*  {title}*/}
			{/*  <div class="tooltip-arrow" data-popper-arrow="Test tooltip"></div>*/}
			{/*</div>*/}
		</>
	);
}
