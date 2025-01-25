import "./style.css";
import { IconPropsI } from "~/components/atoms/icons/helpers";

export default function SpinnerIcon(props: IconPropsI = { style: "" }) {
	const styleParser = props.style ?? "";

	return (
		<svg width="1em" height="1em" viewBox="0 0 24 24" class={`${styleParser}`}>
			<path
				fill="currentColor"
				d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
			>
				<animateTransform
					attributeName="transform"
					dur="1s"
					repeatCount="indefinite"
					type="rotate"
					values="0 12 12;360 12 12"
				/>
			</path>
		</svg>
	);
}
