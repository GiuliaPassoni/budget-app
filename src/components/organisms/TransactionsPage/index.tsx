import PlusIconButton from "~/components/atoms/PlusIconButton";
import Table from "~/components/molecules/Table";
import AddCategoryModal from "~/components/molecules/AddCategoryModal";
import AddTransactionModal from "~/components/molecules/AddTransactionModal";
import { Toaster } from "solid-toast";
import { createSignal } from "solid-js";
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

function capitalizeFirstLetter(val: string): string {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export default function TransactionsPage() {
	const [showTransactionModal, setShowTransactionModal] = createSignal(false);
	const [showCategModal, setShowCategModal] = createSignal(false);
	const [showToaster, setShowToaster] = createSignal(false);

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
							<div class="w-1/4 flex flex-col justify-between">
								<div class="p-6 border rounded-lg shadow-sm bg-gray-800 border-gray-700">
									<PieChart
										w={5}
										h={5}
										margin={1}
										label="ctg_name"
										data={transactions() ?? []}
										value={(d) => d.amount}
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
				<div class="flex flex-row justify-center">
					<PlusIconButton
						type="button"
						variant="primary"
						title="Record transaction"
						handleClick={() => {
							setShowTransactionModal(true);
						}}
					/>
					<PlusIconButton
						variant="secondary"
						type="button"
						title="Add category"
						handleClick={() => {
							setShowCategModal(true);
						}}
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
