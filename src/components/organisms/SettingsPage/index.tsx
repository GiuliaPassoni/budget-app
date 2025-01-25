import "./style.css";
import MainLayout from "~/components/organisms/MainLayout";
import { createSignal, For } from "solid-js";
import allCurrencies from "~/helpers/mock_values_helpers";

export default function SettingsPage() {
	console.debug("Settings Page");
	const [currency, setCurrency] = createSignal("EUR"); //todo should be store?

	return (
		<MainLayout title="Settings">
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
								setCurrency(e.target.value);
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
