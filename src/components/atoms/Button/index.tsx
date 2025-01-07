import "./style.css";
import { JSX } from "solid-js";

interface IProps {
	onClick(): void;
	text: string;
	styleClass?: string; //todo make it work better or add primary and secondary styling
	children?: JSX.Element;
	disabled?: boolean;
}

export default function Button(props: IProps) {
	const text = () => props.text;
	const classParser = String(props.styleClass);
	const children = () => props.children ?? null;
	const disabled = () => props.disabled;
	// const handleClick = props.onClick;
	return (
		<button
			onClick={props.onClick} //todo check if this still works, else, revert to props.onClick
			class={`button-style ${classParser}`}
		>
			{text()}
			{children() ? children() : null}
		</button>
	);
}
