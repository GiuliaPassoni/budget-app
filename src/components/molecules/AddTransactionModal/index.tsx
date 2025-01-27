import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { toast, Toaster } from "solid-toast";
import {
	TransactionI,
	TransactionWithId,
} from "~/helpers/expenses_api_helpers";
import allCurrencies from "~/helpers/mock_values_helpers";
import PlusIconButton from "~/components/atoms/PlusIconButton";
import CardWithIcon from "~/components/molecules/CardWithIcon";
import { CategoryI, CategoryWithId, TransactionType } from "~/helpers/types";
import {
	deleteItem,
	getItemByIdOrName,
	updateItem,
} from "~/helpers/categories_api_helpers";
import { currentUser } from "~/firebase";
import AddCategoryModal from "~/components/molecules/AddCategoryModal";
import { iconMap } from "~/components/atoms/icons/helpers";
import Modal from "~/components/molecules/Modal";

import styles from "./style.module.css";
import Datepicker from "~/components/atoms/Datepicker";
import Button from "~/components/atoms/Button";
import { createStore } from "solid-js/store";
import { useFirebaseCollection } from "~/hooks/useFirebaseCollection";
import PlusIcon from "~/components/atoms/icons/PlusIcon";
import BinIcon from "~/components/atoms/icons/BinIcon";
import LoadingSpinner from "~/components/atoms/LoadingSpinner";

interface ModalProps {
	showModal: boolean;
	isEditTransactionModal: boolean;
	transactionToEdit?: TransactionI;
	handleClose: () => void;
	onSubmit: () => void;
}
// todo what about using the <dialog> feature for modals? Do some research

const today = new Date();
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2));

const isSameDay = (date1: Date, date2: Date) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

export default function AddTransactionModal(props: ModalProps) {
	const showModal = () => props.showModal;
	const [loading, setIsLoading] = createSignal<boolean>(false);
	const isEditTransactionModal = () => props.isEditTransactionModal;
	const [showCategModal, setShowCategModal] = createSignal<boolean>(false);
	const [date, setDate] = createSignal<Date>(new Date());
	const [transaction, setTransaction] = createStore<Pick<TransactionI, any>>({
		type: "expenses",
		amount: 0,
		currency: "EUR",
		exchange_to_default: 1,
		ctg_name: "",
		notes: "",
		// 	date is separate due to datepicker config
	});
	const [editCategory, setEditCategory] = createSignal<CategoryI>();

	onMount(async () => {
		if (isEditTransactionModal() && props.transactionToEdit) {
			setIsLoading(true);
			setTransaction(props.transactionToEdit);
			try {
				const ctgName = transaction.ctg_name;
				const categ = await getItemByIdOrName({
					dbName: "categories",
					name: ctgName,
				});
				if (categ) {
					setEditCategory(categ.data);
				} else {
					console.warn("No category found");
				}
			} catch (err) {
				console.error("Failed to load category:", err);
			} finally {
				setIsLoading(false);
			}
		} else {
			// Reset to default values for "Add" mode
			setTransaction({
				type: "expenses",
				amount: 0,
				currency: "EUR",
				exchange_to_default: 1,
				ctg_name: "",
				notes: "",
			});
		}
	});

	function handleTabClick(prop: TransactionType) {
		setTransaction("type", prop); //todo replace with separate signal?
	}

	const dates = createMemo(() => {
		// If selected date is not today or yesterday, show it in the third slot
		const selectedDate = date();
		const isSelectedTodayOrYesterday =
			isSameDay(selectedDate, today) || isSameDay(selectedDate, yesterday);
		const thirdDate = isSelectedTodayOrYesterday ? twoDaysAgo : selectedDate;
		const thirdLabel = isSelectedTodayOrYesterday ? "2 days ago" : "selected";

		return [
			{ label: "today", date: today },
			{ label: "yesterday", date: yesterday },
			{ label: thirdLabel, date: thirdDate },
		];
	});

	const isButtonSelected = (buttonDate: Date) => {
		const selectedDate = date();
		const today = new Date();
		const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

		// If date is today or yesterday, only those buttons can be selected
		if (isSameDay(selectedDate, today) || isSameDay(selectedDate, yesterday)) {
			return isSameDay(selectedDate, buttonDate);
		}

		// Otherwise, only the third button can be selected
		return (
			isSameDay(selectedDate, buttonDate) &&
			!isSameDay(buttonDate, today) &&
			!isSameDay(buttonDate, yesterday)
		);
	};

	async function handleSubmit() {
		const { amount, currency, exchange_to_default, ctg_name, type, notes } =
			transaction;
		if (transaction) {
			const newTransaction = {
				amount,
				currency,
				exchange_to_default,
				notes,
				date: new Date(),
				ctg_name,
				type,
			};
			if (!type) {
				toast.error("Please specify transaction type");
			}
			try {
				const newTransactionId = await addTransaction(newTransaction);
				if (props.onSubmit) {
					props.onSubmit();
				}
				props.handleClose();
			} catch (error) {
				toast.error(`Failed to add transaction: ${error.message}`);
			}
		} else {
			toast.error("Missing input");
		}
	}

	const { add: addTransaction } = useFirebaseCollection<
		TransactionI,
		TransactionWithId
	>({ collectionPath: () => [`users/${currentUser()}/${transaction.type}`] });

	const { data: categories } = useFirebaseCollection<CategoryI, CategoryWithId>(
		{
			collectionPath: () => [`users/${currentUser()}/categories`],
		},
	);

	async function handleEdit() {
		return await updateItem({
			dbName: transaction.type,
			itemRef: transaction.id,
			updatedValue: transaction,
		});
	}

	async function handleDelete() {
		return await deleteItem({
			dbName: transaction.type,
			itemRef: transaction.id,
		});
	}

	return (
		<div>
			<Modal
				showModal={showModal()}
				headerTitle="Add Transaction"
				handleClose={props.handleClose}
			>
				<div class={styles.amountDetailsContainer}>
					<span id="transaction-type-container">
						<label for="type">Type</label>
						<select
							onChange={(e) => {
								handleTabClick(e.target.value as TransactionType);
							}}
							required={true}
							id="typeSelect"
							class={styles.formElements}
							value={transaction?.type ?? "expenses"}
						>
							<For each={["expenses", "income", "investments"]}>
								{(i) => <option value={i}>{i}</option>}
							</For>
						</select>
					</span>
					<span>
						<label for="price">Amount</label>
						<input
							value={isEditTransactionModal() ? transaction?.amount : 0}
							id="priceInput"
							type="number"
							name="price"
							placeholder="0,00"
							required={true}
							onBlur={(e) => {
								e.preventDefault();
								setTransaction("amount", Number(e.target.value));
							}}
						/>
					</span>
					<span>
						<label for="currency">Currency</label>
						{/*todo add exchange api*/}
						<select
							onChange={(e) => {
								setTransaction("currency", e.target.value);
							}}
							required={true}
							id="currencySelect"
							class={styles.formElements}
							value={transaction.currency ?? "EUR"} //TODO fix default currency to user's
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
				<div class={styles.categoryContainer}>
					<label for="category">Category</label>
					<Show when={!loading()} fallback={<LoadingSpinner />}>
						<div class={`${styles.categoryGrid} scrollbar-always`}>
							<For
								each={
									isEditTransactionModal()
										? [
												// Move the matching category to the front
												...categories().filter(
													(cat) => cat.name === transaction.ctg_name,
												),
												// Include the rest of the categories
												...categories().filter(
													(cat) => cat.name !== transaction.ctg_name,
												),
											]
										: categories() // Use the original list if not in edit mode
								}
							>
								{(i) => (
									<CardWithIcon
										selected={i.name === transaction.ctg_name}
										colour={i.colour}
										title={i.name}
										icon={i.iconName ? iconMap[i.iconName]?.() : ""}
										handleClick={() => {
											setTransaction("ctg_name", i.name);
										}}
									/>
								)}
							</For>
							{/*todo connect category modal, or handle the flow otherwise*/}
							<CardWithIcon
								colour="gray"
								title="Add new category"
								icon={iconMap["plus"]}
								handleClick={() => {
									setShowCategModal(true);
								}}
							/>
						</div>
					</Show>
				</div>
				<div>
					<label for="date">Transaction Date</label>
					<div class={styles.dateButtonsContainer}>
						<For each={dates()}>
							{(item) => (
								<Button
									type="button"
									styleClass={`secondary ${isButtonSelected(item.date) ? "selected" : ""}`}
									onClick={() => setDate(item.date)}
								>
									<h3>
										{(item.date as Date).toLocaleDateString("en-GB", {
											day: "2-digit",
											month: "2-digit",
										})}
									</h3>
									<p>{item.label}</p>
								</Button>
							)}
						</For>
						<Datepicker date={date} setDate={setDate} />
					</div>
				</div>
				{/*<div>*/}
				{/*	<label for="tags">Tags</label>*/}
				{/*	<div class={styles.tagsContainer}>*/}
				{/*		<For each={tags()}>*/}
				{/*			{(i) => (*/}
				{/*				<Button styleClass="secondary" onClick={() => setTags(i)}>*/}
				{/*					#{i}*/}
				{/*				</Button>*/}
				{/*			)}*/}
				{/*		</For>*/}
				{/*		<Button*/}
				{/*			onClick={(e) => dummyTags.push(e.target.value)}*/}
				{/*			leftIcon={<PlusIcon />}*/}
				{/*		>*/}
				{/*			Add me*/}
				{/*		</Button>*/}
				{/*	</div>*/}
				{/*</div>*/}
				<div>
					<label for="description">Transaction Notes</label>
					<textarea
						class={styles.formElements}
						id="description"
						rows="1"
						placeholder=""
						onBlur={(e) => setTransaction("notes", e.target.value)}
					></textarea>
				</div>
				{/*tooltip doesn't work, may be hiding behind modal*/}
				<Show
					when={isEditTransactionModal()}
					fallback={
						<PlusIconButton
							type="submit"
							variant="primary"
							handleClick={async (e: Event) => {
								e.preventDefault();
								await handleSubmit();
							}}
							title="Add new transaction"
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
							Delete Transaction
						</Button>
					</div>
				</Show>
			</Modal>
			{/*todo try to pass the mutation as a prop from here, since scope is available here - hopefully it maintains the reference */}
			<AddCategoryModal
				isEditCategoryModal={false}
				showModal={showCategModal()}
				handleClose={() => setShowCategModal(false)}
				onSubmit={() => setShowCategModal(false)}
			/>
			{/*todo update code and publish in repo, then send to Cam for him to play around with*/}
			<Toaster />
		</div>
	);
}
