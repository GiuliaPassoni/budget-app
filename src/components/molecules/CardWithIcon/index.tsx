import { Show } from "solid-js";

interface IProps {
	icon: any;
	title: string;
	children?: any;
	handleClick?(): void;
}

export default function CardWithIcon({
	icon,
	title,
	children,
	handleClick,
}: IProps) {
	return (
		<a
			href="#"
			onClick={handleClick}
			class="block max-w-100px p-2 m-2 px-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
		>
			<div class="block mx-auto w-fit">{icon}</div>
			<h4 class="my-1 mx-auto w-fit text-gray-900 dark:text-white">{title}</h4>
			<Show when={children}>
				<p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
					{children}
				</p>
			</Show>
		</a>
	);
}
