import { JSX } from "solid-js";

import "./style.css";

interface PropsI {
	title: JSX.Element | string;
	children: JSX.Element;
}

export default function MainLayout(props: PropsI) {
	return (
		<div class="main-layout">
			<div class="layout-center">
				<div class="title">{props.title}</div>
				<div class="main-content">{props.children}</div>
			</div>
		</div>
	);
}
