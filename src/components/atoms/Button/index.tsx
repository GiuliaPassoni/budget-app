import styles from "./style.module.css";
import { JSX } from "solid-js";

interface IProps {
	onClick(): void;
	text?: string;
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
	const classParser = props.styleClass
		? props.styleClass
				.split(" ")
				.map((cls) => styles[cls] || cls)
				.join(" ")
		: styles.primary;
	const children = () => props.children ?? null;
	const disabled = () => props.disabled;
	// const handleClick = props.onClick;
	return (
		<button
			type={type() ?? undefined}
			onClick={props.onClick} //todo check if this still works, else, revert to props.onClick
			class={`${styles.buttonStyle} ${classParser}`}
			disabled={disabled()}
		>
			{leftIcon() ? leftIcon() : null}
			{text() ? text() : null}
			{children() ? children() : null}
		</button>
	);
}
