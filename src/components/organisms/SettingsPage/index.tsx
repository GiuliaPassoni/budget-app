import "./style.css";
import MainLayout from "~/components/organisms/MainLayout";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import allCurrencies from "~/helpers/mock_values_helpers";
import { useFirebaseCollection } from "~/hooks/useFirebaseCollection";
import { currentUser } from "~/firebase";
import SpinnerIcon from "~/components/atoms/icons/SpinnerIcon";
import { useAuthState } from "~/services/provider/auth";
import BarChart from "~/components/atoms/BarChart";

export default function SettingsPage() {
	const { user, updateUser } = useAuthState();

	const [currency, setCurrency] = createSignal("EUR");

	const handleCurrencyChange = (newCurrency: string) => {
		if (user) {
			updateUser({ selectedCurrency: newCurrency });
		}
	};

	const mockData = [
		{
			date: "01-12-2024",
			expenses: 1000,
			income: 1003,
			investments: 800,
			delta: 3,
		},
		{
			date: "01-01-2025",
			expenses: 2000,
			income: 1003,
			investments: 950,
			delta: -997,
		},
	];

	// todo move to their own store/context
	const { fetchTotalAmountEver } = useFirebaseCollection({
		collectionPath: () => [`users/${currentUser()}/expenses`], //todo this isn't currently used
	});

	const [totalIncome, setTotalIncome] = createSignal(0);
	const [totalExpenses, setTotalExpenses] = createSignal(0);
	const [totalInvestment, setTotalInvestment] = createSignal(0);

	createEffect(() => {
		console.debug("user createffect", user, user?.selectedCurrency);
	});

	onMount(async () => {
		console.debug("user onmount", user, user?.selectedCurrency);
		if (user) {
			setCurrency(user.selectedCurrency);
			if (currency()) {
				updateUser({ selectedCurrency: currency() });
			}
		}
		console.debug("user cur", user?.selectedCurrency);
		const expenses = await fetchTotalAmountEver({ type: "expenses" }),
			income = await fetchTotalAmountEver({ type: "income" }),
			investments = await fetchTotalAmountEver({ type: "investments" });
		setTotalExpenses(expenses);
		setTotalIncome(income);
		setTotalInvestment(investments);
	});

	return (
		<MainLayout title="Settings">
			<div>
				Expenses:
				<Show when={totalExpenses()} fallback={<SpinnerIcon />}>
					{" "}
					{totalExpenses().toFixed(2) ?? 0} {currency()}
				</Show>
			</div>
			<div>
				Income:
				<Show when={totalIncome()} fallback={<SpinnerIcon />}>
					{" "}
					{totalIncome().toFixed(2) ?? 0} {currency()}
				</Show>
			</div>
			<div>
				Invested:
				<Show when={totalInvestment()} fallback={<SpinnerIcon />}>
					{" "}
					{totalInvestment().toFixed(2) ?? 0} {currency()}
				</Show>
			</div>
			<div>
				Current currency:
				<Show when={user} fallback={<SpinnerIcon />}>
					{" "}
					{user?.selectedCurrency}
				</Show>
			</div>
			<form>
				<div>
					<div>
						<label for="category" class="block mb-2 text-sm font-medium">
							Default Currency
						</label>
						<select
							onChange={(e) => {
								setCurrency(e.target.value);
								handleCurrencyChange(e.target.value);
							}}
							value={currency()}
							required={true}
							id="category"
							class="bg-gray-800 rounded-lg border-none text-left text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
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
			<div class="w-1/2">
				<BarChart data={mockData} w={500} h={500} label={"Chart"} />
			</div>
		</MainLayout>
	);
}
