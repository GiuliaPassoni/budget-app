import { createMemo, createSignal, For } from "solid-js";
import { toast, Toaster } from "solid-toast";
import {
	addNewTransaction,
	TransactionI,
} from "~/helpers/expenses_api_helpers";
import allCurrencies from "~/helpers/mock_values_helpers";
import PlusIconButton from "~/components/atoms/PlusIconButton";
import CardWithIcon from "~/components/molecules/CardWithIcon";
import { CategoryI, CategoryWithId, TransactionType } from "~/helpers/types";
import { getCategories } from "~/helpers/categories_api_helpers";
import { currentUser, db } from "~/firebase";
import AddCategoryModal from "~/components/molecules/AddCategoryModal";
import { iconMap } from "~/components/atoms/icons/helpers";
import Modal from "~/components/molecules/Modal";

import styles from "./style.module.css";
import Datepicker from "~/components/atoms/Datepicker";
import Button from "~/components/atoms/Button";
import { createStore } from "solid-js/store";
import { useFirebaseCollection } from "~/hooks/useFirebaseCollection";

interface ModalProps {
	showModal: boolean;
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

	const [date, setDate] = createSignal<Date>(new Date());
	const [transaction, setTransaction] = createStore<Pick<TransactionI, any>>({
		type: "expenses",
		amount: 0,
		currency: "EUR",
		exchange: 1,
		category: "",
		notes: "",
	});
	const [showCategModal, setShowCategModal] = createSignal<boolean>(false);
	function handleTabClick(prop: TransactionType) {
		setTransaction("type", prop); //todo is this necessary, since the db is already the type?
		test();
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

	async function test() {
		return await getCategories();
	}

	// todo refactor method to be included in hook and use as below
	// const { add: addTransaction } = useFirebaseCollection<
	// 	TransactionI,
	// 	TransactionWithId
	// >({
	// 	db,
	// 	collectionPath: () => {
	// 		const userId = currentUser();
	// 		return userId ? [`users/${currentUser()}/transactions`] : undefined;
	// 	},
	// });

	async function handleSubmit() {
		// TODO refactor the below to be all props of one single signal-object
		const { amount, currency, exchange, category, type, notes } = transaction;
		if (amount && currency && exchange && category) {
			const newTransaction = {
				amount,
				currency,
				exchange_to_default: exchange,
				notes,
				date: new Date(),
				ctg_name: category,
				type,
			};
			if (!type) {
				toast.error("Please specify transaction type");
			} else {
				if (props.onSubmit) {
					props.onSubmit;
				}
				await addNewTransaction({
					transactionType: type,
					transaction: newTransaction,
				});
				props.handleClose();
			}
		} else {
			toast.error("Missing input");
		}
	}

	// // todo hanlde tags in database. for now, use dummy
	// const dummyTags = ["flights", "Lidl", "train", "coffee"];
	// const [tags, setTags] = createSignal(dummyTags);

	const { data: categories } = useFirebaseCollection<CategoryI, CategoryWithId>(
		{
			db,
			collectionPath: () => {
				const userId = currentUser();
				return userId ? [`users/${currentUser()}/categories`] : undefined;
			},
		},
	);

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
					{/*//todo fix scrollbar not showing. The issue is the OS.*/}
					<div class={`${styles.categoryGrid} scrollbar-always`}>
						<For each={categories()}>
							{(i) => (
								<CardWithIcon
									selected={i.name === transaction.category}
									colour={i.colour}
									title={i.name}
									icon={i.iconName ? iconMap[i.iconName]?.() : ""}
									handleClick={() => {
										setTransaction("category", i.name);
									}}
								/>
							)}
						</For>
						{/*todo connect category modal, or handle the flow otherwise*/}
						<CardWithIcon
							colour="gray"
							title="More"
							icon={iconMap["plus"]}
							handleClick={() => {
								setShowCategModal(true);
							}}
						/>
					</div>
				</div>
				<div>
					<label for="date">Transaction Date</label>
					<div class={styles.dateButtonsContainer}>
						<For each={dates()}>
							{(item) => (
								<Button
									type="button"
									styleClass={`secondary w-1/4 ${isButtonSelected(item.date) ? "selected" : ""}`}
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
				<PlusIconButton
					type="submit"
					variant="primary"
					handleClick={async (e: Event) => {
						e.preventDefault();
						await handleSubmit();
					}}
					title="Add new transaction"
				/>
			</Modal>
			{/*todo try to pass the mutation as a prop from here, since scope is available here - hopefully it maintains the reference */}
			<AddCategoryModal
				showModal={showCategModal()}
				handleClose={() => setShowCategModal(false)}
				onSubmit={() => setShowCategModal(false)}
			/>
			{/*todo update code and publish in repo, then send to Cam for him to play around with*/}
			<Toaster />
		</div>
	);
}
