import { TransactionI } from "~/helpers/expenses_api_helpers";
import { createMemo, createSignal, For } from "solid-js";
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
	// sorts desc by default
	const sortedArray = createMemo(() => {
		const array = props.array || [];
		return [...array].sort((a, b) => {
			const dateA = firestoreTimestampToDate(a.date).getTime();
			const dateB = firestoreTimestampToDate(b.date).getTime();
			return sortOrder() === "asc" ? dateA - dateB : dateB - dateA;
		});
	});
	const [selectedTransaction, setSelectedTransaction] = createSignal<
		TransactionI | undefined
	>(undefined);
	const [showEditTransactionModal, setShowEditTransactionModal] =
		createSignal(false);

	// pagination
	const [currentPage, setCurrentPage] = createSignal(1);
	const rowsPerPage = 5;
	const totalItems = () => sortedArray().length;
	const totalPages = () => Math.ceil(totalItems() / rowsPerPage);

	const paginatedData = () => {
		const start = (currentPage() - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return sortedArray().slice(start, end);
	};

	const getPageNumbers = () => {
		const maxButtons = 5;
		const pages: number[] = [];
		let startPage = Math.max(1, currentPage() - Math.floor(maxButtons / 2));
		let endPage = Math.min(totalPages(), startPage + maxButtons - 1);

		if (endPage - startPage + 1 < maxButtons) {
			startPage = Math.max(1, endPage - maxButtons + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return pages;
	};

	// date sorting
	const sortByDate = () => {
		setSortOrder(sortOrder() === "asc" ? "desc" : "asc");
	};

	const headers: Header[] = [
		{
			headerName: "Amount",
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
						{paginatedData().length === 0 ? (
							<tr>
								<td colSpan={6} class="no-data">
									No data available
								</td>
							</tr>
						) : (
							<For each={paginatedData()}>
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
						)}
					</tbody>
				</table>
				<nav class="paginationContainer" aria-label="Table navigation">
					<span class="paginationLHS">
						Showing{" "}
						<span class="highlight">
							{(currentPage() - 1) * rowsPerPage + 1} -{" "}
							{Math.min(currentPage() * rowsPerPage, totalItems())}{" "}
						</span>
						of <span class="highlight">{totalItems()}</span>
					</span>
					<ul class="paginationButtonsContainer">
						<li>
							<button
								onClick={() => setCurrentPage(Math.max(1, currentPage() - 1))}
								disabled={currentPage() === 1}
								id="previous"
								class="paginationButton"
							>
								Previous
							</button>
						</li>
						<For each={getPageNumbers()}>
							{(page) => (
								<li>
									<button
										onClick={() => setCurrentPage(page)}
										class={`paginationButton
                        ${
													currentPage() === page
														? "currentPageButton"
														: "otherPageButton"
												}`}
									>
										{page}
									</button>
								</li>
							)}
						</For>
						<li>
							<button
								onClick={() =>
									setCurrentPage(Math.min(totalPages(), currentPage() + 1))
								}
								disabled={currentPage() === totalPages()}
								id="next"
								class="paginationButton"
							>
								Next
							</button>
						</li>
					</ul>
				</nav>
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
							{i.isSortable && i.sortFn ? (
								<SortIcon onClick={() => i.sortFn()} />
							) : (
								""
							)}
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
