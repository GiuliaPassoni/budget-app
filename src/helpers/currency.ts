import axios from "axios";

const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;
// https://currencyfreaks.com/#Latest
const baseUrl = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}`;

//Get Rates of Desired Currencies Only
export async function getExchange({
	fromCurrency,
	toCurrency,
}: {
	fromCurrency: string;
	toCurrency: string;
}) {
	const url = `${baseUrl}&symbols=${fromCurrency},${toCurrency}`;
	try {
		const { data } = await axios.get(url);
		return { date: data.date, rate: data.rates };
	} catch (error) {
		console.error("Error retrieving exchange rate");
	}
}
