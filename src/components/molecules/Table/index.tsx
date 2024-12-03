import { TransactionI } from "~/helpers/expenses_api_helpers";
import { For } from "solid-js";
import { format } from "date-fns";

import "./style.css";

interface TableProps {
	array: TransactionI[] | undefined; // Define the expected prop type
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
	return (
		<>
			<div class="container">
				<table>
					<Header />
					<tbody>
						{props.array?.length === 0 || !props.array ? (
							<>
								<tr>
									<td colSpan={6} class="no-data">
										No data available
									</td>
								</tr>
							</>
						) : (
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
									</tr>
								)}
							</For>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}

function Header() {
	return (
		<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="px-6 py-3">
					Transaction amount
				</th>
				<th scope="col" class="px-6 py-3">
					Currency
				</th>
				<th scope="col" class="px-6 py-3">
					Date
				</th>
				<th scope="col" class="px-6 py-3">
					Category
				</th>
				<th scope="col" class="px-6 py-3">
					Notes
				</th>
			</tr>
		</thead>
	);
}
