import { IconPropsI } from "~/components/atoms/icons/helpers";

export default function AvatarIcon(props: IconPropsI = { style: "" }) {
	return (
		<svg
			class={`icon-all ${props.style || ""}`}
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
				clip-rule="evenodd"
			></path>
		</svg>
	);
}
