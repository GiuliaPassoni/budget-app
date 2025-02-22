import { createSignal, onMount } from "solid-js";
import { TransactionType } from "~/helpers/types";
import {
	TransactionI,
	TransactionWithId,
} from "~/helpers/expenses_api_helpers";
import { currentUser } from "~/firebase";
import MainLayout from "~/components/organisms/MainLayout";
import { useFirebaseCollection } from "~/hooks/useFirebaseCollection";
import BarChart from "~/components/molecules/BarChart";
import { useAuthState } from "~/services/provider/auth";
import OverviewTable from "~/components/molecules/OverviewTable";

export default function OverviewPage() {
	const [database, setDatabase] = createSignal<TransactionType>("expenses");
	const { loading, error, fetchTotalAmountEver, fetchDataForMultiplePeriods } =
		useFirebaseCollection<TransactionI, TransactionWithId>({
			collectionPath: () => {
				const userId = currentUser();
				return userId ? ["users", userId, database()] : undefined;
			},
		});

	const fetchChartData = async () => {
		const numberOfPeriods = 3; // Fetch data for the last 3 periods
		const periodType = "monthly"; // Change to "weekly" or "yearly" if needed

		const incomeData = await fetchDataForMultiplePeriods({
			type: "income",
			periodType,
			numberOfPeriods,
		});

		const expensesData = await fetchDataForMultiplePeriods({
			type: "expenses",
			periodType,
			numberOfPeriods,
		});

		const investmentsData = await fetchDataForMultiplePeriods({
			type: "investments",
			periodType,
			numberOfPeriods,
		});

		// Calculate profit/loss for each period
		const chartData = incomeData.map((income: any, index: number) => {
			const expenses = expensesData[index].totalOverPeriod;
			const investments = investmentsData[index].totalOverPeriod;
			const profitLoss = income.totalOverPeriod - expenses;

			return {
				period: income.periodLabel.startDate, // Use start date as the period label
				income: income.totalOverPeriod,
				expenses,
				investments,
				profitLoss,
			};
		});

		return chartData;
	};

	const { user, updateUser } = useAuthState();

	const [currency, setCurrency] = createSignal("EUR");

	const [totalIncome, setTotalIncome] = createSignal(0);
	const [totalExpenses, setTotalExpenses] = createSignal(0);
	const [totalInvestment, setTotalInvestment] = createSignal(0);

	const [barDataLoading, setIsBarDataLoading] = createSignal(true);
	const [barChartData, setBarChartData] = createSignal([]);

	onMount(async () => {
		if (user) {
			setCurrency(user.selectedCurrency);
			if (currency()) {
				updateUser({ selectedCurrency: currency() });
			}
		}
		const expenses = await fetchTotalAmountEver({ type: "expenses" }),
			income = await fetchTotalAmountEver({ type: "income" }),
			investments = await fetchTotalAmountEver({ type: "investments" });
		setTotalExpenses(expenses);
		setTotalIncome(income);
		setTotalInvestment(investments);

		try {
			const data = await fetchChartData();
			setBarChartData(data);
		} catch (e) {
			console.error(e);
		} finally {
			setIsBarDataLoading(false); // Set loading to false when done
		}
	});

	return (
		<MainLayout title="Overview">
			<section class="w-full h-full mx-auto">
				<OverviewTable
					headers={["expenses", "income", "investments"]}
					totals={[totalExpenses(), totalIncome(), totalInvestment()]}
					currency={currency()}
				/>
				<div>
					{loading() && <p>Loading...</p>}
					{/*{error() && <p>Error: {error()}</p>}*/}
					{!loading() && !error() && (
						<div class="w-full flex flex-row gap-4">
							<div class="w-1/2 mx-auto flex flex-col justify-between">
								<div class="p-6 border rounded-lg mt-2 shadow-sm bg-gray-800 border-gray-700 mx-auto">
									{barDataLoading() ? (
										<p>Loading chart data...</p>
									) : (
										<BarChart
											data={barChartData()}
											w={500}
											h={500}
											label={"Chart"}
										/>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</MainLayout>
	);
}
