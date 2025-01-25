import styles from "./style.module.css";
import { JSX } from "solid-js";

interface CardPropsI {
	title?: string;
	children?: JSX.Element | string;
}

export default function Card(props: CardPropsI) {
	return (
		<>
			<div class={styles.cardContainer}>
				<h5 class={styles.cardTitle}>{props.title}</h5>
				<p class={styles.cardChildren}>{props.children}</p>
			</div>
		</>
	);
}
