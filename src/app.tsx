import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Match, Suspense, Switch } from "solid-js";
import "./app.css";
import NavBar from "~/components/organisms/NavBar";
import "flowbite";
// import { AuthProvider } from "~/contexts/AuthContext";
import useAuth from "~/hooks/useAuth";
import { app } from "~/firebase";

export default function App() {
	const authState = useAuth(app);
	return (
		// <AuthProvider>
		<Switch>
			<Match when={authState.loading}>
				<p>Loading...</p>
			</Match>
			<Match when={authState.error}>
				<p>Error</p>
			</Match>
			<Match when={authState.user}>
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
			</Match>
		</Switch>
		// </AuthProvider>
	);
}
