import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Show, Suspense } from "solid-js";
import "./app.css";
import "flowbite";
import AuthProvider from "~/services/provider/auth";
import Footer from "~/components/organisms/Footer";
import NavbarComponent from "~/components/organisms/NavbarComponent";

if (import.meta.hot) {
	// Type-safe HMR data initialization
	if (!import.meta.hot.data.hmrUpdate) {
		import.meta.hot.data.hmrUpdate = false;
	}

	// Set update state when HMR occurs
	import.meta.hot.on("vite:beforeUpdate", () => {
		import.meta.hot!.data.hmrUpdate = true;
	});

	// Clear state after update
	import.meta.hot.on("vite:afterUpdate", () => {
		setTimeout(() => {
			import.meta.hot!.data.hmrUpdate = false;
		}, 500);
	});
}

export default function App() {
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<AuthProvider>
						<NavbarComponent />
						<Suspense>{props.children}</Suspense>
						<Footer />
						<Show
							when={
								import.meta.env.DEV &&
								(import.meta.hot?.data.hmrUpdate as boolean)
							}
						>
							<div class="hmr-loading-indicator">Updating components...</div>
						</Show>
					</AuthProvider>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
