import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import NavBar from "~/components/organisms/NavBar";
import "flowbite";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";

export default function App() {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<SolidQueryDevtools initialIsOpen={true} buttonPosition="bottom-right" />
			<Router
				root={(props) => (
					<MetaProvider>
						<NavBar />
						<Suspense>{props.children}</Suspense>
					</MetaProvider>
				)}
			>
				<FileRoutes />
			</Router>
		</QueryClientProvider>
	);
}
