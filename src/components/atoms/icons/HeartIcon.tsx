import "./style.css";
import { IconPropsI } from "~/components/atoms/icons/helpers";

export default function HeartIcon(props: IconPropsI = { style: "" }) {
	return (
		<svg
			class={`icon-all ${props.style || ""}`}
			width="24"
			height="24"
			fill="currentColor"
			viewBox="0 0 24 24"
		>
			<path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
		</svg>
	);
}
