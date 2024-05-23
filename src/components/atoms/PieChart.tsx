import { select } from "d3";
import { onMount } from "solid-js";

export default function PieChart(props: { w: number; h: number; r: number }) {
  onMount(() => {
    const svg = select("div#my_dataviz")
      .append("svg")
      .attr("viewBox", "0 0 100 100")
      .attr("width", props.w)
      .attr("height", props.h)
      .append("circle")
      .attr("fill", "black")
      .attr("cx", "50")
      .attr("cy", "50")
      .attr("r", props.r);
  });
  return <div id="my_dataviz"></div>;
}
