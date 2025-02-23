// IconSelector.jsx
import { createSignal } from "solid-js";
import * as lucide from "lucide-solid";

const IconSelector = () => {
	const [selectedIcon, setSelectedIcon] = createSignal("Heart");

	// Convert the imported icons object into an array of icon names
	const iconNames = Object.keys(lucide).filter(
		// Filter out non-icon exports (like createIcons)
		(key) => typeof lucide[key] === "function" && key !== "createIcons",
	);

	return (
		<div class="p-4">
			<div class="mb-4">
				<label class="block text-sm font-medium mb-2">
					Selected Icon: {selectedIcon()}
				</label>
			</div>

			<div class="grid grid-cols-6 gap-4 max-w-2xl">
				{iconNames.map((iconName) => {
					const IconComponent = lucide[iconName];
					return (
						<button
							class="p-2 rounded hover:bg-gray-100 flex items-center justify-center"
							classList={{ "bg-blue-100": selectedIcon() === iconName }}
							onClick={() => setSelectedIcon(iconName)}
						>
							<IconComponent size={24} />
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default IconSelector;
