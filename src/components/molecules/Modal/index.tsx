import { JSX } from "solid-js";
import CloseModalIconButton from "~/components/atoms/CloseModalIconButton";

import styles from "./style.module.css";

interface PropsI {
	showModal: boolean;
	headerTitle: string;
	handleClose: () => void;
	children: JSX.Element;
}

export default function Modal(props: PropsI) {
	const showModal = () => props.showModal;
	const handleClose = () => props.handleClose;

	return (
		<div class={`${showModal() ? "flex" : "hidden"}`}>
			<div class={styles.overlay}>
				<div class={styles.modalContainer}>
					{/*Modal content*/}
					<div class={styles.modalContent}>
						{/*Modal header*/}
						<div class={styles.headerContainer}>
							<h3 class={styles.header}>{props.headerTitle}</h3>
							<CloseModalIconButton handleClick={handleClose()} />
						</div>
						{/*Modal body*/}
						<div>
							<form>{props.children}</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
