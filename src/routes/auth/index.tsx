import { RouteSectionProps, useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

export default function AuthLayout(props: RouteSectionProps) {
	const navigate = useNavigate();
	onMount(() => {
		navigate("/auth/overview");
		console.debug("hihi");
	});
	return (
		<div>
			<h1>Hello</h1>
			{props.children}
		</div>
	);
}
