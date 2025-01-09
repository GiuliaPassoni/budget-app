import { createSignal, For } from "solid-js";
import PlusIconButton from "~/components/atoms/PlusIconButton";
import { TransactionType } from "~/helpers/types";
import { toast, Toaster } from "solid-toast";
import { addNewCategory } from "~/helpers/categories_api_helpers";
import { pastelColors } from "~/helpers/colour_helpers";
import { iconMap } from "~/components/atoms/icons/helpers";
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

	const iconNames = ["star", "moon", "sun"];

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
					<div class="row max-w-[512px] mx-3">
						<label for="category">Colour</label>
						<div class="flex">
							<div class="grid grid-cols-12 gap-2 mx-auto w-full">
								<For each={pastelColors}>
									{(colour) => (
										<div class="col-span-2">
											<button
												id="inline-radio"
												class={`rounded-full w-8 h-8 col-end-1 ${colour.colourClass} border-2`}
												onClick={(e) => {
													e.preventDefault();
													setSelectedColour(colour.name);
												}}
											/>
										</div>
									)}
								</For>
							</div>
						</div>
					</div>
					<div class="row max-w-[512px] mx-3">
						<label for="category" class="block mb-2 font-medium ">
							Icon
						</label>
						<div class="flex">
							<div class="grid grid-cols-12 gap-2 mx-auto w-full">
								<For each={iconNames}>
									{(icon) => (
										<div class="col-span-4">
											<button
												id="inline-radio"
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
