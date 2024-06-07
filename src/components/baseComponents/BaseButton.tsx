import { Button } from "solid-bootstrap";

export default function BaseButton(props: any) {
	const { ...rest } = props;
	return <Button {...rest}></Button>;
}
