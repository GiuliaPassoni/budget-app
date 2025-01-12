import styles from "./style.module.css";

export default function Card(props: any) {
	return (
		<>
			<div class={styles.cardContainer}>
				<h5 class={styles.cardTitle}>{props.title}</h5>
				<p class={styles.cardChildren}>{props.children}</p>
			</div>
		</>
	);
}
