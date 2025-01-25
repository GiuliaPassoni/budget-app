import { IconPropsI } from "~/components/atoms/icons/helpers";
import "./style.css";

export default function BinIcon(props: IconPropsI = { style: "" }) {
	return (
		<svg
			class={`icon-all ${props.style ?? ""}`}
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
				d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
			/>
		</svg>
	);
}
