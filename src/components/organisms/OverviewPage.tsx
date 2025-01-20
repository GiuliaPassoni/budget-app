import PlusIconButton from "~/components/atoms/PlusIconButton";
import Button from "~/components/atoms/Button";
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
import { currentUser, db } from "~/firebase";
import MainLayout from "~/components/organisms/MainLayout";
import PieChart from "~/components/atoms/PieChart";
import Toast from "~/components/molecules/Toast";
import { useFirebaseCollection } from "~/hooks/useFirebaseCollection";

export default function OverviewPage() {
	const [showTransactionModal, setShowTransactionModal] = createSignal(false);
	const [showCategModal, setShowCategModal] = createSignal(false);
	const [showToaster, setShowToaster] = createSignal(false);

	const [database, setDatabase] = createSignal<TransactionType>("expenses");
	const {
		data: transactions,
		loading,
		error,
	} = useFirebaseCollection<TransactionI, TransactionWithId>({
		db,
		collectionPath: () => {
			const userId = currentUser();
			return userId ? ["users", userId, database()] : undefined;
		},
	});

	return (
		<MainLayout title="Overview">
			<section class="w-full h-full mx-auto">
				<div class="flex flex-row justify-center">
					<button
						onClick={() => {
							setShowToaster(true);
							console.debug("click", showToaster());
						}}
					>
						Toaster
					</button>
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
				<section>
					<div class="flex flex-row w-1/2 mx-auto justify-between">
						<Button
							text="Show Expenses"
							onClick={() => {
								setDatabase("expenses");
							}}
						></Button>
						<Button
							text="Show Income"
							onClick={() => {
								setDatabase("income");
							}}
						></Button>
						<Button
							text="Show Investments"
							onClick={() => {
								setDatabase("investments");
							}}
						></Button>
					</div>
					<div class="w-full my-3 text-center font-bold text-xl">
						{database().toUpperCase()}
					</div>
					<div>
						{loading() && <p>Loading...</p>}
						{/*{error() && <p>Error: {error()}</p>}*/}
						{!loading() && !error() && <Table array={transactions()} />}
					</div>
				</section>
				<AddCategoryModal
					showModal={showCategModal()}
					handleClose={() => setShowCategModal(false)}
					onSubmit={() => setShowCategModal(false)}
				/>
				<AddTransactionModal
					showModal={showTransactionModal()}
					handleClose={() => setShowTransactionModal(false)}
					onSubmit={() => {
						setShowTransactionModal(false);
						// useAddTransaction(); TODO to be able to pass this, we need a context or a store to be able to retrieve the transaction data from the modal
					}}
				/>
				<Toast
					showModal={showToaster()}
					handleClose={() => setShowToaster(false)}
					type="success"
					message="this is a message"
				/>
				<PieChart
					w={10}
					h={10}
					margin={1}
					label="ctg_name"
					data={transactions() ?? []}
					value={(d) => d.amount}
				/>
			</section>
			<Toaster />
		</MainLayout>
	);
}
