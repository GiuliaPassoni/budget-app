import { AxisBottomProps } from "~/components/molecules/BarChart/AxisBottom";
import { AxisLeftProps } from "~/components/molecules/BarChart/AxisLeft";
import { ScaleBand } from "d3";
import { For } from "solid-js";
import { getColorForKey } from "~/components/molecules/BarChart/helpers";

export type DataType = {
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

export function Bars(props: BarsProps) {
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
									// key={`bar-${entry.period}-${key}`}
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
