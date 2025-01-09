import { JSX } from "solid-js";
import CloseModalIconButton from "~/components/atoms/CloseModalIconButton";

import "./style.css";

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
			<div id="default-styled-tab-content">
				<div aria-hidden={showModal()} class="overlay">
					<div class="modal-container">
						{/*Modal content*/}
						<div class="modal-content">
							{/*Modal header*/}
							<div class="header-container">
								<h3 class="header">{props.headerTitle}</h3>
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
		</div>
	);
}
