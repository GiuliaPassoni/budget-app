import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import "flowbite";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import AuthProvider from "~/services/provider/auth";
import Footer from "~/components/organisms/Footer";
import NavbarComponent from "~/components/organisms/NavbarComponent";

export default function App() {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<SolidQueryDevtools initialIsOpen={true} buttonPosition="bottom-right" />
			<Router
				root={(props) => (
					<MetaProvider>
						<AuthProvider>
							<NavbarComponent />
							<Suspense>{props.children}</Suspense>
							<Footer />
						</AuthProvider>
					</MetaProvider>
				)}
			>
				<FileRoutes />
			</Router>
		</QueryClientProvider>
	);
}
