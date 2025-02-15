import { createSignal, For, JSX } from "solid-js";

interface TabItem {
	name: string;
	disabled?: boolean;
	onClick?: () => void;
	content: JSX.Element;
}

interface TabsProps {
	tabs: TabItem[];
	defaultActiveTab?: string;
}

export default function TabsWithContent(props: TabsProps) {
	const [activeTab, setActiveTab] = createSignal(
		props.defaultActiveTab || props.tabs[0]?.name,
	);

	const handleTabClick = (tab: TabItem) => {
		if (tab.disabled) return;
		setActiveTab(tab.name);
		tab.onClick?.();
	};

	const activeContent = () => {
		const currentTab = props.tabs.find((tab) => tab.name === activeTab());
		return currentTab?.content;
	};

	return (
		<div>
			<div class="text-sm font-medium text-center text-gray-400 border-b border-gray-700">
				<ul class="flex justify-between">
					<For each={props.tabs}>
						{(tab) => (
							<li class="">
								<button
									onClick={(e) => {
										e.preventDefault();
										handleTabClick(tab);
									}}
									class={`inline-block p-4 border-b-2 rounded-t-lg ${
										tab.disabled
											? "cursor-not-allowed text-gray-500"
											: activeTab() === tab.name
												? "active text-blue-500 border-blue-500"
												: "border-transparent hover:text-gray-600 hover:text-gray-300"
									}`}
									aria-current={activeTab() === tab.name ? "page" : undefined}
								>
									{tab.name}
								</button>
							</li>
						)}
					</For>
				</ul>
			</div>
			<div class="p-4">{activeContent()}</div>
		</div>
	);
}
