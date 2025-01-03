export function requiredField<ValidatorType>(element: HTMLInputElement) {
	return element.value.length === 0 ? `${element.name} field is required` : "";
}

export function inputMaxLengthValidator<ValidatorType>(
	element: HTMLInputElement,
	maxLen = 15,
) {
	if (
		element.value &&
		element.value.length > 0 &&
		element.value.length <= maxLen
	) {
		return "";
	}
	return `${element.name} should be less than ${maxLen} characters`;
}

export function inputMinLengthValidator<ValidatorType>(
	element: HTMLInputElement,
	minLen = 4,
) {
	if (
		element.value &&
		element.value.length > 0 &&
		element.value.length >= minLen
	) {
		return "";
	}
	return `${element.name} should be more than ${minLen} characters`;
}

export function inputLengthValidator<ValidatorType>(
	element: HTMLInputElement,
	minLen = 4,
	maxLen = 15,
) {
	const value = element.value;
	if (
		value &&
		value.length > 0 &&
		value.length >= minLen &&
		value.length <= maxLen
	) {
		return "";
	}
	return `Input for ${element.name} should be between ${minLen} and ${maxLen} characters`;
}

export function firstUppercaseValidator<ValidatorType>(
	element: HTMLInputElement,
) {
	const { value, name } = element;

	return value[0] !== value[0].toUpperCase()
		? `First letter of ${name} should be uppercase`
		: "";
}

export function emailValidator<ValidatorType>(element: HTMLInputElement) {
	const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

	return expression.test(element.value) ? "" : "Invalid email address";
}

export function matchingPasswords<ValidatorType>(
	element: HTMLInputElement,
	password: string,
) {
	console.debug("el value", element.value, password);
	return element.value !== password ? "Passwords don't match" : "";
}
