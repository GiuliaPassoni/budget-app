import * as d3 from "d3";
import { createEffect, createSignal, For, Show } from "solid-js";

// borrow from https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
	var letters = "0123456789ABCDEF";
	var color = "#";
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

type PropsT<T extends Record<string, any>> = {
	w: number;
	h: number;
	margin: number;
	data: T[];
	label: keyof T;
	value: (d: T) => number;
};

type Arc<T> = {
	path: string;
	data: T;
	color: string; //todo map category colour
};

export default function PieChart<T extends Record<string, any>>(
	props: PropsT<T>,
) {
	const width = () => props.w,
		height = () => props.h,
		margin = () => props.margin,
		label = () => props.label,
		data = () => props.data;

	const [arcs, setArcs] = createSignal<Arc<T>[]>([]);
	const [hovered, setHovered] = createSignal<Arc<T> | null>(null);

	const handleMouseOver = (d: Arc<T>) => {
		setHovered(d);
	};

	const handleMouseOut = () => {
		setHovered(null);
	};

	createEffect(() => {
		const radius = Math.min(width(), height()) / 2 - margin();

		const colorGenerator = d3
			.scaleSequential(d3.interpolateWarm)
			.domain([0, data().length]);

		const pieGen = d3.pie<T>().value(props.value);
		const parsedData = pieGen(data());
		const arcGen = d3
			.arc<d3.PieArcDatum<T>>()
			.innerRadius(radius * 0.5)
			.outerRadius(radius);

		setArcs(
			parsedData.map((d, i) => ({
				path: arcGen(d) ?? "",
				data: d.data,
				color: colorGenerator(i),
			})),
		);
	});
	return (
		<div class="mx-auto">
			<svg viewBox={`0 0 ${width()} ${height()}`}>
				<g transform={"translate(" + width() / 2 + "," + height() / 2 + ")"}>
					<For each={arcs()}>
						{(d) => (
							<path
								onMouseOver={() => handleMouseOver(d)}
								onMouseOut={() => handleMouseOut()}
								d={d.path ?? ""}
								fill={d.color}
								class="transition hover:scale-105"
							/>
						)}
					</For>
				</g>
			</svg>
			<Show when={hovered()}>
				{(item) => (
					<div class="w-fit m-auto flex items-center gap-2 p-3">
						<div
							class="rounded-md w-5 aspect-square"
							style={{
								"background-color": item().color,
							}}
						/>
						<span>
							{item().data[label()]} Amount: {props.value(item().data)}
						</span>
					</div>
				)}
			</Show>
		</div>
	);
}
