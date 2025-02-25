import Table from "~/components/molecules/Table";
import AddCategoryModal from "~/components/molecules/AddCategoryModal";
import AddTransactionModal from "~/components/molecules/AddTransactionModal";
import { Toaster } from "solid-toast";
import { createSignal, onMount } from "solid-js";
import { TransactionType } from "~/helpers/types";
import {
	TransactionI,
	TransactionWithId,
} from "~/helpers/expenses_api_helpers";
import { currentUser } from "~/firebase";
import MainLayout from "~/components/organisms/MainLayout";
import PieChart from "~/components/atoms/PieChart";
import Toast from "~/components/molecules/Toast";
import { useFirebaseCollection } from "~/hooks/useFirebaseCollection";
import Tabs from "~/components/molecules/Tabs";
import PlusIcon from "~/components/atoms/icons/PlusIcon";
import Button from "~/components/atoms/Button";
import { useAuthState } from "~/services/provider/auth";

function capitalizeFirstLetter(val: string): string {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export default function TransactionsPage() {
	const [showTransactionModal, setShowTransactionModal] = createSignal(false);
	const [showCategModal, setShowCategModal] = createSignal(false);
	const [showToaster, setShowToaster] = createSignal(false);

	const { user } = useAuthState();
	const [currency, setCurrency] = createSignal("EUR");

	const [database, setDatabase] = createSignal<TransactionType>("expenses");
	const {
		data: transactions,
		loading,
		error,
	} = useFirebaseCollection<TransactionI, TransactionWithId>({
		collectionPath: () => {
			const userId = currentUser();
			return userId ? ["users", userId, database()] : undefined;
		},
	});

	const transactionTypes: TransactionType[] = [
		"expenses",
		"income",
		"investments",
	];

	onMount(async () => {
		if (user) {
			setCurrency(user.selectedCurrency);
		}
	});

	const tabs = transactionTypes.map((type) => ({
		name: capitalizeFirstLetter(type),
		onClick: () => {
			setDatabase(type);
		},
		content: (
			<>
				<div>
					{loading() && <p>Loading...</p>}
					{/*{error() && <p>Error: {error()}</p>}*/}
					{!loading() && !error() && (
						<div class="w-full flex flex-row gap-4">
							<div class="w-3/4 p-6 border rounded-lg shadow-sm bg-gray-800 border-gray-700">
								<Table type={database()} array={transactions()} />
							</div>
							<div class="w-1/4 mx-auto flex flex-col justify-between">
								<div class="p-6 border rounded-lg shadow-sm bg-gray-800 border-gray-700">
									<PieChart
										w={8}
										h={8}
										margin={0.5}
										label="ctg_name"
										userCurrency={currency()}
										data={transactions() ?? []}
										value={(d) => {
											if (d.exchange_to_default === 1) {
												return d.amount;
											} else {
												return d.amount * d.exchange_to_default;
											}
										}}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</>
		),
	}));

	return (
		<MainLayout title="Transactions">
			<section class="w-full h-full mx-auto">
				<div class="flex flex-row justify-center gap-2.5">
					<Button
						styleClass="primary"
						leftIcon={<PlusIcon />}
						type="button"
						onClick={() => {
							setShowTransactionModal(true);
						}}
						text="Record transaction"
					/>
					<Button
						styleClass="primary"
						leftIcon={<PlusIcon />}
						type="button"
						onClick={() => {
							setShowCategModal(true);
						}}
						text="Add category"
					/>
				</div>
				<Tabs tabs={tabs} />
				<AddCategoryModal
					showModal={showCategModal()}
					handleClose={() => setShowCategModal(false)}
					onSubmit={() => setShowCategModal(false)}
					isEditCategoryModal={false}
				/>
				<AddTransactionModal
					isEditTransactionModal={false}
					showModal={showTransactionModal()}
					handleClose={() => setShowTransactionModal(false)}
					onSubmit={() => {
						setShowTransactionModal(false);
					}}
				/>
				<Toast
					showModal={showToaster()}
					handleClose={() => setShowToaster(false)}
					type="success"
					message="this is a message"
				/>
			</section>
			<Toaster />
		</MainLayout>
	);
}
