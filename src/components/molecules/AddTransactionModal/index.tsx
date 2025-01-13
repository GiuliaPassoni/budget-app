import {
	createEffect,
	createMemo,
	createSignal,
	For,
	onCleanup,
} from "solid-js";
import { toast, Toaster } from "solid-toast";
import { addNewTransaction } from "~/helpers/expenses_api_helpers";
import allCurrencies from "~/helpers/mock_values_helpers";
import PlusIconButton from "~/components/atoms/PlusIconButton";
import CardWithIcon from "~/components/molecules/CardWithIcon";
import { CategoryI, TransactionType } from "~/helpers/types";
import { getCategories } from "~/helpers/categories_api_helpers";
import { currentUser, db } from "~/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import AddCategoryModal from "~/components/molecules/AddCategoryModal";
import { iconMap } from "~/components/atoms/icons/helpers";
import Modal from "~/components/molecules/Modal";

import styles from "./style.module.css";
import Datepicker from "~/components/atoms/Datepicker";
import Button from "~/components/atoms/Button";
import PlusIcon from "~/components/atoms/icons/PlusIcon";

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

	const [method, setMethod] = createSignal<TransactionType>("expenses");
	const [date, setDate] = createSignal<Date>(new Date());
	const [amount, setAmount] = createSignal(0);
	const [currency, setCurrency] = createSignal("EUR");
	const [exchange, setExchange] = createSignal(1);
	const [category, setCategory] = createSignal("");
	const [note, setNote] = createSignal("");

	const [showCategModal, setShowCategModal] = createSignal<boolean>(false);
	function handleTabClick(prop: TransactionType) {
		setMethod(prop);
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

	async function handleSubmit() {
		// TODO refactor the below to be all props of one single signal-object
		if (amount() && currency() && exchange() && category()) {
			const transaction = {
				amount: amount(),
				currency: currency(),
				exchange_to_default: exchange(),
				notes: note(),
				date: new Date(),
				ctg_name: category(),
			};
			if (!method) {
				toast.error("Please specify transaction type");
			} else {
				props.onSubmit
					? props.onSubmit()
					: await addNewTransaction({ transactionType: method(), transaction });
			}
		} else {
			toast.error("Missing input");
		}
	}

	// todo hanlde tags in database. for now, use dummy
	const dummyTags = ["flights", "Lidl", "train", "coffee"];
	const [tags, setTags] = createSignal(dummyTags);

	const [categories, setCategories] = createSignal<CategoryI[] | undefined>([]);
	// todo use errors and loading states
	// todo write cleaner code instead of copy-pasting solution from overview page
	const [loading, setLoading] = createSignal(true);
	const [error, setError] = createSignal("");

	// Function to handle real-time updates
	function listenForCategoryUpdates() {
		const userId = currentUser(); // Get the current user ID

		if (!userId) {
			setError("User not logged in");
			setLoading(false);
			return;
		}

		const categoriesCollection = collection(db, "users", userId, "categories");

		const unsubscribe = onSnapshot(
			categoriesCollection,
			(snapshot) => {
				const categoriesList = snapshot.docs.map((doc) => {
					const data = doc.data() as CategoryI; // Explicitly cast to TransactionI
					return {
						...data,
						id: doc.id,
					};
				});
				setCategories(categoriesList);
				setLoading(false);
			},
			(err) => {
				setError("Failed to load categories");
				console.error(err);
				setLoading(false);
			},
		);

		// Cleanup listener on component unmount
		onCleanup(() => unsubscribe());
	}

	createEffect(() => {
		console.debug("date", date());
		listenForCategoryUpdates(); // Set up real-time listener
	});

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
								setAmount(Number(e.target.value));
							}}
						/>
					</span>
					<span>
						<label for="currency">Currency</label>
						<select
							onChange={(e) => {
								setCurrency(e.target.value);
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
									selected={i.name === category()}
									colour={i.colour}
									title={i.name}
									icon={i.iconName ? iconMap[i.iconName]?.() : ""}
									handleClick={() => {
										setCategory(i.name);
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
								showCategModal();
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
				<div>
					<label for="tags">Tags</label>
					<div class={styles.tagsContainer}>
						<For each={tags()}>
							{(i) => (
								<Button styleClass="secondary" onClick={() => setTags(i)}>
									#{i}
								</Button>
							)}
						</For>
						<Button
							onClick={(e) => dummyTags.push(e.target.value)}
							leftIcon={<PlusIcon />}
						>
							Add me
						</Button>
					</div>
				</div>
				<div>
					<label for="description">Transaction Notes</label>
					<textarea
						class={styles.formElements}
						id="description"
						rows="1"
						placeholder=""
						value={note()}
						onBlur={(e) => setNote(e.target.value)}
					></textarea>
				</div>
				{/*tooltip doesn't work, may be hiding behind modal*/}
				<PlusIconButton
					type="submit"
					variant="primary"
					handleClick={async (e: Event) => {
						e.preventDefault();
						await handleSubmit();
						props.handleClose();
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
