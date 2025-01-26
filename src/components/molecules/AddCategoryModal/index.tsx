import { createEffect, createSignal, For, Show } from "solid-js";
import { CategoryI, TransactionType } from "~/helpers/types";
import { toast, Toaster } from "solid-toast";
import {
	addNewCategory,
	deleteItem,
	getItemByIdOrName,
	updateItem,
} from "~/helpers/categories_api_helpers";
import { colorOptions } from "~/helpers/colour_helpers";
import { iconKeys, iconMap } from "~/components/atoms/icons/helpers";
import Modal from "~/components/molecules/Modal";
import "./style.css";
import { createStore } from "solid-js/store";
import Button from "~/components/atoms/Button";
import PlusIcon from "~/components/atoms/icons/PlusIcon";
import BinIcon from "~/components/atoms/icons/BinIcon";

interface ModalProps {
	showModal: boolean;
	isEditCategoryModal: boolean;
	categoryToEdit?: CategoryI;
	handleClose: () => void;
	onSubmit: () => void;
}

export default function AddCategoryModal(props: ModalProps) {
	const showModal = () => props.showModal;
	const isEditCategoryModal = () => props.isEditCategoryModal;
	const [categoryToEdit, setCategoryToEdit] = createSignal<
		CategoryI | undefined
	>(props.categoryToEdit);

	const [category, setCategory] = createStore<CategoryI>({
		name: "",
		type: "expenses",
		iconName: "",
		colour: "",
	});

	createEffect(() => {
		if (isEditCategoryModal() && props.categoryToEdit) {
			setCategory(props.categoryToEdit);
		} else {
			// Reset to default values for "Add" mode
			setCategory({
				name: "",
				type: "expenses",
				iconName: "",
				colour: "",
			});
		}
	});

	const types = ["expenses", "income", "investments"];

	async function handleSubmit() {
		if (category && !isEditCategoryModal()) {
			return await addNewCategory({
				category: {
					name: category.name,
					colour: category.colour,
					iconName: category.iconName,
					type: category.type,
				},
			});
		} else if (category && isEditCategoryModal()) {
		} else {
			toast.error("Missing input");
		}
	}

	async function handleEdit() {
		try {
			// Step 1: Fetch the existing category
			const existingCategory = await getItemByIdOrName({
				dbName: "categories",
				id: category.id, //todo add id
			});

			if (!existingCategory) {
				throw new Error("Category not found");
			}

			// Step 2: Update the category
			const updatedCategory = await updateItem({
				dbName: "categories",
				itemRef: existingCategory.id,
				updatedValue: category,
			});

			console.debug("Updated category:", updatedCategory);
			return updatedCategory;
		} catch (error) {
			console.error("Error in handleEdit:", error);
			throw error; // Re-throw the error to handle it in the calling function
		}
	}

	async function handleDelete() {
		const existingCategory = await getItemByIdOrName({
			dbName: "categories",
			name: category.name,
		});
		return await deleteItem({
			dbName: "categories",
			itemRef: existingCategory.id,
		});
	}

	return (
		<div>
			<Modal
				showModal={showModal()}
				headerTitle={`${isEditCategoryModal() ? "Edit" : "Add"} Category`}
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
								value={isEditCategoryModal() ? category.name : ""}
								required={true}
								onBlur={(e) => {
									e.preventDefault();
									setCategory("name", e.target.value);
								}}
							/>
						</span>
						<span>
							<label for="type">Type</label>
							<select
								value={isEditCategoryModal() ? category.type : ""}
								onChange={(e) => {
									setCategory("type", e.target.value as TransactionType);
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
														${category.colour === `${color.name}-${shade}` ? `ring-2 ring-offset-2 ring-${color.name}-500` : ""}
														`}
													onClick={(e) => {
														e.preventDefault();
														setCategory("colour", `${color.name}-${shade}`);
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
												${category.iconName === `${icon}` ? `ring-2 ring-offset-2 ring-gray-500` : ""}
											`}
											onClick={(e) => {
												e.preventDefault();
												setCategory("iconName", icon);
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
				<Show
					when={isEditCategoryModal()}
					fallback={
						<Button
							leftIcon={<PlusIcon />}
							type="submit"
							styleClass="primary"
							onClick={async () => {
								await handleSubmit();
								props.handleClose();
							}}
							text="Add new category"
						/>
					}
				>
					<div class="grid grid-cols-2 gap-10 mt-8">
						<Button
							styleClass="primary edit-submit mx-auto"
							leftIcon={<PlusIcon />}
							type="submit"
							onClick={async () => {
								await handleEdit();
								props.handleClose();
							}}
							text="Save edit"
						/>

						<Button
							leftIcon={<BinIcon />}
							type="submit"
							styleClass="danger mx-auto"
							onClick={async () => {
								await handleDelete();
								props.handleClose();
							}}
						>
							Delete Category
						</Button>
					</div>
				</Show>
			</Modal>
			<Toaster />
		</div>
	);
}
