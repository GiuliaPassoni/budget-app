import { select } from "d3";
import { onMount } from "solid-js";

// borrow from https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
	var letters = "0123456789ABCDEF";
	var color = "#";
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

export default function PieChart(props: { w: number; h: number; r: number }) {
	const randomNumber = (Math.random() * 100).toFixed(0),
		divId = "my_dataviz" + randomNumber;
	onMount(() => {
		const svg = select(`div#${divId}`)
			.append("svg")
			.attr("viewBox", "0 0 100 100")
			.attr("width", props.w)
			.attr("height", props.h)
			.append("circle")
			.attr("fill", getRandomColor())
			.attr("cx", "50")
			.attr("cy", "50")
			.attr("r", props.r);
	});
	return <div id={divId} class="max-w-10 mx-auto"></div>;
}
