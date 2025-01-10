import { createSignal, For } from "solid-js";
import PlusIconButton from "~/components/atoms/PlusIconButton";
import { TransactionType } from "~/helpers/types";
import { toast, Toaster } from "solid-toast";
import { addNewCategory } from "~/helpers/categories_api_helpers";
import { colorOptions } from "~/helpers/colour_helpers";
import { iconKeys, iconMap } from "~/components/atoms/icons/helpers";
import Modal from "~/components/molecules/Modal";
import "./style.css";

interface ModalProps {
	showModal: boolean;
	handleClose: () => void;
	onSubmit: () => void;
}

// todo reusable modal component...
export default function AddCategoryModal(props: ModalProps) {
	const showModal = () => props.showModal;

	const [name, setName] = createSignal("");
	const [type, setType] = createSignal<TransactionType>("expenses");
	const [iconName, setIconName] = createSignal("");
	const [selectedColour, setSelectedColour] = createSignal("");

	const types = ["expenses", "income", "investments"];

	async function handleSubmit() {
		if (name() && selectedColour() && iconName() && type()) {
			const category = {
				name: name(),
				colour: selectedColour(),
				iconName: iconName(),
				type: type(),
			};
			return await addNewCategory({ category: category });
		} else {
			toast.error("Missing input");
		}
	}

	return (
		<div>
			<Modal
				showModal={showModal()}
				headerTitle="Add Category"
				handleClose={props.handleClose}
			>
				<div class="inputsContainer">
					<div class="first-row">
						<span class="categ-name">
							<label for="name">Name</label>
							<input
								type="text"
								name="name"
								id="category-name"
								class="formElements"
								placeholder="Category Name"
								required={true}
								onBlur={(e) => {
									e.preventDefault();
									setName(e.target.value);
								}}
							/>
						</span>
						<span>
							<label for="type">Type</label>
							<select
								onChange={(e) => {
									setType(e.target.value as TransactionType);
								}}
								required={true}
								id="category"
								class="formElements"
							>
								<For each={types}>{(i) => <option value={i}>{i}</option>}</For>
							</select>
						</span>
					</div>
					<div class="colour-div">
						<label for="colour">Colour</label>
						<div class="grid-selector">
							<For each={colorOptions}>
								{(color) => (
									<div class="grid-item-container">
										<For each={Object.entries(color.shades)}>
											{([shade, bgClass]) => (
												<button
													class={`grid-button ${bgClass} hover:ring-${color.name}-500 transition-all
														${selectedColour() === `${color.name}-${shade}` ? `ring-2 ring-offset-2 ring-${color.name}-500` : ""}
														`}
													onClick={(e) => {
														e.preventDefault();
														setSelectedColour(`${color.name}-${shade}`);
													}}
													title={`${color.name}-${shade}`}
												/>
											)}
										</For>
									</div>
								)}
							</For>
						</div>
					</div>
					<div class="icon-div">
						<label for="category">Icon</label>
						<div class="grid-selector">
							<For each={iconKeys}>
								{(icon) => (
									<div class="grid-item-container">
										<button
											id="inline-radio"
											class={`
												grid-button border-1 border-gray-300 flex items-center justify-center
												${iconName() === `${icon}` ? `ring-2 ring-offset-2 ring-gray-500` : ""}
											`}
											onClick={(e) => {
												e.preventDefault();
												setIconName(icon);
											}}
										>
											{icon ? iconMap[icon]?.() : ""}
										</button>
									</div>
								)}
							</For>
						</div>
					</div>
				</div>
				{/*tooltip doesn't work, may be hiding behind modal*/}
				<PlusIconButton
					type="submit"
					variant="secondary"
					handleClick={async (e: Event) => {
						e.preventDefault();
						await handleSubmit();
						props.handleClose();
					}}
					title="Add new category"
				/>
			</Modal>
			<Toaster />
		</div>
	);
}
