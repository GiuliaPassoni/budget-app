interface IProps {
	handleClick(): void;
}

export default function CloseModalIconButton(props: IProps) {
	const handleClick = () => {
		return props.handleClick(); //todo check if this still works, and compare with the Button implementation. Else, revert to props.onClick
	};
	return (
		<button
			type="button"
			class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
			data-modal-toggle="crud-modal"
			onClick={handleClick}
		>
			<svg
				class="w-3 h-3"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 14 14"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
				/>
			</svg>
			<span class="sr-only">Close modal</span>
		</button>
	);
}
