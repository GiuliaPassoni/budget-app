import { DOMElement } from "solid-js/jsx-runtime";

export type FormDataType = { [key: string]: string };

export type AuthForm = {
	email: string;
	password: string;
} & FormDataType;

export type RegisterForm = {
	name: string;
	avatar?: string;
	confirmPassword: string;
} & AuthForm;

export type SubmitCallback<T extends FormDataType> = (f: T) => void;

export type ValidatorFieldConfig = {
	element: HTMLInputElement;
	validators: ValidatorType[];
};

export type ValidatorType = (
	element: HTMLInputElement,
	...rest: any[]
) => string;

export type FormErrors = {
	[key: string]: string[];
};

// Event types

export type InputI = InputEvent & {
	currentTarget: HTMLInputElement;
	target: HTMLInputElement extends
		| HTMLInputElement
		| HTMLSelectElement
		| HTMLTextAreaElement
		? HTMLInputElement
		: DOMElement;
};

export type ButtonI = MouseEvent & {
	currentTarget: HTMLButtonElement;
	target: Element;
};
