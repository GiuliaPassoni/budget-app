import { createSignal, Show } from "solid-js";
import { colorOptions } from "~/helpers/colour_helpers";
import "./style.css";

interface IProps {
	icon: any;
	colour: string;
	title: string;
	children?: any;
	handleClick?(): void;
}

export default function CardWithIcon(props: IProps) {
	const colour = () => props.colour;
	const icon = () => props.icon;
	const title = () => props.title;
	const children = () => props.children;
	// syntax for optional prop fn and there are no props. If there were props, then it would be simply
	// const handleClick = (prop: typeprop) => props.handleClick?.(prop)
	const handleClick = (
		...args: Parameters<NonNullable<typeof props.handleClick>>
	) => props.handleClick?.(...args);

	const [shadeClass, setShadeClass] = createSignal("");
	// check if colour has shade
	if (!/\d/.test(colour())) {
		setShadeClass(`bg-${colour()}-500`);
	} else {
		setShadeClass(`bg-${colour()}`);
	}

	console.debug(colour(), shadeClass());
	return (
		<a href="#" onClick={handleClick} class="card">
			<div class={`icon-container ${shadeClass()}`}>{icon()}</div>
			<h4 class="description">{title()}</h4>
			<Show when={children()}>
				<p class="children">{children()}</p>
			</Show>
		</a>
	);
}
