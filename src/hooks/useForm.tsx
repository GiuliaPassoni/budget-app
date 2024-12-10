import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { handleSignIn, handleSignUp } from "~/helpers/auth_helpers";
import addUser from "~/helpers/db_helpers";
import { FormI, InputI } from "~/helpers/types";

export default function useForm(initialForm: FormI) {
	const [form, setForm] = createStore<FormI>(initialForm);

	const navigate = useNavigate();

	function handleInput(e: InputI) {
		const { name, value } = e.currentTarget;
		setForm(name as keyof FormI, value);
	}
	//todo instead of a separate login component, adjust this according to need?

	async function handleSubmitSignUp(e: InputI) {
		e.preventDefault();
		const signedupuser = await handleSignUp({
			email: form().email,
			password: form().password,
		});
		await addUser({ user: signedupuser });
		navigate("/auth/overview");
	}

	async function handleSubmitSignIn(e: InputI) {
		e.preventDefault();
		handleSignIn({ email: form().email, password: form().password });
		navigate("/overview");
	}
	return {};
}
