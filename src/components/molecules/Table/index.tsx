import { TransactionI } from "~/helpers/expenses_api_helpers";
import { createSignal, For } from "solid-js";
import { format } from "date-fns";

import "./style.css";
import Button from "~/components/atoms/Button";
import EditIcon from "~/components/atoms/icons/EditIcon";
import { TransactionType } from "~/helpers/types";
import AddTransactionModal from "~/components/molecules/AddTransactionModal";

interface TableProps {
	array: TransactionI[] | undefined;
	type: TransactionType;
}

// todo these date functions are throwing random dates
export function formatDate(date: Date | string) {
	return format(typeof date === "string" ? new Date(date) : date, "dd-MM-yyyy");
}

function firestoreTimestampToDate(timestamp: {
	seconds: number;
	nanoseconds: number;
}): Date {
	return new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
}

export default function Table(props: TableProps) {
	const headers = [
		"Transaction amount",
		"Currency",
		"Date",
		"Category",
		"Notes",
	];

	const [showEditTransactionModal, setShowEditTransactionModal] =
		createSignal(false);
	const [selectedTransaction, setSelectedTransaction] = createSignal<
		TransactionI | undefined
	>(undefined);

	// todo add filtering

	return (
		<div>
			<div class="container">
				<table>
					<Header headers={headers} />
					<tbody>
						{props.array?.length === 0 || !props.array ? (
							<tr>
								<td colSpan={6} class="no-data">
									No data available
								</td>
							</tr>
						) : (
							<>
								<For each={props.array}>
									{(transaction) => (
										<tr>
											<td>{transaction.amount}</td>
											<td>{transaction.currency}</td>
											<td>
												{formatDate(firestoreTimestampToDate(transaction.date))}
											</td>
											<td>{transaction.ctg_name}</td>
											<td>{transaction.notes}</td>
											<td class="actions-cell">
												{/*todo add action*/}
												<Button
													onClick={() => {
														setSelectedTransaction(transaction);
														setShowEditTransactionModal(true);
													}}
													text={""}
													leftIcon={<EditIcon />}
													styleClass="secondary"
												/>
											</td>
										</tr>
									)}
								</For>
								{/*todo add pagination in footer*/}
								{/*<tr>*/}
								{/*	<td colSpan={6} class="table-footer-group">*/}
								{/*		Pagination*/}
								{/*	</td>*/}
								{/*</tr>*/}
							</>
						)}
					</tbody>
				</table>
			</div>
			{showEditTransactionModal() && selectedTransaction() && (
				<AddTransactionModal
					showModal={showEditTransactionModal()}
					isEditTransactionModal={true}
					transactionToEdit={selectedTransaction()}
					handleClose={() => setShowEditTransactionModal(false)}
					onSubmit={() => setShowEditTransactionModal(false)}
				/>
			)}
		</div>
	);
}

interface HeaderPropsI {
	headers: string[];
}

function Header(props: HeaderPropsI) {
	return (
		<thead>
			<tr>
				{/*<For each={props.headers}>*/}
				{/*	{(i) => <th scope="col">{i}</th>}*/}
				{/*</For>*/}
				<th scope="col" class="header-left">
					Transaction amount
				</th>
				<th scope="col">Currency</th>
				<th scope="col" class="px-6 py-3">
					Date
				</th>
				<th scope="col">Category</th>
				<th scope="col">Notes</th>
				<th scope="col" class="header-right">
					Actions
				</th>
			</tr>
		</thead>
	);
}
