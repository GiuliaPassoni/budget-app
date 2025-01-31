import { createEffect, JSX, Match, Switch } from "solid-js";

import "./style.css";
import { useAuthState } from "~/services/provider/auth";
import { useNavigate } from "@solidjs/router";
import LoadingSpinner from "~/components/atoms/LoadingSpinner";

interface PropsI {
	title: JSX.Element | string;
	children: JSX.Element;
}

export default function MainLayout(props: PropsI) {
	// const authState = useAuthState();
	const navigate = useNavigate();
	const { user, loading, isAuthenticated } = useAuthState();

	createEffect(() => {
		if (loading) return;
		if (!isAuthenticated) {
			navigate("/login", { replace: true });
		}
	});

	return (
		<Switch>
			<Match when={loading}>
				<LoadingSpinner />
				<div>Loading...</div>
			</Match>
			<Match when={!loading && !user}>
				<div>Please log in to continue.</div>
			</Match>
			<Match when={!loading && user}>
				<div class="main-layout">
					<div class="layout-center">
						<div class="title">{props.title}</div>
						<div class="main-content">{props.children}</div>
					</div>
				</div>
			</Match>
		</Switch>
	);
}
