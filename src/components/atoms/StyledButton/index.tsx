import "./style.css";
// TODO this works! Apply app-wide!
export default function StyledButton(props: any) {
	return (
		<button onClick={props.onClick} class="styled-button">
			{props.text}
		</button>
	);
}
