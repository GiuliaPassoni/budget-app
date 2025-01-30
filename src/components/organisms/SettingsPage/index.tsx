import "./style.css";
import MainLayout from "~/components/organisms/MainLayout";
import { createSignal, For, onMount, Show } from "solid-js";
import allCurrencies from "~/helpers/mock_values_helpers";
import { useFirebaseCollection } from "~/hooks/useFirebaseCollection";
import { currentUser } from "~/firebase";
import SpinnerIcon from "~/components/atoms/icons/SpinnerIcon";
import { getExchange } from "~/helpers/currency";
import { useAuthState } from "~/services/provider/auth";

export default function SettingsPage() {
	const { user, updateUser } = useAuthState();

	const handleCurrencyChange = (newCurrency: string) => {
		if (user) {
			updateUser({ selected_currency: newCurrency });
		}
	};

	// todo move to their own store/context
	const { fetchTotalAmountEver, fetchAmountByPeriod } = useFirebaseCollection({
		collectionPath: () => [`users/${currentUser()}/expenses`], //todo this isn't currently used
	});

	const [test, setTest] = createSignal<any>();

	const [totalIncome, setTotalIncome] = createSignal(0);
	const [totalExpenses, setTotalExpenses] = createSignal(0);
	const [monthlyExpenses, setMonthlyExpenses] = createSignal(0);
	const [totalInvestment, setTotalInvestment] = createSignal(0);

	onMount(async () => {
		const expenses = await fetchTotalAmountEver({ type: "expenses" }),
			income = await fetchTotalAmountEver({ type: "income" }),
			investments = await fetchTotalAmountEver({ type: "investments" });
		setTotalExpenses(expenses);
		setTotalIncome(income);
		setTotalInvestment(investments);

		const monthlyExp = await fetchAmountByPeriod({
			type: "expenses",
			periodType: "monthly",
		});
		setMonthlyExpenses(monthlyExp);

		try {
			const res = await getExchange({ fromCurrency: "EUR", toCurrency: "USD" });
			setTest(res.rate["EUR"]);
		} catch {
			throw new Error("error");
		}
	});

	return (
		<MainLayout title="Settings">
			<div>
				Expenses:
				<Show when={totalExpenses()} fallback={<SpinnerIcon />}>
					{totalExpenses()}
				</Show>
			</div>
			<div>
				Income:
				<Show when={totalIncome()} fallback={<SpinnerIcon />}>
					{totalIncome()}
				</Show>
			</div>
			<div>
				Invested:
				<Show when={totalInvestment()} fallback={<SpinnerIcon />}>
					{totalInvestment()}
				</Show>
			</div>
			<div>
				Monthly Expenses:
				<Show when={monthlyExpenses()} fallback={<SpinnerIcon />}>
					{monthlyExpenses()}
				</Show>
			</div>
			<div>
				test:
				<Show when={test()} fallback={<SpinnerIcon />}>
					{test()}
				</Show>
			</div>
			<form>
				<div>
					<div class="col-span-4 sm:col-span-1 mx-3 p-2">
						<label
							for="category"
							class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>
							Default Currency
						</label>
						<select
							onChange={(e) => {
								handleCurrencyChange(e.target.value);
								console.debug(user?.selected_currency);
							}}
							required={true}
							id="category"
							class="bg-transparent border-none text-left text-gray-500 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						>
							<For each={allCurrencies}>
								{(i) => (
									<option value={i.currency_code}>
										{i.currency_code} ({i.country})
									</option>
								)}
							</For>
						</select>
					</div>
				</div>
			</form>
		</MainLayout>
	);
}
