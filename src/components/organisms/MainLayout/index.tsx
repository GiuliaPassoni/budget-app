import { createEffect, JSX } from "solid-js";

import "./style.css";
import { useAuthState } from "~/services/provider/auth";
import { useNavigate } from "@solidjs/router";

interface PropsI {
	title: JSX.Element | string;
	children: JSX.Element;
}

export default function MainLayout(props: PropsI) {
	const authState = useAuthState();
	const navigate = useNavigate();

	createEffect(() => {
		if (authState.loading) return; // Wait for auth initialization
		if (!authState?.isAuthenticated) {
			navigate("/login", { replace: true });
		}
	});

	return (
		<div class="main-layout">
			<div class="layout-center">
				<div class="title">{props.title}</div>
				<div class="main-content">{props.children}</div>
			</div>
		</div>
	);
}
