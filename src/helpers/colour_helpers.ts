type ColorShade = "300" | "500" | "700";
type ColorOption = {
	name: string;
	shades: Record<ColorShade, string>;
};

// Define all available colors with their shades
export const colorOptions: ColorOption[] = [
	// {
	// 	name: "slate",
	// 	shades: {
	// 		"300": "bg-slate-300",
	// 		"500": "bg-slate-500",
	// 		"700": "bg-slate-700",
	// 	},
	// },
	{
		name: "gray",
		shades: {
			"300": "bg-gray-300",
			"500": "bg-gray-500",
			"700": "bg-gray-700",
		},
	},
	// { //doesn't render
	// 	name: "zinc",
	// 	shades: {
	// 		"300": "bg-zinc-300",
	// 		"500": "bg-zinc-500",
	// 		"700": "bg-zinc-700",
	// 	},
	// },
	{
		name: "red",
		shades: {
			"300": "bg-red-300",
			"500": "bg-red-500",
			"700": "bg-red-700",
		},
	},
	{
		name: "orange",
		shades: {
			"300": "bg-orange-300",
			"500": "bg-orange-500",
			"700": "bg-orange-700",
		},
	},
	// {
	// 	name: "amber",
	// 	shades: {
	// 		"300": "bg-amber-300",
	// 		"500": "bg-amber-500",
	// 		"700": "bg-amber-700",
	// 	},
	// },
	{
		name: "yellow",
		shades: {
			"300": "bg-yellow-300",
			"500": "bg-yellow-500",
			"700": "bg-yellow-700",
		},
	},
	// {
	// 	name: "lime",
	// 	shades: {
	// 		"300": "bg-lime-300",
	// 		"500": "bg-lime-500",
	// 		"700": "bg-lime-700",
	// 	},
	// },
	{
		name: "green",
		shades: {
			"300": "bg-green-300",
			"500": "bg-green-500",
			"700": "bg-green-700",
		},
	},
	// {
	// 	name: "emerald",
	// 	shades: {
	// 		"300": "bg-emerald-300",
	// 		"500": "bg-emerald-500",
	// 		"700": "bg-emerald-700",
	// 	},
	// },
	{
		name: "teal",
		shades: {
			"300": "bg-teal-300",
			"500": "bg-teal-500",
			"700": "bg-teal-700",
		},
	},
	// {
	// 	name: "cyan",
	// 	shades: {
	// 		"300": "bg-cyan-300",
	// 		"500": "bg-cyan-500",
	// 		"700": "bg-cyan-700",
	// 	},
	// },
	// {
	// 	name: "sky",
	// 	shades: {
	// 		"300": "bg-sky-300",
	// 		"500": "bg-sky-500",
	// 		"700": "bg-sky-700",
	// 	},
	// },
	{
		name: "blue",
		shades: {
			"300": "bg-blue-300",
			"500": "bg-blue-500",
			"700": "bg-blue-700",
		},
	},
	{
		name: "indigo",
		shades: {
			"300": "bg-indigo-300",
			"500": "bg-indigo-500",
			"700": "bg-indigo-700",
		},
	},
	// {
	// 	name: "violet",
	// 	shades: {
	// 		"300": "bg-violet-300",
	// 		"500": "bg-violet-500",
	// 		"700": "bg-violet-700",
	// 	},
	// },
	{
		name: "purple",
		shades: {
			"300": "bg-purple-300",
			"500": "bg-purple-500",
			"700": "bg-purple-700",
		},
	},
	// {
	// 	name: "fuchsia",
	// 	shades: {
	// 		"300": "bg-fuchsia-300",
	// 		"500": "bg-fuchsia-500",
	// 		"700": "bg-fuchsia-700",
	// 	},
	// },
	{
		name: "pink",
		shades: {
			"300": "bg-pink-300",
			"500": "bg-pink-500",
			"700": "bg-pink-700",
		},
	},
	// {
	// 	name: "rose",
	// 	shades: {
	// 		"300": "bg-rose-300",
	// 		"500": "bg-rose-500",
	// 		"700": "bg-rose-700",
	// 	},
	// },
];
