import { JSX, onMount } from "solid-js";

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

	// onMount(() => {
	if (!authState?.isAuthenticated) {
		navigate("/signup", { replace: true });
	}
	// });

	return (
		<div class="main-layout">
			<div class="layout-center">
				<div class="title">{props.title}</div>
				<div class="main-content">{props.children}</div>
			</div>
		</div>
	);
}
