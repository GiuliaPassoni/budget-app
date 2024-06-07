import {
	DropdownButton,
	DropdownItem,
	FormControl,
	FormGroup,
	InputGroup,
	ModalProps,
} from "solid-bootstrap";
import { createSignal, Index } from "solid-js";
import BaseCard from "~/components/baseComponents/BaseCard";

export default function InputModalTabContent(props: Partial<ModalProps>) {
	const [currencies, setCurrencies] = createSignal([
		"EUR",
		"GBP",
		"USD",
		"CAD",
		"RON",
	]);
	const [selectedCurrency, setSelectedCurrency] = createSignal("");

	return (
		<BaseCard>
			<FormGroup>
				<InputGroup class="mb-3">
					<DropdownButton
						title="Currency"
						variant="outline-secondary"
						id="button-addon1"
					>
						<Index each={currencies()}>
							{(item) => <DropdownItem>{item as any}</DropdownItem>}
						</Index>
					</DropdownButton>
					<FormControl aria-label="Amount" />
				</InputGroup>
			</FormGroup>
		</BaseCard>
	);
}
