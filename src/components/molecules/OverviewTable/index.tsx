import { TransactionType } from "~/helpers/types";
import { For } from "solid-js";
import styles from "./style.module.css";

interface OverviewTablePropI {
	headers: TransactionType[];
	totals: number[];
	currency: string;
}

export default function OverviewTable(props: OverviewTablePropI) {
	const totals = () => props.totals;
	const currency = () => props.currency;
	return (
		<div class={styles.container}>
			<table>
				<thead>
					<tr>
						<td>Currency</td>
						<For each={["expenses", "income", "investments"]}>
							{(i) => <th scope="col">{i}</th>}
						</For>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{currency()}</td>
						<For each={totals()}>{(t) => <td>{t}</td>}</For>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
