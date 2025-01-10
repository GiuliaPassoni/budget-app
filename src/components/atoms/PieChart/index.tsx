import * as d3 from "d3";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import { TransactionI } from "~/helpers/expenses_api_helpers";

// borrow from https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
	var letters = "0123456789ABCDEF";
	var color = "#";
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
// sample data returned from db
const mockTransactionData = [
	{
		amount: 0,
		notes: "",
		date: {
			seconds: 1727076694,
			nanoseconds: 30000000,
		},
		user_id: "iZRf4bthopb7vyuxqBmGIsCHbf12",
		exchange_to_default: 1,
		currency: "EUR",
		ctg_name: "Paycheck",
		// todo add colour from category
		id: "XD9clGcmczgvrYKiGlbx",
	},
	{
		date: {
			seconds: 1726646153,
			nanoseconds: 560000000,
		},
		ctg_name: "paycheck",
		user_id: "iZRf4bthopb7vyuxqBmGIsCHbf12",
		exchange_to_default: 1,
		amount: 12,
		currency: "GBP",
		notes: "Income",
		id: "o1o4T9wk5sJLlKdQDBV3",
	},
	{
		exchange_to_default: 1,
		ctg_name: "paycheck",
		amount: 100,
		date: {
			seconds: 1726644831,
			nanoseconds: 271000000,
		},
		currency: "EUR",
		notes: "Generous donour",
		user_id: "iZRf4bthopb7vyuxqBmGIsCHbf12",
		id: "u9Bfu5EjgrIPlDiHfkNa",
	},
	{
		amount: 10,
		ctg_name: "Paycheck",
		exchange_to_default: 1,
		currency: "EUR",
		date: {
			seconds: 1727076701,
			nanoseconds: 672000000,
		},
		user_id: "iZRf4bthopb7vyuxqBmGIsCHbf12",
		notes: "Hi",
		id: "zERaUvaEeiw3Xk3J3dsf",
	},
];

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
	color: string;
};

export default function PieChart<T extends Record<string, any>>(
	props: PropsT<T>,
) {
	const width = () => props.w,
		height = () => props.h,
		margin = () => props.margin,
		label = () => props.label,
		data = () => props.data;

	// const randomNumber = (Math.random() * 100).toFixed(0),
	// 	divId = "my_dataviz" + randomNumber;

	// onMount(() => {
	// const svg = select(`div#${divId}`)
	// 	.append("svg")
	// 	// .attr("viewBox", "0 0 100 100")
	// 	.attr("width", width)
	// 	.attr("height", height)
	// 	.append("g")
	// 	.attr("transform", "translate(" + width() / 2 + "," + height() / 2 + ")")
	// 	.append("circle")
	// 	.attr("fill", getRandomColor())
	// 	.attr("cx", "50")
	// 	.attr("cy", "50")
	// 	.attr("r", radius);
	// });

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
