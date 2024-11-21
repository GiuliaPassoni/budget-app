import "./style.css";
import SpinnerIcon from "~/components/atoms/icons/SpinnerIcon";

export default function LoadingSpinner() {
	return (
		<div class="loading-spinner">
			<div>
				<SpinnerIcon />
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
	);
}
