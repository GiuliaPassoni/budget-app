import {select} from "d3";
import {onMount} from "solid-js";

export default function Circle() {
    onMount(() => {
        const svg = select("div#my_dataviz")
            .append("svg")
            .attr("viewBox", "0 0 100 100")
            .attr("width", 500)
            .attr("height", 500)
            .append("circle")
            .attr("fill", "black")
            .attr( "cx", "50")
            .attr( "cy", "50")
            .attr( "r", "25")
    })
    return (
        <div id="my_dataviz"></div>
    )
}