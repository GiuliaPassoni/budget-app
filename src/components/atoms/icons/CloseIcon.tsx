import { IconPropsI } from "~/components/atoms/icons/helpers";
import "./style.css";

export default function CloseIcon(props: IconPropsI = { style: "" }) {
	return (
		<svg
			class={`icon-all ${props.style || ""}`}
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18 17.94 6M18 18 6.06 6"
			/>
		</svg>
	);
}
