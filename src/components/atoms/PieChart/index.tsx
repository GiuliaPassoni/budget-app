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
	userCurrency: string;
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
		userCurrency = () => props.userCurrency,
		data = () => props.data;

	const [arcs, setArcs] = createSignal<Arc<T>[]>([]);
	const [hovered, setHovered] = createSignal<Arc<T> | null>(null);

	const handleMouseOver = (d: Arc<T>) => {
		setHovered(d);
	};

	const handleMouseOut = () => {
		setHovered(null);
	};

	const totalAmount = () => {
		return data().reduce((sum, d) => sum + props.value(d), 0);
	};

	const calculateFontSize = () => {
		const radius = Math.min(width(), height()) / 2 - margin();
		return ".5"; //todo update this if necessary, for now the constant works
		// return Math.max(8, radius * 0.1); // Adjust the multiplier for desired scaling
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
					<text
						text-anchor="middle"
						dominant-baseline="middle"
						font-size={`${calculateFontSize()}px`}
						font-weight="bold"
						fill="white"
					>
						{`${userCurrency()} ${totalAmount().toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}`}
					</text>
				</g>
			</svg>
			<Show when={hovered()} fallback={<div class="height-16" />}>
				{(item) => {
					const transactionCurrency = item().data.currency; // Access currency directly from data
					const defaultCurrency = userCurrency();
					const exchangeRate = item().data.exchange_to_default; // Access exchange rate directly from data
					const convertedAmount = props.value(item().data); // Use the value function to get the converted amount

					// Determine the tooltip text based on the currency
					const tooltipText =
						transactionCurrency === defaultCurrency
							? `${item().data[label()]}: ${defaultCurrency} ${convertedAmount.toFixed(2)}`
							: `${item().data[label()]}: ${defaultCurrency} ${convertedAmount.toFixed(2)} (1 ${transactionCurrency} = ${exchangeRate} ${defaultCurrency})`;

					return (
						<div class="w-fit m-auto flex items-center gap-2 p-3">
							<div
								class="rounded-md w-5 aspect-square"
								style={{
									"background-color": item().color,
								}}
							/>
							<span>{tooltipText}</span>
						</div>
					);
				}}
			</Show>
		</div>
	);
}

//todo what happens when currency is converted?
