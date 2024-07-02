// TODO check out https://tailwindcss.com/docs/reusing-styles for reusability
// TODO add tooltip
export default function PlusIconButton({ handleClick, title, ...rest }: any) {
	return (
		<button
			type="button"
			onClick={handleClick}
			class="mb-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			<svg
				class="w-6 h-6 text-white dark:text-white"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M5 12h14m-7 7V5"
				/>
			</svg>
			<span class="sr-only"></span>
		</button>
	);
}