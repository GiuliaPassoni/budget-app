import { Toaster } from "solid-toast";
import { A } from "@solidjs/router";

import "./style.css";
import { AuthForm } from "~/helpers/forms/formTypes";
import Button from "~/components/atoms/Button";
import useForm from "~/hooks/useForm";
import {
	emailValidator,
	inputLengthValidator,
	requiredField,
} from "~/helpers/forms/validators";
import FormError from "~/components/atoms/FormError";
// todo make smarter reusability btw this and signup component
export default function LogInComponent() {
	const { form, handleInput, validate, handleSubmit, errors } =
		useForm<AuthForm>({
			email: "",
			password: "",
		});

	async function submitLogin() {
		return await handleSubmit({ type: "login" });
	}

	return (
		<>
			<form class="signup-form">
				<h3 class="title">Log in</h3>
				<div class="entry">
					<label for="email">Your email</label>
					<input
						use:validate={[requiredField, emailValidator]}
						type="email"
						name="email"
						id="email"
						placeholder="name@budgetapp.com"
						required
						onInput={handleInput}
					/>
					<FormError>{errors["email"]}</FormError>
				</div>
				<div class="entry">
					<label for="password">Your password</label>
					<input
						use:validate={[
							requiredField,
							(el) => inputLengthValidator(el, 7, 16),
						]}
						type="password"
						name="password"
						id="password"
						required
						onInput={handleInput}
					/>
					<FormError>{errors["password"]}</FormError>
				</div>
				<div class="link-container">
					No account yet?{" "}
					<A class="page-link" href="/signup">
						Sign up
					</A>
				</div>
				<div class="submit-buttons">
					<Button
						type="submit"
						styleClass="primary px-3 text-lg"
						onClick={submitLogin}
					>
						Log in
					</Button>
				</div>
			</form>
			<Toaster />
			{/*//todo replace toaster with a custom component, something like https://github.com/Jerga99/solidjs-glider/commit/5511e6b60bfc2f613fcefccd8ba4c6e372f2589b#diff-49e2304a494a23a0c20709948f6340a6c8bd21fe6cf4ab96fb20d230a598415e*/}
		</>
	);
}
