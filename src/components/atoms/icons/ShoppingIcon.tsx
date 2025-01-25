import "./style.css";
import { IconPropsI } from "~/components/atoms/icons/helpers";

export default function ShoppingIcon(props: IconPropsI = { style: "" }) {
	return (
		<svg
			class={`icon-all ${props.style || ""}`}
			width="24"
			height="24"
			fill="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				fill-rule="evenodd"
				d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z"
				clip-rule="evenodd"
			/>
		</svg>
	);
}
