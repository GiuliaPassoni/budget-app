import { createEffect, For } from "solid-js";
import {
	axisBottom,
	axisLeft,
	ScaleBand,
	scaleBand,
	ScaleLinear,
	scaleLinear,
	select,
} from "d3";

type MarginType = {
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
};

interface BarChartI {
	data: any[];
	w: number;
	h: number;
	margin?: MarginType;
	// data: T[];
	label: string;
	// label: keyof T;
}

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
			const yAxis = axisLeft(props.scale).ticks(6).tickSize(-4);

			select(ref)
				.call(yAxis)
				.style("color", "white") // Make the axis and ticks visible
				.call((g) => g.select(".domain").attr("stroke", "white")) // Make axis line visible
				.call((g) => g.selectAll(".tick line").attr("stroke", "white")) // Make tick lines visible
				.call((g) =>
					g
						.selectAll(".tick text")
						.attr("fill", "white") // Make tick text visible
						.style("font-size", "12px"),
				);
		}
	});

	return <g ref={ref} transform={props.transform} />;
}

interface BarsProps {
	data: any;
	height: number;
	scaleX: AxisBottomProps["scale"];
	scaleY: AxisLeftProps["scale"];
	innerScale: ScaleBand<string>;
}

function getColorForKey(key: string): string {
	switch (key) {
		case "expenses":
			return "red";
		case "income":
			return "green";
		case "investments":
			return "blue";
		case "delta":
			return "orange";
		default:
			return "gray";
	}
}

// Function to calculate dynamic ticks for the y-axis
const calculateTicks = (maxValue: number) => {
	const step = Math.pow(10, Math.floor(Math.log10(maxValue)) - 1); // Dynamic step size
	const ticks = [];
	for (let i = 0; i <= maxValue; i += step) {
		ticks.push(i);
	}
	return ticks;
};

function Bars(props: BarsProps) {
	return (
		<For each={props.data}>
			{(entry) => (
				<g transform={`translate(${props.scaleX(entry.date)}, 0)`}>
					<For each={Object.entries(entry).filter(([key]) => key !== "date")}>
						{([key, value]) => {
							const barWidth = props.innerScale.bandwidth();
							const barX = props.innerScale(key) || 0;
							const isNegative = value < 0;

							// For negative values, start from zero and go down
							const barY = isNegative
								? props.scaleY(0) // Get the y-coordinate for zero
								: props.scaleY(Math.max(0, value));
							const barHeight = Math.abs(props.scaleY(value) - props.scaleY(0));
							const radius = 5; // Radius for rounded corners

							let path = "";

							// Define a path with rounded top corners
							if (value > 0) {
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
							} else if (value < 0) {
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
									key={`bar-${entry.date}-${key}`}
									d={path}
									fill={getColorForKey(key)}
								/>
							);
						}}
					</For>
				</g>
			)}
		</For>
	);
}

export default function BarChart(props: BarChartI) {
	const margin = { top: 50, right: 10, bottom: 50, left: 10 };
	const width = () => props.w - margin.left - margin.right,
		height = () => props.h - margin.top - margin.bottom,
		label = () => props.label,
		data = () => props.data;

	// const maxExpensesValue = Math.max(...data().map((i) => i.expenses)),
	// 	maxIncomeValue = Math.max(...data().map((i) => i.income)),
	// 	maxInvestmentsValue = Math.max(...data().map((i) => i.investments)),
	// 	totalMax = Math.max(maxInvestmentsValue, maxExpensesValue, maxIncomeValue);
	//
	// const minValue = Math.min(...data().map((i) => i.delta));
	//
	// const roundedMax = Math.round(totalMax / 1000) * 1000;
	// const roundedMin = Math.round(minValue / 1000) * 1000;

	const maxValue = Math.max(
		...data()
			.map((d) => [d.expenses, d.income, d.investments, Math.abs(d.delta)])
			.reduce((acc, val) => acc.concat(val), []),
	);

	const minValue = Math.min(
		...data()
			.map((d) => [d.expenses, d.income, d.investments, d.delta])
			.reduce((acc, val) => acc.concat(val), []),
	);

	// Add some padding to the domain
	const domainPadding = (maxValue - minValue) * 0.1;
	const roundedMax = Math.round(maxValue / 1000) * 1000;
	const roundedMin = Math.round(minValue / 1000) * 1000;

	const scaleX = scaleBand()
		.domain(data().map((i: any) => i.date))
		.range([0, width() - margin.right])
		.padding(0.125);

	const scaleY = scaleLinear()
		.domain([roundedMin, roundedMax])
		.nice()
		.range([height() - margin.bottom, margin.top]);

	const innerScale = scaleBand()
		.domain(["expenses", "income", "investments", "delta"])
		.range([0, scaleX.bandwidth()])
		.padding(0.1);

	let yAxisRef: SVGGElement;
	let xAxisRef: SVGGElement;

	// onMount(() => {
	// 	// 	// Render y-axis with dynamic ticks
	// 	select(yAxisRef).call(
	// 		axisLeft(scaleY)
	// 			.tickValues(calculateTicks(maxValue))
	// 			.tickFormat((d) => `${Number(d) > 1000 ? Number(d) / 1000 + "k" : d}`),
	// 	);
	// 	//
	// 	// 	// Render x-axis with date labels
	// 	select(xAxisRef)
	// 		// .attr("transform", `translate(0, ${scaleY(0)})`)
	// 		.call(axisBottom(scaleX));
	// });

	return (
		<div class="mx-auto">
			<svg
				viewBox={`0 0 ${width()} ${height()}`}
				// width={props.w}
				// height={props.h}
			>
				<g>
					{/* Add a zero line */}
					<line
						x1={margin.left}
						x2={width() - margin.right}
						y1={scaleY(0)}
						y2={scaleY(0)}
						stroke="rgba(255,255,255,0.2)"
						stroke-width="1"
					/>
					{/* X-axis at the bottom */}
					<g transform={`translate(0, ${height() - margin.bottom})`}>
						<AxisBottom scale={scaleX} transform={`translate(0, 0)`} />
					</g>
					{/* Y-axis with proper transform */}
					<AxisLeft scale={scaleY} transform={`translate(${margin.left}, 0)`} />
					{/* Bars */}
					<Bars
						data={data()}
						height={height()}
						scaleX={scaleX}
						scaleY={scaleY}
						innerScale={innerScale}
					/>
				</g>
			</svg>
		</div>
	);
}
