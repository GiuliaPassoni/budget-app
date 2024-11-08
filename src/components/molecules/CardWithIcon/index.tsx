import { Show } from "solid-js";
import { pastelColors } from "~/helpers/colour_helpers";

interface IProps {
	icon: any;
	colour?: string;
	title: string;
	children?: any;
	handleClick?(): void;
}

export default function CardWithIcon({
	icon,
	colour,
	title,
	children,
	handleClick,
}: IProps) {
	const bgColour = pastelColors.find((i) => i.name == colour);
	return (
		<a
			href="#"
			onClick={handleClick}
			class={`
			col-span-4
			block
			max-w-100px
			m-2
			p-2 px-auto
			${bgColour?.colourClass} border border-gray-200
			rounded-lg
			shadow dark:bg-gray-800 dark:border-gray-700
			`}
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
