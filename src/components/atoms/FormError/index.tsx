import "./style.css";
import { For, ParentComponent, Show } from "solid-js";

export default function FormError<ParentComponent>(props: any) {
	const errors = () => (props.children as string[]) || [];
	return (
		<Show when={errors().length > 0}>
			<For each={errors()}>{(err) => <div class="form-error">{err}</div>}</For>
		</Show>
	);
}
