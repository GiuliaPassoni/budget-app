import colors from "tailwindcss/colors";

type colourType = {
	name: string;
	colourClass: string;
};

function getShades(shade: number | string) {
	const container: colourType[] = [];
	Object.entries(colors).forEach(([colourName, colourShade]) => {
		container.push({
			name: colourName,
			colourClass: `bg-${colourName}-${shade}`,
		});
	});
	return container;
}

// todo: fix the colour mess
// todo maybe checkout colorspace library to mix coours, see example in https://www.youtube.com/watch?v=q1fsBWLpYW4
const testColours = getShades(400);

// Get all 400-grade colors -- the below is copy-pasted from logging testColours above
export const pastelColors = [
	{
		name: "black",
		colourClass: "bg-black",
	},
	{
		name: "white",
		colourClass: "bg-white",
	},
	{
		name: "gray",
		colourClass: "bg-gray-400",
	},
	{
		name: "red",
		colourClass: "bg-red-400",
	},
	{
		name: "orange",
		colourClass: "bg-orange-400",
	},
	{
		name: "amber",
		colourClass: "bg-amber-400",
	},
	{
		name: "yellow",
		colourClass: "bg-yellow-400",
	},
	{
		name: "lime",
		colourClass: "bg-lime-400",
	},
	{
		name: "green",
		colourClass: "bg-green-400",
	},
	{
		name: "emerald",
		colourClass: "bg-emerald-400",
	},
	{
		name: "teal",
		colourClass: "bg-teal-400",
	},
	{
		name: "cyan",
		colourClass: "bg-cyan-400",
	},
	{
		name: "sky",
		colourClass: "bg-sky-400",
	},
	{
		name: "blue",
		colourClass: "bg-blue-400",
	},
	{
		name: "indigo",
		colourClass: "bg-indigo-400",
	},
	{
		name: "violet",
		colourClass: "bg-violet-400",
	},
	{
		name: "purple",
		colourClass: "bg-purple-400",
	},
	{
		name: "fuchsia",
		colourClass: "bg-fuchsia-400",
	},
	{
		name: "pink",
		colourClass: "bg-pink-400",
	},
	{
		name: "rose",
		colourClass: "bg-rose-400",
	},
	{
		name: "lightBlue",
		colourClass: "bg-lightBlue-400",
	},
	{
		name: "warmGray",
		colourClass: "bg-warmGray-400",
	},
	{
		name: "trueGray",
		colourClass: "bg-trueGray-400",
	},
	{
		name: "coolGray",
		colourClass: "bg-coolGray-400",
	},
	{
		name: "blueGray",
		colourClass: "bg-blueGray-400",
	},
];
