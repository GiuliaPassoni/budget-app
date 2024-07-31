import * as currencies from "~/assets/currencies.json";
// @ts-ignore
const lessCommonCurrencies = currencies["default"]
	.filter((i: { currency_code: string }) => i.currency_code !== "EUR")
	.filter((i: { currency_code: string }) => i.currency_code !== "USD")
	.filter((i: { currency_code: string }) => i.currency_code !== "GBP")
	.filter((i: { currency_code: string }) => i.currency_code !== "CHF")
	.filter((i: { currency_code: string }) => i.currency_code !== "JPY");

let allCurrencies = [
	{
		country: "EU",
		currency_code: "EUR",
	},
	{
		country: "United States",
		currency_code: "USD",
	},
	{
		country: "UK",
		currency_code: "GBP",
	},
	{
		country: "Switzerland",
		currency_code: "CHF",
	},
	{
		country: "Japan",
		currency_code: "JPY",
	},
	...lessCommonCurrencies.sort(function (
		a: { currency_code: number },
		b: { currency_code: number },
	) {
		if (a.currency_code < b.currency_code) {
			return -1;
		}
		if (a.currency_code > b.currency_code) {
			return 1;
		}
		return 0;
	}),
];

export default allCurrencies;
