import "./style.css";
import { JSX } from "solid-js";

interface IProps {
	onClick(): void;
	text: string;
	type?: "submit" | "reset" | "button" | undefined;
	styleClass?: string; //todo make it work better or add primary and secondary styling
	children?: JSX.Element;
	disabled?: boolean;
	leftIcon?: JSX.Element;
}

export default function Button(props: IProps) {
	const type = () => props.type;
	const text = () => props.text;
	const leftIcon = () => props.leftIcon;
	const classParser = String(props.styleClass ?? "primary");
	const children = () => props.children ?? null;
	const disabled = () => props.disabled;
	// const handleClick = props.onClick;
	return (
		<button
			type={type() ?? undefined}
			onClick={props.onClick} //todo check if this still works, else, revert to props.onClick
			class={`button-style ${classParser}`}
		>
			{leftIcon() ? leftIcon() : null}
			{text()}
			{children() ? children() : null}
		</button>
	);
}
