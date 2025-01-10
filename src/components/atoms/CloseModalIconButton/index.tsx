import CloseIcon from "~/components/atoms/icons/CloseIcon";

interface IProps {
	handleClick(): void;
}

export default function CloseModalIconButton(props: IProps) {
	const handleClick = () => {
		return props.handleClick(); //todo check if this still works, and compare with the Button implementation. Else, revert to props.onClick
	};
	return (
		<button onClick={handleClick} class="close-button" aria-label="Close">
			<span class="sr-only">Close</span>
			<CloseIcon />
		</button>
	);
}
