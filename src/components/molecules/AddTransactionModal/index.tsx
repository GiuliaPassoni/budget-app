import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import CloseModalIconButton from "~/components/atoms/CloseModalIconButton";
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

import "./style.css";
import Button from "~/components/atoms/Button";

interface ModalProps {
	showModal: boolean;
	handleClose: () => void;
	onSubmit: () => void;
}
// todo what about using the <dialog> feature for modals? Do some research

export default function AddTransactionModal(props: ModalProps) {
	const showModal = () => props.showModal;

	const [method, setMethod] = createSignal<TransactionType>("expenses");
	const [amount, setAmount] = createSignal(0);
	const [currency, setCurrency] = createSignal("EUR");
	const [exchange, setExchange] = createSignal(1);
	const [category, setCategory] = createSignal("");
	const [note, setNote] = createSignal("");

	/*
	 * 11.11.24 mutations and queries may only be used in the component, but only at the component's scope level, not nested.
	 * If used within e.g. a function declared within the component, e.g. handleSubmit(), the queryClient isn't available within the
	 * handleSubmit scope, even though it should (and is) available globally.
	 * For example, the below will log and execute correctly:
	 * console.debug(
		"hello",
		createMutation(() => ({
			mutationKey: ["add-transaction"],
			mutationFn: () => {
				return addNewTransaction({
					transactionType: "expenses",
					transaction: {
						id: "string",
						amount: 1,
						currency: "string",
						exchange_to_default: 1,
						notes: "string",
						date: new Date(),
						ctg_name: "string",
					},
				});
			},
		})),
	);
	 * But the same declaration inside a function handleSubmit(){} declaration will not work.
	 *  */

	const [showCategModal, setShowCategModal] = createSignal<boolean>(false);
	function handleTabClick(prop: TransactionType) {
		setMethod(prop);
		test();
	}

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
		listenForCategoryUpdates(); // Set up real-time listener
	});

	// TODO add datepicker to transaction and modal

	return (
		<div class={`${showModal() ? "flex" : "hidden"}`}>
			<div id="default-styled-tab-content">
				<div aria-hidden={showModal()} class="overlay">
					<div class="modal-container">
						{/*Modal content*/}
						<div class="modal-content">
							{/*Modal header*/}
							<div class="header-container">
								<h3 class="header">Add New Transaction</h3>
								<CloseModalIconButton handleClick={props.handleClose} />
							</div>
							{/*Modal body*/}
							<div>
								<form>
									<div class="transaction-type-container">
										<label for="type">Type</label>
										{["expenses", "income", "investments"].map((i) => (
											<Button
												text={i.charAt(0).toUpperCase() + i.slice(1)}
												styleClass="mx-3"
												onClick={() => handleTabClick(i as TransactionType)}
											/>
										))}
									</div>
									<div class="amount-details-container">
										<span>
											<label for="price">Amount</label>
											<input
												type="number"
												name="price"
												id="price"
												placeholder="0,00"
												required={true}
												onBlur={(e) => {
													e.preventDefault();
													setAmount(Number(e.target.value));
												}}
											/>
										</span>
										<span>
											<label for="category">Currency</label>
											<select
												onChange={(e) => {
													setCurrency(e.target.value);
												}}
												required={true}
												id="category"
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
									<div class="category-container">
										<label for="category">Category</label>
										<div class="category-grid">
											<For each={categories()}>
												{(i) => (
													<CardWithIcon
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
												colour="green"
												title="Add category"
												icon={iconMap["plus"]}
												handleClick={() => {
													showCategModal();
												}}
											/>
										</div>
									</div>
									<div>
										<label for="description">Transaction Notes</label>
										<textarea
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
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
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
