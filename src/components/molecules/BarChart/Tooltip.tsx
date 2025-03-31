import { capitalise } from "~/helpers/general";

interface TooltipPropsI {
	x?: number;
	y?: number;
	content?: string;
}

export function Tooltip({ x, y, content }: TooltipPropsI) {
	return (
		<div
			class="fixed pointer-events-none bg-gray-900 text-white px-2 py-1 rounded shadow-lg text-sm"
			style={{
				left: `${x}px`,
				top: `${y - 40}px`, // Position above cursor
				transform: "translateX(-50%)", // Center horizontally
				border: "1px solid rgba(255,255,255,0.2)",
			}}
		>
			{capitalise(content as string)}
		</div>
	);
}
