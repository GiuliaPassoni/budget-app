import { Toaster } from "solid-toast";
import "./style.css";
import { RegisterForm } from "~/helpers/forms/formTypes";
import {
	emailValidator,
	inputLengthValidator,
	matchingPasswords,
	requiredField,
} from "~/helpers/forms/validators";
import FormError from "~/components/atoms/FormError";
import useForm from "~/hooks/useForm";

export default function SignUpComponent() {
	const { form, handleInput, validate, handleSubmit, errors } =
		useForm<RegisterForm>({
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
						use:validate={[requiredField, inputLengthValidator]}
						type="name"
						name="name"
						id="name"
						placeholder="Elizabeth I"
						onInput={handleInput}
					/>
					<FormError>{errors["name"]}</FormError>
				</div>
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
				<div class="entry">
					<label for="confirmPassword">Confirm password</label>
					<input
						use:validate={[
							requiredField,
							(el) => matchingPasswords(el, form.password),
						]}
						type="password"
						name="confirmPassword"
						id="confirmPassword"
						required
						onInput={handleInput}
					/>
					<FormError>{errors["confirmPassword"]}</FormError>
				</div>
				<div class="submit-buttons">
					<button
						type="submit"
						onClick={(e) => handleSubmit({ e, type: "signup" })}
					>
						Sign up
					</button>
					{/*//todo only render if user already exists after validation checks*/}
					<button
						type="submit"
						onClick={(e) => handleSubmit({ e, type: "login" })}
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
