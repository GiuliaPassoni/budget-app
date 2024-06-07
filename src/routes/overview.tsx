import { Title } from "@solidjs/meta";
import ChartCard from "~/components/molecules/ChartCard";
import { addUser, getUsers } from "~/firebase";
import BaseButton from "~/components/baseComponents/BaseButton";
import { InputGroup } from "solid-bootstrap";
import BaseInput from "~/components/baseComponents/BaseInput";
import { createEffect, createSignal } from "solid-js";

export default function Overview() {
	const [name, setName] = createSignal("");
	const [email, setEmail] = createSignal("");

	createEffect(() => {
		console.debug(name);
	}, [name]);

	return (
		<main>
			<Title>Overview</Title>
			<h1>Your transaction overview</h1>
			<InputGroup>
				<BaseInput
					type="text"
					// value={name}
					// onBlur={(e) => setName(e.target.value)}
				/>
				<BaseInput type="email" value={email} />
			</InputGroup>
			<BaseButton onClick={addUser({ name, email })}>
				Add to users db
			</BaseButton>
			<BaseButton onClick={getUsers}> All users db </BaseButton>
			<ChartCard />
		</main>
	);
}
