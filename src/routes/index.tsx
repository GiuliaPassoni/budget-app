import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function Home(props: any) {
	const navigate = useNavigate();
	onMount(() => {
		navigate("/auth/overview");
	});
	return (
		<div>
			<h1>Hello</h1>
			{props.children}
		</div>
	);
}
