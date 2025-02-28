import {
	createEffect,
	createMemo,
	createSignal,
	For,
	onMount,
	Show,
} from "solid-js";
import { toast, Toaster } from "solid-toast";
import {
	TransactionI,
	TransactionWithId,
} from "~/helpers/expenses_api_helpers";
import allCurrencies from "~/helpers/mock_values_helpers";
import CardWithIcon from "~/components/molecules/CardWithIcon";
import { CategoryI, CategoryWithId, TransactionType } from "~/helpers/types";
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
import {
	isSameDay,
	today,
	twoDaysAgo,
	yesterday,
} from "~/components/molecules/AddTransactionModal/datepickerHelpers";
import { useAuthState } from "~/services/provider/auth";
import { getExchange } from "~/helpers/currency";

interface ModalProps {
	showModal: boolean;
	isEditTransactionModal: boolean;
	transactionToEdit?: TransactionI;
	handleClose: () => void;
	onSubmit: () => void;
}

export default function AddTransactionModal(props: ModalProps) {
	const showModal = () => props.showModal;
	const isEditTransactionModal = () => props.isEditTransactionModal;

	const { user, loading: userLoading } = useAuthState();

	const [pageLoading, setPageLoading] = createSignal<boolean>(false);
	const [exchangeLoading, setExchangeLoading] = createSignal<boolean>(false);
	const [showCategModal, setShowCategModal] = createSignal<boolean>(false);
	const [date, setDate] = createSignal<Date>(new Date());

	const initialTransaction = createMemo(() => {
		if (props.isEditTransactionModal && props.transactionToEdit) {
			// Edit mode
			return {
				...props.transactionToEdit,
				type: props.transactionToEdit.type,
				amount: props.transactionToEdit.amount,
				currency: props.transactionToEdit.currency,
				ctg_name: props.transactionToEdit.ctg_name,
				notes: props.transactionToEdit.notes,
			};
		}

		// Else, add transaction mode
		return {
			type: "expenses",
			amount: 0,
			currency: user ? user?.selectedCurrency : "EUR",
			exchange_to_default: 1,
			exchange_on_date: new Date().toISOString(), //only to record historical exchange rate
			ctg_name: "",
			ctg_colour: "",
			notes: "",
			converted_amount: 0,
		};
	});

	const [transaction, setTransaction] =
		createStore<Pick<TransactionI, any>>(initialTransaction());

	// Date must be handled separately due to datepicker config
	createEffect(() => {
		if (props.isEditTransactionModal && props.transactionToEdit) {
			setDate(props.transactionToEdit.date.toDate());
		} else {
			setDate(new Date());
		}
	});

	const {
		add: addTransaction,
		deleteItem,
		updateItem,
	} = useFirebaseCollection<TransactionI, TransactionWithId>({
		collectionPath: () => [`users/${currentUser()}/${transaction.type}`],
	});

	const { data: categories, loading: loadingCategories } =
		useFirebaseCollection<CategoryI, CategoryWithId>({
			collectionPath: () => [`users/${currentUser()}/categories`],
		});

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

	function isButtonSelected(buttonDate: Date) {
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
	}

	async function handleSubmit() {
		const {
			amount,
			currency,
			exchange_to_default,
			exchange_on_date,
			ctg_name,
			ctg_colour,
			type,
			notes,
		} = transaction;
		if (transaction) {
			if (currency !== user?.selectedCurrency) {
				try {
					await handleExchange();
				} catch (error) {
					throw new Error();
				}
			}
			const newTransaction = {
				amount,
				currency,
				exchange_to_default,
				exchange_on_date,
				notes,
				date: date(),
				ctg_name,
				ctg_colour,
				type,
			};
			if (!type) {
				toast.error("Please specify transaction type");
			}
			try {
				await addTransaction(newTransaction);
				if (props.onSubmit) {
					props.onSubmit();
				}
				props.handleClose();
			} catch (error: any) {
				toast.error(`Failed to add transaction: ${error.message}`);
			}
		} else {
			//fixme toast or error ux signals
			toast.error("Missing input");
		}
	}

	async function handleExchange() {
		try {
			setExchangeLoading(true);
			const res = await getExchange({
				fromCurrency: user?.selectedCurrency ?? "EUR",
				toCurrency: transaction.currency,
			});
			setTransaction(
				"exchange_to_default",
				res?.rate[user?.selectedCurrency || "EUR"],
			);
			setTransaction("exchange_on_day", res?.date);
		} catch (error) {
			setExchangeLoading(false);
			throw new Error(error);
		} finally {
			setExchangeLoading(false);
		}
	}

	async function handleEdit() {
		await updateItem({
			dbName: transaction.type,
			itemRef: transaction.id,
			updatedValue: { ...transaction, date: date() },
		});

		props.handleClose();
	}

	async function handleDelete() {
		await deleteItem({
			dbName: transaction.type,
			itemRef: transaction.id,
		});

		props.handleClose();
	}

	onMount(() => {
		if (!user && userLoading) {
			setPageLoading(true);
		} else {
			setPageLoading(false);
		}
	});

	return (
		<div>
			{/*todo add required fields => can't submit if e.g. no category selected*/}
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
								setTransaction("type", e.target.value as TransactionType);
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
						<select
							onChange={async (e) => {
								const currency = e.target.value;
								setTransaction("currency", currency);
								if (transaction.currency !== user?.selectedCurrency) {
									await handleExchange();
								}
							}}
							required={true}
							id="currencySelect"
							class={styles.formElements}
							value={transaction.currency ?? user?.selectedCurrency}
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
				<Show when={!exchangeLoading()} fallback={<LoadingSpinner />}>
					<Show when={transaction.currency !== user?.selectedCurrency}>
						<div class="text-center italic text-md">
							→{" "}
							{(transaction.amount * transaction.exchange_to_default).toFixed(
								2,
							)}{" "}
							{user?.selectedCurrency} ( 1 {user?.selectedCurrency} ={" "}
							{transaction.exchange_to_default} {transaction.currency})
						</div>
					</Show>
				</Show>
				<div class={styles.categoryContainer}>
					<label for="category">Category</label>
					<Show when={!loadingCategories()} fallback={<LoadingSpinner />}>
						<div class={`${styles.categoryGrid} scrollbar-always`}>
							{/*todo fix the selection filtering below - ux isn't great*/}
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
										: categories().filter(
												(cat) => cat.type === transaction.type,
											)
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
											setTransaction("ctg_colour", i.colour);
										}}
									/>
								)}
							</For>
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
				<div>
					<label for="description">Transaction Notes</label>
					<textarea
						value={isEditTransactionModal() ? transaction?.notes : ""}
						class={styles.formElements}
						id="description"
						rows="1"
						placeholder=""
						onBlur={(e) => setTransaction("notes", e.target.value)}
					></textarea>
				</div>
				{/*fixme tooltip doesn't work, may be hiding behind modal*/}
				{/*fixme add debounce*/}
				<Show
					when={isEditTransactionModal()}
					fallback={
						<Button
							disabled={
								pageLoading() || exchangeLoading() || loadingCategories()
							}
							leftIcon={<PlusIcon />}
							type="submit"
							styleClass="primary mt-6"
							onClick={async () => {
								await handleSubmit();
								props.handleClose();
							}}
							text="Add new transaction"
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
							}}
							text="Save edit"
						/>

						<Button
							leftIcon={<BinIcon />}
							type="submit"
							styleClass="danger mx-auto"
							onClick={async () => {
								await handleDelete();
							}}
						>
							Delete Transaction
						</Button>
					</div>
				</Show>
			</Modal>
			<AddCategoryModal
				isEditCategoryModal={false}
				showModal={showCategModal()}
				handleClose={() => setShowCategModal(false)}
				onSubmit={() => setShowCategModal(false)}
			/>
			<Toaster />
		</div>
	);
}
