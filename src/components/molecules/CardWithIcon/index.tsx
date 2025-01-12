import { createSignal, Show } from "solid-js";
import styles from "./style.module.css";

interface IProps {
	icon: any;
	colour: string;
	title: string;
	selected?: boolean;
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

	return (
		<button
			onClick={(e) => {
				e.preventDefault();
				handleClick();
			}}
			class={`${styles.cardWithIcon}`}
		>
			<div
				class={`${styles.iconContainer} ${shadeClass()} ${props.selected ? styles.selectedCard : ""}`}
			>
				{icon()}
			</div>
			<h4
				class={`${styles.description} ${props.selected ? styles.selectedCard : ""}`}
			>
				{title()}
			</h4>
			<Show when={children()}>
				<p class={styles.children}>{children()}</p>
			</Show>
		</button>
	);
}
