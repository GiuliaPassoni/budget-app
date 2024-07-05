export default function CardWithIcon(props: any) {
	return (
		<a
			href="#"
			class="max-w-md p-4 px-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
		>
			<span class="max-w-12 mx-auto">{props.icon}</span>
			<h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
				{props.title}
			</h5>
			{/*<p class="mb-3 font-normal text-gray-500 dark:text-gray-400">*/}
			{/*{props.children}*/}
			{/*</p>*/}
		</a>
	);
}
