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
// todo add skeleton table while data loads (from usefirebasehook loading state)
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
	const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("desc");
	const [sortedArray, setSortedArray] = createSignal<TransactionI[]>(
		props.array || [],
	);
	const [selectedTransaction, setSelectedTransaction] = createSignal<
		TransactionI | undefined
	>(undefined);
	const [showEditTransactionModal, setShowEditTransactionModal] =
		createSignal(false);

	const sortByDate = () => {
		const newSortOrder = sortOrder() === "asc" ? "desc" : "asc";
		setSortOrder(newSortOrder);

		const sorted = [...sortedArray()].sort((a, b) => {
			const dateA = firestoreTimestampToDate(a.date).getTime();
			const dateB = firestoreTimestampToDate(b.date).getTime();
			return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
		});

		setSortedArray(sorted);
	};

	const headers: Header[] = [
		{
			headerName: "Transaction amount",
			styleClass: "header-left",
		},
		{ headerName: "Currency" },
		{
			headerName: "Date",
			styleClass: "px-6 py-3",
			isSortable: true,
			sortFn: sortByDate,
		},
		{ headerName: "Category" },
		{ headerName: "Notes" },
		{ headerName: "Action", styleClass: "header-right" },
	];

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
								<For each={sortedArray()}>
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

type Header = {
	headerName: string;
	styleClass?: string;
	isSortable?: boolean;
	sortDirection?: "asc" | "desc";
	sortFn?: () => void;
};

interface HeaderPropsI {
	headers: Header[];
}

function Header(props: HeaderPropsI) {
	const headers = () => props.headers;
	return (
		<thead>
			<tr>
				<For each={headers()}>
					{(i) => (
						<th scope="col" class={i.styleClass ?? ""}>
							{i.headerName}{" "}
							{i.isSortable ? <SortIcon onClick={i.sortFn} /> : ""}
						</th>
					)}
				</For>
			</tr>
		</thead>
	);
}

const SortIcon = (props: any) => {
	return (
		<button onClick={props.onClick}>
			<svg class="w-3 h-3 ms-1.5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
			</svg>
		</button>
	);
};
