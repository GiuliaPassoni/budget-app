import styles from "./style.module.css";
import { JSX, Show } from "solid-js";

interface IProps {
	onClick(): void;
	id?: string;
	text?: string;
	type?: "submit" | "reset" | "button" | undefined;
	styleClass?: string; //todo make it work better or add primary and secondary styling
	children?: JSX.Element;
	disabled?: boolean;
	tooltipContent?: string;
	leftIcon?: JSX.Element;
}

export default function Button(props: IProps) {
	const type = () => props.type;
	const id = () => props.id;
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
	const tooltipContent = () => props.tooltipContent;
	// const handleClick = props.onClick;
	return (
		<>
			<button
				data-tooltip-target={`tooltip-${id() ?? ""}`}
				id={id() ?? ""}
				type={type() ?? undefined}
				onClick={(e) => {
					e.preventDefault();
					props.onClick();
				}}
				class={`${styles.buttonStyle} ${classParser}`}
				disabled={disabled()}
			>
				<Show when={leftIcon()}>
					{/*	i.iconName ? iconMap[i.iconName]?.() : ""*/}
					{leftIcon()}
				</Show>
				{text() ? text() : null}
				{children() ? children() : null}
			</button>
			{/*todo fix tooltip*/}
			<div
				id={`tooltip-${id() ?? ""}`}
				role="tooltip"
				class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
			>
				{tooltipContent()}
				<div class="tooltip-arrow" data-popper-arrow></div>
			</div>
		</>
	);
}
