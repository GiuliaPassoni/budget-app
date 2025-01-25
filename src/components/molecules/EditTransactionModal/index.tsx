import Modal from "~/components/molecules/Modal";
import { createSignal, For, onMount } from "solid-js";
import styles from "~/components/molecules/AddTransactionModal/style.module.css";
import allCurrencies from "~/helpers/mock_values_helpers";
import CardWithIcon from "~/components/molecules/CardWithIcon";
import { iconMap } from "~/components/atoms/icons/helpers";
import Button from "~/components/atoms/Button";
import { CategoryI, TransactionType } from "~/helpers/types";
import {
	deleteItem,
	getItemByIdOrName,
	updateItem,
} from "~/helpers/categories_api_helpers";
import EditIcon from "~/components/atoms/icons/EditIcon";
import PlusIcon from "~/components/atoms/icons/PlusIcon";
import BinIcon from "~/components/atoms/icons/BinIcon";
import { formatDate } from "~/components/molecules/Table";
import { createStore } from "solid-js/store";

interface PropsI {
	showModal: boolean;
	item: any; //todo fix
	// item: TransactionI | CategoryI; //todo fix
	// itemModel: "transaction" | "category";
	type: TransactionType;
	handleClose: () => void;
}

export default function EditTransactionModal(props: PropsI) {
	const showModal = () => props.showModal;
	const transactionType = () => props.type;
	const item = () => props.item;
	const [category, setCategory] = createSignal<CategoryI | null>(null);
	const [date, setDate] = createSignal<Date>();
	const [updatedValue, setUpdatedValue] = createStore({
		type: transactionType(),
		amount: item().amount,
		currency: item().currency,
		exchange: item().exchange ?? 1,
		ctg_name: item().ctg_name,
		notes: item().notes ?? "",
	});
	if (!item()) {
		return;
	}

	// todo implement below
	// const {getItemByIdOrName, updateItem, deleteItem} = useFirebaseCollection()

	onMount(async () => {
		try {
			// set date to be able to convert it and display it
			setDate(
				new Date(
					item().date.seconds * 1000 +
						Math.floor(item().date.nanoseconds / 1e6),
				),
			);
			// retrieve category
			const ctgName = item().ctg_name;
			const categ = await getItemByIdOrName({
				dbName: "categories",
				name: ctgName,
			});
			if (categ) {
				setCategory(categ.data);
			} else {
				console.warn("No category found");
			}
		} catch (err) {
			console.error("Failed to load category:", err);
		}
	});

	async function handleEdit() {
		return await updateItem({
			dbName: transactionType(),
			itemRef: item().id,
			updatedValue,
		});
	}

	async function handleDelete() {
		return await deleteItem({
			dbName: transactionType(),
			itemRef: item().id,
		});
	}

	// todo wouldn't it have been easier to just modify the existing transaction modal? Try that approach for the edit category modal.
	return (
		<Modal
			showModal={showModal()}
			headerTitle={`Edit Transaction`}
			handleClose={props.handleClose}
		>
			<div class={styles.amountDetailsContainer}>
				<span id="transaction-type-container">
					<label for="type">Type</label>
					<select
						value={updatedValue.type ?? "expenses"}
						onChange={(e) => {
							setUpdatedValue("type", e.target.value as TransactionType);
						}}
						required={true}
						id="typeSelect"
						class={styles.formElements}
					>
						<For each={["expenses", "income", "investments"]}>
							{(i) => <option value={i}>{i}</option>}
						</For>
					</select>
				</span>
				<span>
					<label for="price">Amount</label>
					<input
						id="priceInput"
						type="number"
						name="price"
						placeholder="0,00"
						required={true}
						value={updatedValue.amount}
						onBlur={(e) => {
							e.preventDefault();
							setUpdatedValue("amount", Number(e.target.value));
						}}
					/>
				</span>
				<span>
					<label for="currency">Currency</label>
					{/*todo add exchange api*/}
					<select
						onChange={(e) => {
							setUpdatedValue("currency", e.target.value);
						}}
						required={true}
						id="currencySelect"
						class={styles.formElements}
						value={updatedValue.currency}
					>
						<For each={allCurrencies}>
							{(i) => (
								<option value={i.currency_code}>
									{i.currency_code} ({i.country})
								</option>
							)}
						</For>
					</select>
				</span>
			</div>
			<div class="grid grid-cols-2 gap-4 justify-center">
				<div>
					<label for="category" class="flex flex-col items-center">
						Category{" "}
						<Button
							onClick={() => {}}
							tooltipContent="Edit Category"
							id="edit-category"
							leftIcon={<EditIcon />}
							styleClass="transparent"
						/>
					</label>
					{category() && (
						<CardWithIcon
							colour={category()!.colour}
							title={category()!.name}
							icon={
								category()!.iconName
									? iconMap[category()!.iconName ?? "spinner"]?.()
									: ""
							}
							handleClick={() => {
								setUpdatedValue("ctg_name", category()!.name);
							}}
						/>
					)}
				</div>
				<div>
					<label for="date">Transaction Date</label>
					<div class={styles.dateButtonsContainer}>
						<Button
							type="button"
							styleClass={`secondary w-1/4`}
							onClick={() => {}}
						>
							<h3>{formatDate(date() ?? new Date())}</h3>
						</Button>
						{/*todo add fix date*/}
						{/*<Datepicker date={updatedValue().date} setDate={setUpdatedValue("date", date)} />*/}
					</div>
				</div>
			</div>
			<div>
				<label for="description">Transaction Notes</label>
				<textarea
					value={updatedValue.notes ?? ""}
					class={styles.formElements}
					id="description"
					rows="1"
					onBlur={(e) => setUpdatedValue("notes", e.target.value)}
				></textarea>
			</div>
			<div class="grid grid-cols-2 gap-10 mt-8">
				<Button
					styleClass="primary edit-submit mx-auto"
					leftIcon={<PlusIcon />}
					type="submit"
					onClick={handleEdit}
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
					Delete Transaction
				</Button>
			</div>
		</Modal>
	);
}
