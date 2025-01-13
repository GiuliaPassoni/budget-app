import { createSignal } from "solid-js";
import { Toaster } from "solid-toast";
import { useNavigate } from "@solidjs/router";
import { handleSignIn } from "~/api/auth";

import "./style.css";
import { DOMElement } from "solid-js/jsx-runtime";
import { InputI } from "~/helpers/types";

export default function LogInComponent() {
	const [form, setForm] = createSignal({
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	function handleInput(e: InputI) {
		setForm({ ...form(), [e.currentTarget.name]: e.currentTarget.value });
	}

	return (
		<>
			<form class="signup-form">
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

				<div class="submit-buttons">
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
