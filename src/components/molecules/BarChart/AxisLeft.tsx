import { axisLeft, ScaleLinear, select } from "d3";
import { createEffect } from "solid-js";

export interface AxisLeftProps {
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
