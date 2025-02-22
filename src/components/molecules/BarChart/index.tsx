import { createSignal } from "solid-js";
import { scaleBand, scaleLinear } from "d3";
import { Portal } from "solid-js/web";
import { AxisBottom } from "~/components/molecules/BarChart/AxisBottom";
import { AxisLeft } from "~/components/molecules/BarChart/AxisLeft";
import { Tooltip } from "~/components/molecules/BarChart/Tooltip";
import { Bars, DataType } from "~/components/molecules/BarChart/Bars";

type MarginType = {
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
};

interface BarChartI {
	data: DataType[];
	w: number;
	h: number;
	margin?: MarginType;
	label: string;
}

export default function BarChart(props: BarChartI) {
	const margin = { top: 50, right: 0, bottom: 50, left: 60 };
	const width = () => props.w - margin.left - margin.right,
		height = () => props.h - margin.top - margin.bottom,
		data = () => props.data;

	const [tooltip, setTooltip] = createSignal<{
		x: number;
		y: number;
		content: string;
	} | null>(null);

	const maxValue = Math.max(
		...data()
			.map((d) => [d.expenses, d.income, d.investments, Math.abs(d.profitLoss)])
			.reduce((acc, val) => acc.concat(val), []),
	);

	const minValue = Math.min(
		...data()
			.map((d) => [d.expenses, d.income, d.investments, d.profitLoss])
			.reduce((acc, val) => acc.concat(val), []),
	);

	const roundedMax = Math.round(maxValue / 1000) * 1000;
	const roundedMin = Math.round(minValue / 1000) * 1000;

	const scaleX = scaleBand()
		.domain(data().map((i: any) => i.period))
		.range([0, width() - margin.left - margin.right])
		.padding(0.125);

	const scaleY = scaleLinear()
		.domain([roundedMin, roundedMax])
		.nice()
		.range([height() - margin.bottom, margin.top]);

	const innerScale = scaleBand()
		.domain(["expenses", "income", "investments", "profitLoss"])
		.range([0, scaleX.bandwidth()])
		.padding(0.1);

	return (
		<div class="mx-auto relative">
			<svg
				width={width()}
				height={height()}
				viewBox={`0 0 ${width()} ${height()}`}
				preserveAspectRatio="xMidYMid meet"
			>
				<g transform={`translate(${margin.left}, 0)`}>
					{/* Zero line */}
					<line
						x1={0}
						x2={width() - margin.right}
						y1={scaleY(0)}
						y2={scaleY(0)}
						stroke="rgba(255,255,255,0.2)"
						stroke-width="1"
					/>
					<g transform={`translate(0, ${height() - margin.bottom})`}>
						<AxisBottom scale={scaleX} transform={`translate(0, 0)`} />
					</g>
					<AxisLeft scale={scaleY} transform={`translate(0, 0)`} />
					{/* Bars */}
					<Bars
						data={data()}
						height={height()}
						scaleX={scaleX}
						scaleY={scaleY}
						innerScale={innerScale}
						onHover={setTooltip}
					/>
				</g>
			</svg>
			<Portal>{tooltip() && <Tooltip {...tooltip()} />}</Portal>
		</div>
	);
}
