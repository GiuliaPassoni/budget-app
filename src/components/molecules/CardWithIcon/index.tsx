import { Show } from "solid-js";
import { pastelColors } from "~/helpers/colour_helpers";
import "./style.css";

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
		<a href="#" onClick={handleClick} class="card">
			<div class={`icon-container ${bgColour?.colourClass}`}>{icon}</div>
			<h4 class="description">{title}</h4>
			<Show when={children}>
				<p class="children">{children}</p>
			</Show>
		</a>
	);
}
