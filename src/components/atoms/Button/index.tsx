// TODO check out https://tailwindcss.com/docs/reusing-styles for reusability
interface IProps {
	onClick(): void;
	text: string;
	disabled?: boolean;
}

export default function Button(props: IProps) {
	const text = () => props.text;
	const disabled = () => props.disabled;
	// const handleClick = props.onClick;
	return (
		<button
			onClick={props.onClick} //todo check if this still works, else, revert to props.onClick
			class="inline-flex items-center px-3 py-2
			text-sm font-medium text-center text-white
			bg-blue-700 dark:bg-blue-600
			rounded-lg
			hover:bg-blue-800 dark:hover:bg-blue-700
			focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
		>
			{text()}
		</button>
	);
}
