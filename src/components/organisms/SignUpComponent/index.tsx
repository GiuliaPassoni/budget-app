import { createSignal } from "solid-js";
import { Toaster } from "solid-toast";
import { useNavigate } from "@solidjs/router";
import { handleSignIn, handleSignUp } from "~/helpers/auth_helpers";
import addUser from "~/helpers/db_helpers";

import "./style.css";
import { DOMElement } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import { FormI, InputI } from "~/helpers/types";
import useForm from "~/hooks/useForm";

interface UserI {
	id?: string;
	email: string;
	password: string;
	isLoggedIn?: boolean;
}

export default function SignUpComponent() {
	const {} = useForm<FormI>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [form, setForm] = createStore<FormI>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

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

	return (
		<>
			<form class="signup-form">
				<div class="entry">
					<label for="name">Your name</label>
					<input
						type="name"
						name="name"
						id="name"
						placeholder="Elizabeth I"
						value={form().name}
						onInput={handleInput}
					/>
				</div>
				<div class="entry">
					<label for="email">Your email</label>
					<input
						type="email"
						name="email"
						id="email"
						placeholder="name@flowbite.com"
						required
						value={form().email}
						onInput={handleInput}
					/>
				</div>
				<div class="entry">
					<label for="password">Your password</label>
					<input
						type="password"
						name="password"
						id="password"
						required
						value={form().password}
						onInput={handleInput}
					/>
				</div>
				<div class="entry">
					<label for="confirmPassword">Confirm password</label>
					<input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						required
						value={form().confirmPassword}
						onInput={handleInput}
					/>
				</div>
				<div class="submit-buttons">
					<button
						type="submit"
						onClick={async (e) => {
							e.preventDefault();
							const signedupuser = await handleSignUp({
								email: form().email,
								password: form().password,
							});
							await addUser({ user: signedupuser });
							navigate("/auth/overview");
						}}
					>
						Sign up
					</button>
					{/*//todo only render if user already exists after validation checks*/}
					<button
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							handleSignIn({ email: form().email, password: form().password });
							navigate("/overview");
						}}
					>
						Log in
					</button>
				</div>
			</form>
			<Toaster />
			{/*//todo replace toaster with a custom component, something like https://github.com/Jerga99/solidjs-glider/commit/5511e6b60bfc2f613fcefccd8ba4c6e372f2589b#diff-49e2304a494a23a0c20709948f6340a6c8bd21fe6cf4ab96fb20d230a598415e*/}
		</>
	);
}
