import { createStore, produce } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import { handleAuthenticate } from "~/api/auth";
import {
	AuthForm,
	FormDataType,
	FormErrors,
	RegisterForm,
	SubmitCallback,
	ValidatorFieldConfig,
	ValidatorType,
} from "~/helpers/forms/formTypes";
import JSX from "solid-js";

// Add custom directive
declare module "solid-js/jsx-runtime" {
	namespace JSX {
		interface Directives {
			validate: ValidatorType[];
		}
	}
}

interface PropsI<T extends FormDataType> {
	type: "signup" | "login";
	callback?: SubmitCallback<T>;
}

// todo reuse this form for the settings
export default function useForm<T extends FormDataType>(initialForm: T) {
	const [form, setForm] = createStore(initialForm);
	const [errors, setErrors] = createStore<FormErrors>({});

	const validatorFields: { [key: string]: ValidatorFieldConfig } = {};

	const navigate = useNavigate();

	function isValid() {
		const keys = Object.keys(errors);
		if (keys.length === 0) return false; //no input was validated, hence form isn't valid

		// if no error has value, the form is valid
		return !keys.some((errKey) => {
			return errors[errKey].length > 0;
		});
	}

	function handleInput(e: any) {
		const { name, value } = e.currentTarget;
		setForm(name as any, value as any);
	}

	function validate(
		element: HTMLInputElement,
		accessor: JSX.Accessor<ValidatorType[]>,
	) {
		const validators = accessor() || [];

		let config: ValidatorFieldConfig;
		validatorFields[element.name] = config = { element, validators };

		element.onblur = () => {
			checkValidity(config);
		};
	}

	function checkValidity({ element, validators }: ValidatorFieldConfig) {
		setErrors(element.name, []);
		for (const validator of validators) {
			const errorMessage = validator(element);
			if (!!errorMessage) {
				setErrors(
					produce((errors) => {
						errors[element.name].push(errorMessage);
					}),
				);
			}
		}
	}

	async function handleSubmit({
		type,
		callback,
	}: PropsI<FormDataType | RegisterForm | AuthForm>) {
		for (const field in validatorFields) {
			const config = validatorFields[field];
			checkValidity(config);
		}
		if (isValid()) {
			if (callback) {
				return callback(form);
			}

			await handleAuthenticate({ form, type });
			// if (type === "signup") {
			// 	const user = await handleRegister(form as unknown as RegisterForm);
			//		addUser(user)
			// } else {
			// 	await handleLogIn(form as unknown as AuthForm);
			// }
			// todo redirect doesn't work
			navigate("/auth/overview");
		}
	}

	return {
		form,
		handleInput,
		validate,
		handleSubmit,
		errors,
	};
}
