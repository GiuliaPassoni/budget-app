import { Toaster } from "solid-toast";
import { useNavigate } from "@solidjs/router";
import { handleSignIn, handleSignUp } from "~/helpers/auth_helpers";
import addUser from "~/helpers/db_helpers";

import "./style.css";
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
	const { handleInput, handleSubmitSignUp, handleSubmitSignIn } = useForm({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

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
						onInput={handleInput}
					/>
				</div>
				<div class="submit-buttons">
					<button type="submit" onClick={(e) => handleSubmitSignUp(e)}>
						Sign up
					</button>
					{/*//todo only render if user already exists after validation checks*/}
					<button type="submit" onClick={(e) => handleSubmitSignIn(e)}>
						Log in
					</button>
				</div>
			</form>
			<Toaster />
			{/*//todo replace toaster with a custom component, something like https://github.com/Jerga99/solidjs-glider/commit/5511e6b60bfc2f613fcefccd8ba4c6e372f2589b#diff-49e2304a494a23a0c20709948f6340a6c8bd21fe6cf4ab96fb20d230a598415e*/}
		</>
	);
}
