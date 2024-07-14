import { Show } from "solid-js";
import "./style.scss";

interface IProps {
	icon: any;
	title: string;
	children?: any;
	handleClick?(): void;
}

export default function TWCardWithIcon({
	icon,
	title,
	children,
	handleClick,
}: IProps) {
	return (
		<a href="#" onClick={handleClick} class="card-w-icon-link">
			<div class="block mx-auto w-fit">{icon}</div>
			<h4>{title}</h4>
			<Show when={children}>
				<p>{children}</p>
			</Show>
		</a>
	);
}
