import "./style.css";

// the component itself can't have the same name as the bootstrap <NavbarComponent> component
import { onAuthStateChanged } from "firebase/auth";
import { createEffect, createSignal, Show } from "solid-js";
import { currentUser, setCurrentUser } from "~/firebase";
import SignOutButton from "~/components/molecules/SignOutButton";
import { A } from "@solidjs/router";

export default function NavbarComponent() {
	const [loginLink, setLoginLink] = createSignal("Log In");

	createEffect(() => {
		console.debug(currentUser());
		if (currentUser()) {
			console.debug("User logged in");
		} else {
			console.debug("No user");
		}
	}, [currentUser()]);

	return (
		<nav class="navbar">
			<div class="container" id="navbar-user">
				<ul>
					<li>
						<A
							href="/#"
							// aria-current="page"
						>
							Home
						</A>
					</li>
					<li>
						<A href="/auth/overview">Overview</A>
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
			</div>
		</nav>
	);
}
