import CheckCircleIcon from "~/components/atoms/icons/CheckCircleIcon";
import { createMemo, Show } from "solid-js";
import styles from "./style.module.css";
import CloseModalIconButton from "~/components/atoms/CloseModalIconButton";
import InfoIcon from "~/components/atoms/icons/InfoIcon";
import WarningIcon from "~/components/atoms/icons/WarningIcon";
import XCircleErrorIcon from "~/components/atoms/icons/XCircleErrorIcon";
import { capitalise } from "~/helpers/general";

interface PropsI {
	type: "success" | "error" | "warning" | "info";
	message: string;
	showModal: boolean;
	handleClose: () => void;
}

export default function Toast(props: PropsI) {
	const type = () => props.type;
	const showModal = () => props.showModal;
	const message = () => props.message;

	const iconColour = createMemo(() => {
		switch (props.type) {
			case "success":
				return "text-green-400";
			case "warning":
				return "text-yellow-400";
			case "info":
				return "text-blue-400";
			case "error":
				return "text-red-400";
			default:
				return "";
		}
	});

	return (
		<Show when={showModal()}>
			<div
				class={styles.myToastContainer}
				role="alert"
				inert={!showModal()}
				aria-labelledby={message()}
			>
				{type() === "success" && <CheckCircleIcon style={iconColour()} />}
				{type() === "warning" && <WarningIcon style={iconColour()} />}
				{type() === "info" && <InfoIcon style={iconColour()} />}
				{type() === "error" && <XCircleErrorIcon style={iconColour()} />}
				<div class={styles.message}>{capitalise(message())}</div>
				<CloseModalIconButton handleClick={props.handleClose} />
			</div>
		</Show>
	);
}
