import { Button } from "solid-bootstrap";

// TODO check out https://tailwindcss.com/docs/reusing-styles for reusability
export default function BaseButton(props: any) {
	const { ...rest } = props;
	return <Button {...rest}></Button>;
}
