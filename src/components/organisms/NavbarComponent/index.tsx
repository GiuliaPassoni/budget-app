import "./style.css";

// the component itself can't have the same name as the bootstrap <NavbarComponent> component
import { createEffect, createSignal, Show } from "solid-js";
import { currentUser } from "~/firebase";
import SignOutButton from "~/components/molecules/SignOutButton";
import { A } from "@solidjs/router";

export default function NavbarComponent() {
	const [loginLink, setLoginLink] = createSignal("Log In");

	createEffect(() => {
		if (currentUser()) {
			console.debug("User logged in");
		} else {
			console.debug("No user");
		}
	}, [currentUser()]);

	return (
		<nav class="navbar">
			<ul>
				<li>
					<A href="/auth/overview">Overview</A>
				</li>
				<li>
					<A href="/auth/transactions">Your Transactions</A>
				</li>
				<li>
					<A href="/auth/categories">Your Categories</A>
				</li>
			</ul>
			<div id="auth-button-container">
				<Show when={!currentUser()} fallback={<SignOutButton />}>
					<A href="/signup" id="auth-button">
						{loginLink()}
					</A>
				</Show>
			</div>
		</nav>
	);
}
