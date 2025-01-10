import { JSX } from "solid-js";

export interface IconPropsI {
	style?: string;
}

const EXCLUDED_ICONS = ["edit", "spinner", "plus"];

// Import all icon components in the current directory
const icons = import.meta.glob("./*Icon.tsx", {
	eager: true,
	import: "default",
});

// Create the iconMap by processing the imported modules
export const iconMap: { [key: string]: () => JSX.Element } = Object.entries(
	icons,
).reduce((acc, [path, component]) => {
	// Extract the icon name from the path (e.g., './MoonIcon.tsx' -> 'moon')
	const iconName = path
		.replace(/^\.\//, "") // Remove leading ./
		.replace(/Icon\.tsx$/, "") // Remove Icon.tsx suffix
		.toLowerCase(); // Convert to lowercase

	// Skip if the icon is in the excluded list
	if (EXCLUDED_ICONS.includes(iconName)) {
		return acc;
	}

	return {
		...acc,
		[iconName]: component as () => JSX.Element,
	};
}, {});

// Export type for the available icons
export type IconName = keyof typeof iconMap;

export const iconKeys = Object.keys(iconMap);
