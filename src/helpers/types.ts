import { iconMap } from "~/components/atoms/icons/helpers";
import { DOMElement } from "solid-js/jsx-runtime";

export type TransactionType = "expenses" | "income" | "investments";

export interface CategoryI {
	name: string;
	colour: string;
	iconName?: keyof typeof iconMap;
	type: TransactionType;
}

export type InputI = InputEvent & {
	currentTarget: HTMLInputElement;
	target: HTMLInputElement extends
		| HTMLInputElement
		| HTMLSelectElement
		| HTMLTextAreaElement
		? HTMLInputElement
		: DOMElement;
};

export interface FormI {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}
