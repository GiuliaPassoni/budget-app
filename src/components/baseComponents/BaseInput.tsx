import { InputGroup } from "solid-bootstrap";

export default function BaseInput(props: any) {
	const { ...rest } = props;
	return <InputGroup {...rest} />;
}
