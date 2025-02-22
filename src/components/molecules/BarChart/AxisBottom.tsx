import { axisBottom, ScaleBand, select } from "d3";
import { createEffect } from "solid-js";

export interface AxisBottomProps {
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
