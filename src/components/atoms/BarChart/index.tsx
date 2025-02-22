import { createEffect, For } from "solid-js";
import { axisBottom, axisLeft, ScaleBand, ScaleLinear, select } from "d3";

type MarginType = {
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
};

interface AxisBottomProps {
	scale: ScaleBand<string>;
	transform: string;
}

export function AxisBottom(props: AxisBottomProps) {
	let ref: SVGGElement | undefined;

	createEffect(() => {
		if (ref) {
			select(ref).call(axisBottom(props.scale));
		}
	});

	return <g ref={ref} transform={props.transform} />;
}

interface AxisLeftProps {
	scale: ScaleLinear<number, number, never>;
	transform: string;
}

export function AxisLeft(props: AxisLeftProps) {
	let ref: SVGGElement | undefined;

	createEffect(() => {
		if (ref) {
			const yAxis = axisLeft(props.scale)
				.ticks(6)
				.tickFormat((d) => d.toLocaleString())
				.tickSize(-4);

			select(ref)
				.call(yAxis)
				.style("color", "white") // Make the axis and ticks visible
				.call((g) => g.select(".domain").attr("stroke", "white")) // Make axis line visible
				.call((g) => g.selectAll(".tick line").attr("stroke", "white")) // Make tick lines visible
				.call((g) =>
					g
						.selectAll(".tick text")
						.attr("fill", "white") // Make tick text visible
						.style("font-size", "12px")
						.attr("dx", "-0.5em"),
				);
		}
	});

	return <g ref={ref} transform={props.transform} />;
}

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
				top: `${y - 40}px`, // Position above the cursor
				transform: "translateX(-50%)", // Center horizontally
				border: "1px solid rgba(255,255,255,0.2)",
			}}
		>
			{content}
		</div>
	);
}

type DataType = {
	expenses: number;
	income: number;
	investments: number;
	profitLoss: number;
	period: string;
};

interface BarsProps {
	data: DataType[];
	height: number;
	scaleX: AxisBottomProps["scale"];
	scaleY: AxisLeftProps["scale"];
	innerScale: ScaleBand<string>;
	onHover: (tooltip: { x: number; y: number; content: string } | null) => void;
}

function getColorForKey(key: string): string {
	switch (key) {
		case "expenses":
			return "#28AFB0";
		case "income":
			return "#A2FAA3";
		case "investments":
			return "#E6C229";
		case "profitLoss":
			return "#D8315B";
		default:
			return "gray";
	}
}

function Bars(props: BarsProps) {
	return (
		<For each={props.data}>
			{(entry) => (
				<g transform={`translate(${props.scaleX(entry.period)}, 0)`}>
					<For each={Object.entries(entry).filter(([key]) => key !== "period")}>
						{([key, value]: [string, string | number]) => {
							const barWidth = props.innerScale.bandwidth();
							const barX = props.innerScale(key) || 0;
							const isNegative = Number(value) < 0;

							// For negative values, start from zero and go down
							const barY = isNegative
								? props.scaleY(0) // Get the y-coordinate for zero
								: props.scaleY(Math.max(0, Number(value)));
							const barHeight = Math.abs(
								props.scaleY(Number(value)) - props.scaleY(0),
							);
							const radius = 5; // Radius for rounded corners

							let path = "";

							// Define a path with rounded top corners
							if (Number(value) > 0) {
								// Positive value: Round top corners
								path = `
                  M${barX},${barY + radius}
                  a${radius},${radius} 0 0 1 ${radius},-${radius}
                  h${barWidth - 2 * radius}
                  a${radius},${radius} 0 0 1 ${radius},${radius}
                  v${barHeight - radius}
                  h-${barWidth}
                  z
                `;
							} else if (Number(value) < 0) {
								// Negative value: Round bottom corners
								path = `
                  M${barX},${barY}
                  h${barWidth}
                  v${barHeight - radius}
                  a${radius},${radius} 0 0 1 -${radius},${radius}
                  h-${barWidth - 2 * radius}
                  a${radius},${radius} 0 0 1 -${radius},-${radius}
                  z
                `;
							} else {
								// Zero value: No rounded corners
								path = `
                  M${barX},${barY}
                  h${barWidth}
                  v${barHeight}
                  h-${barWidth}
                  z
                `;
							}
							return (
								<path
									key={`bar-${entry.period}-${key}`}
									d={path}
									fill={getColorForKey(key)}
									class="transition-opacity duration-200 hover:opacity-80"
									onMouseMove={(e) => {
										const rect = (
											e.target as SVGElement
										).getBoundingClientRect();
										props.onHover({
											x: rect.left + rect.width / 2,
											y: e.clientY,
											content: `${key}: ${value.toLocaleString()}`,
										});
									}}
									onMouseLeave={() => props.onHover(null)}
								/>
							);
						}}
					</For>
				</g>
			)}
		</For>
	);
}
