import "./style.css";
import { JSX } from "solid-js";

interface IProps {
	onClick(): void;
	text: string;
	children?: JSX.Element;
	disabled?: boolean;
}

export default function Button(props: IProps) {
	const text = () => props.text;
	const children = () => props.children ?? null;
	const disabled = () => props.disabled;
	// const handleClick = props.onClick;
	return (
		<button
			onClick={props.onClick} //todo check if this still works, else, revert to props.onClick
			class="button-style"
		>
			{text()}
			{children() ? children() : null}
		</button>
	);
}
