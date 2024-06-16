import colors from "tailwindcss/colors.js";

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./node_modules/flowbite/**/*.js", // configure the Flowbite JS source template paths
	],
	darkMode: "class", // you can also just use the “media” option to automatically set the dark or light theme based on the browser’s color scheme preference.
	//otherwise, set it as "class", then add the dark class on your html element.
	theme: {
		screens: {
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1440px",
		},
		colors: {
			gray: colors.coolGray,
			blue: colors.lightBlue,
			red: colors.rose,
			pink: colors.fuchsia,
		},
		fontFamily: {
			sans: ["Graphik", "sans-serif"],
			serif: ["Merriweather", "serif"],
		},
		extend: {
			spacing: {
				128: "32rem",
				144: "36rem",
			},
			borderRadius: {
				"4xl": "2rem",
			},
		},
	},
	plugins: [
		require("flowbite/plugin")({
			// require Flowbite's plugin for Tailwind CSS
			charts: true,
			forms: true,
			tooltips: true,
		}),
		// ... other plugins,
	],
};
