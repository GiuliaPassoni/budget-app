import { Title } from "@solidjs/meta";
import { createSignal, ErrorBoundary, Show } from "solid-js";

export default function Home() {
	const randomNumber = Number((Math.random() * 1000).toFixed(2));
	const [totalAccount, setTotalAccount] = createSignal(randomNumber);
	const [defaultCurrency, setDefaultCurrency] = createSignal("EUR");
	const [defaultCurrencySymbol, setDefaultCurrencySymbol] = createSignal("€");
	// const currencySymbols = [{ "EUR": "€", "USD": "$"}]

	return (
		<ErrorBoundary
			fallback={(err, reset) => (
				<div onClick={reset}>Error: {err.toString()}</div>
			)}
		>
			<main>
				<Title>Your Account Overview</Title>
				<h1>Your Account</h1>
				<h3>
					You have{" "}
					<strong>
						{defaultCurrencySymbol()} {totalAccount()}
					</strong>{" "}
					in your account.
				</h3>
				<Show when={totalAccount() > 0}>
					<div>Congratulations! You're rich!</div>
					<img
						loading="lazy"
						style={"width: 30vw; margin-left: auto; margin-right: auto;"}
						src="src/assets/images/rich_cat.jpg"
						alt="Rich cat swimming in money"
					/>
				</Show>
			</main>
		</ErrorBoundary>
	);
}
