import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { handleSignIn, handleSignUp } from "~/helpers/auth_helpers";
import addUser from "~/helpers/db_helpers";
import { ButtonI, FormI, InputI } from "~/helpers/types";

export default function useForm(initialForm: FormI) {
	const [form, setForm] = createStore<FormI>(initialForm);

	const navigate = useNavigate();

	function handleInput(e: InputI) {
		const { name, value } = e.currentTarget;
		setForm(name as keyof FormI, value);
	}
	//todo instead of a separate login component, adjust this according to need?

	async function handleSubmitSignUp(e: ButtonI) {
		e.preventDefault();
		const user = await handleSignUp({
			email: form.email,
			password: form.password,
		});
		await addUser({ user });
		navigate("/auth/overview");
	}

	async function handleSubmitSignIn(e: ButtonI) {
		e.preventDefault();
		handleSignIn({ email: form.email, password: form.password });
		navigate("/auth/overview");
	}
	return {
		handleInput,
		handleSubmitSignUp,
		handleSubmitSignIn,
	};
}
